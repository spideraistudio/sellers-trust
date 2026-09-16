// Server component (force-dynamic): Date.now()+1 default pagination cursor is
// per-request on the server (correct). react-hooks/purity is a false positive.
/* eslint-disable react-hooks/purity */
import { requireApprovedMember } from "@/lib/member-session";
import { categoryAccess } from "@/lib/category-access";
import { reportList } from "@/lib/report-list";
import { ReportCards } from "@/components/report-cards";
import { ReportShell } from "@/components/report-shell";
export const dynamic="force-dynamic";
export default async function Page({searchParams}:{searchParams:Promise<{before?:string;q?:string}>}){
 const member=await requireApprovedMember(),category=categoryAccess(member),params=await searchParams,q=String(params.q||"").trim();
 if(!category)return <ReportShell title="My reports" description="Your submitted reports"><p>Category assignment is required.</p></ReportShell>;
 const {reports,next}=await reportList({id:member.id,category:category.id},Number(params.before)||Date.now()+1,q);
 return <ReportShell title="My reports" description="Search your submissions or select a seller to review the full report."><form className="mb-5 flex flex-wrap gap-3 rounded-2xl border bg-white p-4"><input name="q" defaultValue={q} placeholder="Search seller, summary or dispute type" className="h-11 min-w-64 flex-1 rounded-lg border px-3"/><button className="rounded-lg bg-[#15388c] px-5 text-sm font-semibold text-white">Search reports</button>{q&&<a href="/member/reports" className="grid place-items-center rounded-lg border px-4 text-sm font-semibold">Clear</a>}</form>{reports.length?<div className="space-y-3">{reports.map(report=><details key={report.id} className="group overflow-hidden rounded-2xl border bg-white"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5"><div><h2 className="font-semibold text-[#15388c]">{report.firm_name}</h2><p className="mt-1 text-sm capitalize text-slate-500">{report.status} · Rating {report.rating}/10</p></div><span className="text-sm font-semibold text-emerald-800 group-open:hidden">View details +</span><span className="hidden text-sm font-semibold text-emerald-800 group-open:inline">Hide details −</span></summary><div className="border-t bg-slate-50 p-4"><ReportCards reports={[report]} memberActions/></div></details>)}</div>:<p className="rounded-xl border bg-white p-6">{q?"No submitted reports match this search.":"No reports on this page."} {!q&&<a href="/member/submit-report" className="text-emerald-800 underline">Submit a report</a>}</p>}{next&&<a className="mt-5 inline-block underline" href={`/member/reports?before=${next}${q?`&q=${encodeURIComponent(q)}`:""}`}>Older reports</a>}</ReportShell>;
}
