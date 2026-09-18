import { requireApprovedMember } from "@/lib/member-session";
import { categoryAccess } from "@/lib/category-access";
import { reportList } from "@/lib/report-list";
import { ReportCards } from "@/components/report-cards";
import { ReportShell } from "@/components/report-shell";
import { SearchToolbar } from "@/components/filter-bar";
import {
  LIST_PAGE_SIZE,
  ListPagination,
  paginateItems,
  parseListPage,
} from "@/components/list-pagination";
import { ListFrame } from "@/components/list-frame";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const member = await requireApprovedMember();
  const category = categoryAccess(member);
  const params = await searchParams;
  const q = String(params.q || "").trim();
  const page = parseListPage(params.page);
  if (!category) {
    return (
      <ReportShell title="My reports" description="Your submitted reports">
        <p>Category assignment is required.</p>
      </ReportShell>
    );
  }

  // Pull a wide window, then page in-app (member report volume is typically modest).
  const { reports: allReports } = await reportList(
    { id: member.id, category: category.id },
    Date.now() + 1,
    q,
  );
  const paged = paginateItems(allReports, page, LIST_PAGE_SIZE);

  const filters = (
    <SearchToolbar
      searchDefault={q}
      searchPlaceholder="Search..."
      clearHref={q ? "/member/reports" : undefined}
    />
  );

  return (
    <ReportShell
      title="My reports"
      description="Search your submissions or open a seller report."
      filters={filters}
      actions={[{ href: "/member/submit-report", label: "Submit report", variant: "primary" }]}
    >
      <ListFrame
        footer={
          <ListPagination
            basePath="/member/reports"
            params={{ q: q || undefined }}
            page={paged.page}
            total={paged.total}
            pageSize={LIST_PAGE_SIZE}
          />
        }
      >
        {paged.items.length ? (
          <div className="divide-y divide-slate-100">
            {paged.items.map(report => (
              <details key={report.id} className="group bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4">
                  <div>
                    <h2 className="font-semibold text-[#15388c]">{report.firm_name}</h2>
                    <p className="mt-1 text-sm capitalize text-slate-500">
                      {report.status} · Rating {report.rating}/10
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-800 group-open:hidden">
                    View details +
                  </span>
                  <span className="hidden text-sm font-semibold text-emerald-800 group-open:inline">
                    Hide details −
                  </span>
                </summary>
                <div className="border-t border-slate-100 bg-[#fafbfc] p-3">
                  <ReportCards reports={[report]} memberActions />
                </div>
              </details>
            ))}
          </div>
        ) : (
          <p className="p-8 text-center text-slate-500">
            {q ? "No submitted reports match this search." : "No reports on this page."}{" "}
            {!q && (
              <a href="/member/submit-report" className="text-emerald-800 underline">
                Submit a report
              </a>
            )}
          </p>
        )}
      </ListFrame>
    </ReportShell>
  );
}
