import { readJsonBody } from "@/lib/request-body";
import { NextResponse } from "next/server";
import { reportAdmin, reportDb } from "@/lib/report-store";
import { redactIdentifiers } from "@/lib/report-validation";
import { notifyMember } from "@/lib/notifications";
import { syncApprovedResolutionsToReports } from "@/lib/sync-approved-resolutions";

const reply = (data: object, status = 200) =>
  NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const admin = await reportAdmin();
  if (!admin) return reply({ error: "Administrator access required." }, 403);

  try {
    // Heal any earlier approvals that marked the request approved but left the dispute open.
    await syncApprovedResolutionsToReports();

    const { id, status, notes } = (await readJsonBody(request)) as Record<
      string,
      unknown
    >;
    if (
      typeof id !== "string" ||
      !["approved", "rejected"].includes(String(status)) ||
      typeof notes !== "string" ||
      notes.trim().length < 2 ||
      notes.length > 1000
    ) {
      return reply({ error: "Choose a decision and enter a review reason." }, 400);
    }

    const db = reportDb();
    const row = await db
      .prepare(
        `SELECT q.id,q.report_id,q.member_id,q.resolved_on,q.resolved_amount_paise,q.description,
                r.firm_name,r.amount_paise,r.resolved_amount_paise AS report_resolved_paise,
                r.status AS report_status,r.dispute,r.dispute_resolved
         FROM dispute_resolution_requests q
         JOIN seller_reports r ON r.id=q.report_id
         WHERE q.id=? AND q.status='pending'`,
      )
      .bind(id)
      .first<{
        id: string;
        report_id: string;
        member_id: number;
        resolved_on: string;
        resolved_amount_paise: number;
        description: string;
        firm_name: string;
        amount_paise: number | null;
        report_resolved_paise: number | null;
        report_status: string;
        dispute: number;
        dispute_resolved: number;
      }>();

    if (!row) {
      return reply({ error: "This request was already reviewed. Refresh the page." }, 409);
    }

    const now = Date.now();
    const cleanNotes = redactIdentifiers(notes.trim());
    const decision = String(status) as "approved" | "rejected";

    if (decision === "approved") {
      const amount = Math.max(0, Number(row.amount_paise) || 0);
      const alreadyResolved = Math.max(0, Number(row.report_resolved_paise) || 0);
      const settling = Math.max(0, Number(row.resolved_amount_paise) || 0);
      const remaining = Math.max(0, amount - alreadyResolved);

      if (
        row.report_status !== "approved" ||
        !Number(row.dispute) ||
        Number(row.dispute_resolved) ||
        settling <= 0 ||
        settling > remaining
      ) {
        return reply(
          {
            error:
              "The original dispute is no longer eligible for resolution. Refresh and try again.",
          },
          409,
        );
      }

      const nextResolved = Math.min(amount, alreadyResolved + settling);
      const fullyResolved = amount > 0 && nextResolved >= amount ? 1 : 0;

      const reportUpdate = fullyResolved
        ? await db
            .prepare(
              `UPDATE seller_reports
               SET resolved_amount_paise=?,
                   dispute_resolved=1,
                   resolved_on=?,
                   resolution_summary=?,
                   dispute_ongoing=0
               WHERE id=? AND status='approved' AND dispute=1 AND COALESCE(dispute_resolved,0)=0`,
            )
            .bind(nextResolved, row.resolved_on, row.description, row.report_id)
            .run()
        : await db
            .prepare(
              `UPDATE seller_reports
               SET resolved_amount_paise=?,
                   dispute_resolved=0,
                   resolved_on=?,
                   resolution_summary=?
               WHERE id=? AND status='approved' AND dispute=1 AND COALESCE(dispute_resolved,0)=0`,
            )
            .bind(nextResolved, row.resolved_on, row.description, row.report_id)
            .run();

      if (!reportUpdate.meta.changes) {
        return reply(
          { error: "The original dispute is no longer eligible for resolution." },
          409,
        );
      }
    }

    const requestUpdate = await db
      .prepare(
        `UPDATE dispute_resolution_requests
         SET status=?,admin_notes=?,reviewer=?,reviewed_at=?
         WHERE id=? AND status='pending'`,
      )
      .bind(decision, cleanNotes, admin.userId, now, id)
      .run();

    if (!requestUpdate.meta.changes) {
      return reply({ error: "This request was already reviewed. Refresh the page." }, 409);
    }

    await db
      .prepare(
        "INSERT INTO report_audit(id,report_id,actor,action,created_at) VALUES(?,?,?,?,?)",
      )
      .bind(
        crypto.randomUUID(),
        row.report_id,
        admin.userId,
        `resolution_${decision}`,
        now,
      )
      .run();

    await notifyMember(row.member_id, {
      type: `resolution_${decision}`,
      title: `Resolution request ${decision}`,
      message: `${row.firm_name}: ${cleanNotes}`,
      href: "/member/reports",
    });

    return reply({ ok: true });
  } catch {
    return reply({ error: "Unable to save resolution review." }, 500);
  }
}
