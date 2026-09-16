import { requireApprovedMember } from "@/lib/member-session";
import { categoryAccess } from "@/lib/category-access";
import { ReportForm } from "@/components/report-form";
import { ReportShell } from "@/components/report-shell";
export const dynamic = "force-dynamic";
export default async function Page(){const member=await requireApprovedMember();return <ReportShell title="Submit business experience report" description="Provide factual business information. Each report requires admin approval before other members can find it.">{categoryAccess(member)?<ReportForm/>:<p>Your category must be assigned by the administrator before using this workspace.</p>}</ReportShell>;}
