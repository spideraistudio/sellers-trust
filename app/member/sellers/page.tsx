import { LockKeyhole } from "lucide-react";
import { requireApprovedMember } from "@/lib/member-session";
import { categoryAccess } from "@/lib/category-access";
import { SellerSearch } from "@/components/seller-search";
import { ReportShell } from "@/components/report-shell";
import { ListFrame } from "@/components/list-frame";

export const dynamic = "force-dynamic";

export default async function Page() {
  const member = await requireApprovedMember();
  const category = categoryAccess(member);
  const searchEnabled = Boolean(member.searchEnabled);

  return (
    <ReportShell
      title="Search sellers"
      description="Search approved business experience reports within your assigned category."
    >
      {!category ? (
        <p className="text-[13px] text-slate-600">
          Your category must be assigned by the administrator before using this
          workspace.
        </p>
      ) : !searchEnabled ? (
        <ListFrame tone="detail">
          <div className="grid place-items-center px-4 py-16 text-center">
            <span className="grid size-12 place-items-center rounded-[12px] bg-amber-50 text-amber-800">
              <LockKeyhole className="size-6" />
            </span>
            <h2 className="mt-4 text-[15px] font-semibold text-slate-900">
              Seller search is disabled
            </h2>
            <p className="mt-2 max-w-md text-[13px] leading-5 text-slate-600">
              Seller search is not available for your membership right now. Contact
              the administrator to enable search access.
            </p>
          </div>
        </ListFrame>
      ) : (
        <SellerSearch categoryLabel={category.label} />
      )}
    </ReportShell>
  );
}
