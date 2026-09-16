import { requireApprovedMember } from "@/lib/member-session";
import { categoryAccess } from "@/lib/category-access";
import { SellerSearch } from "@/components/seller-search";
import { ReportShell } from "@/components/report-shell";
export const dynamic = "force-dynamic";
export default async function Page(){const member=await requireApprovedMember(),category=categoryAccess(member);return <ReportShell title="Search sellers" description="Search approved business experience reports within your assigned category.">{category?<SellerSearch prominent categoryLabel={category.label}/>:<p>Your category must be assigned by the administrator before using this workspace.</p>}</ReportShell>;}
