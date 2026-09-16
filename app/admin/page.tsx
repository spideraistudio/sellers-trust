import { AdminCredentials } from "@/components/admin-credentials";
import { redirect } from "next/navigation";
import { chatGPTSignInPath,getChatGPTUser } from "../chatgpt-auth";
import { isConfiguredAdmin,listMembersForAdmin } from "@/lib/member-data";
import { adminCounts } from "@/lib/admin-dashboard";
import { MemberStatusForm } from "@/components/member-status-form";
import { formatIndiaDate } from "@/lib/india-time";
import { AlertTriangle,Building2,CheckCircle2,Clock3,Download,FileCheck2,FileText,FileX2,Gavel,IndianRupee,KeyRound,Search,Users } from "lucide-react";

export const dynamic="force-dynamic";

const money=(paise:number)=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(paise/100);

const cardTone={
 amber:{value:"text-amber-700",bar:"bg-amber-400",icon:"bg-amber-50 text-amber-700"},
 emerald:{value:"text-emerald-800",bar:"bg-emerald-500",icon:"bg-emerald-50 text-emerald-800"},
 rose:{value:"text-rose-700",bar:"bg-rose-400",icon:"bg-rose-50 text-rose-700"},
 slate:{value:"text-slate-700",bar:"bg-slate-400",icon:"bg-slate-100 text-slate-600"},
} as const;

function statusClass(status:string){
 if(status==="approved")return "bg-emerald-50 text-emerald-800 ring-emerald-200";
 if(status==="pending")return "bg-amber-50 text-amber-800 ring-amber-200";
 if(status==="rejected")return "bg-rose-50 text-rose-800 ring-rose-200";
 return "bg-slate-100 text-slate-600 ring-slate-200";
}

function categoryLabel(member:{category:string;otherCategory?:string|null}){
 return member.category==="agriculture"?"Agriculture":member.otherCategory||"Other";
}

function locationLine(member:{address?:string;taluka?:string;district?:string;state?:string}){
 return [member.address,member.taluka,member.district,member.state].filter(Boolean).join(", ");
}

export default async function AdminPage({searchParams}:{searchParams:Promise<{q?:string;status?:string;category?:string;from?:string;to?:string}>}){
 const user=await getChatGPTUser();
 if(!user)return <main className="grid min-h-screen place-items-center bg-[#f5f7fb] p-5"><a href={chatGPTSignInPath("/admin")} target="_top" className="rounded-xl bg-[#15388c] px-7 py-4 font-semibold text-white">Administrator sign in</a></main>;
 if(!isConfiguredAdmin(user.email))redirect("/join");
 const params=await searchParams,q=String(params.q||"").trim().toLowerCase(),status=String(params.status||""),category=String(params.category||""),from=/^\d{4}-\d{2}-\d{2}$/.test(String(params.from||""))?new Date(`${params.from}T00:00:00Z`).valueOf():0,to=/^\d{4}-\d{2}-\d{2}$/.test(String(params.to||""))?new Date(`${params.to}T23:59:59.999Z`).valueOf():Number.MAX_SAFE_INTEGER;
 const [allMembers,counts]=await Promise.all([listMembersForAdmin(),adminCounts()]);
 const members=allMembers.filter(member=>{
  const created=new Date(member.createdAt).valueOf();
  const createdOk=!Number.isFinite(created)||(created>=from&&created<=to);
  return createdOk&&(!q||`${member.companyName} ${member.gstin} ${member.loginId||""} ${member.responsiblePersonName} ${member.mobileNumber} ${member.email}`.toLowerCase().includes(q))&&(!status||member.status===status)&&(!category||member.category===category);
 });
 const cards=[
  {label:"Pending companies",value:counts.pendingMembers,href:"#companies",tone:"amber" as const,icon:Building2},
  {label:"Pending reports",value:counts.pendingReports,href:"/admin/reports",tone:"amber" as const,icon:FileText},
  {label:"Pending resolutions",value:counts.pendingResolutions,href:"/admin/resolutions",tone:"amber" as const,icon:Gavel},
  {label:"Approved members",value:counts.approvedMembers,href:"#companies",tone:"emerald" as const,icon:Users},
  {label:"Approved reports",value:counts.approvedReports,href:"/admin/reports",tone:"emerald" as const,icon:FileCheck2},
  {label:"Rejected reports",value:counts.rejectedReports,href:"/admin/reports",tone:"slate" as const,icon:FileX2},
  {label:"Open disputes",value:counts.openDisputes,href:"/admin/resolutions",tone:"rose" as const,icon:AlertTriangle},
  {label:"Resolved disputes",value:counts.resolvedDisputes,href:"/admin/resolutions",tone:"emerald" as const,icon:CheckCircle2},
  {label:"Total disputed amount",value:money(counts.totalDisputedPaise),href:"/admin/reports?status=approved&disputeStatus=reported",tone:"rose" as const,icon:IndianRupee},
  {label:"Amount resolved",value:money(counts.resolvedDisputedPaise),href:"/admin/reports?status=approved&disputeStatus=resolved",tone:"emerald" as const,icon:IndianRupee},
  {label:"Open disputed amount",value:money(counts.openDisputedPaise),href:"/admin/reports?status=approved&disputeStatus=reported",tone:"amber" as const,icon:IndianRupee},
  {label:"Password reset requests",value:counts.pendingPasswordResets,href:"#companies",tone:"slate" as const,icon:KeyRound},
  {label:"Expiring in 30 days",value:counts.expiringMemberships,href:"#companies",tone:"amber" as const,icon:Clock3},
 ];

 return <main className="min-h-screen bg-[#f5f7fb] p-5 text-slate-900 lg:p-10">
  <section className="mx-auto max-w-7xl">
   <header className="flex flex-wrap items-end justify-between gap-5">
    <div>
     <p className="text-sm font-semibold text-[#a57c10]">Administrator console</p>
     <h1 className="mt-2 text-4xl font-semibold tracking-[-.04em] text-[#15388c]">Platform overview</h1>
     <p className="mt-3 max-w-2xl text-slate-500">Review pending work and monitor Sellers Trust Network activity.</p>
    </div>
    <nav className="flex flex-wrap gap-3 text-sm font-semibold">
     <a href="/admin/reports" className="rounded-xl bg-[#15388c] px-5 py-3 text-white shadow-sm hover:bg-[#102d74]">Review reports</a>
     <a href="/join" className="rounded-xl border border-blue-200 bg-white px-5 py-3 text-[#15388c] hover:bg-blue-50">Register company</a>
     <a href="/admin/preview" className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-slate-700 hover:bg-slate-50">Member preview</a>
    </nav>
   </header>

   {counts.unusualLast24>0&&<a href="/admin/audit?q=security" className="mt-6 block rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-900"><strong>{counts.unusualLast24} unusual activit{counts.unusualLast24===1?"y":"ies"} detected in the last 24 hours.</strong><span className="ml-2 text-sm underline">Open audit trail</span></a>}

   <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {cards.map(card=>{
     const Icon=card.icon;
     const tone=cardTone[card.tone];
     return <a key={card.label} href={card.href} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <span className={`block h-1 ${tone.bar}`}/>
      <div className="p-5">
       <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{card.label}</p>
        <span className={`grid size-9 place-items-center rounded-xl ${tone.icon}`}><Icon className="size-4"/></span>
       </div>
       <p className={`mt-3 text-3xl font-semibold tracking-tight ${tone.value}`}>{card.value}</p>
       <p className="mt-3 text-sm font-semibold text-[#15388c]">Open details →</p>
      </div>
     </a>;
    })}
   </section>

   <section id="companies" className="mt-8 scroll-mt-5">
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
     <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-100 px-6 py-5">
      <div>
       <h2 className="text-2xl font-semibold text-[#15388c]">Company memberships</h2>
       <p className="mt-1 text-slate-500">Review company identity and manage member access.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
       <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">{counts.pendingMembers} awaiting review</span>
       <a href="/api/admin/export?type=members" className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"><Download className="size-4"/>Export CSV</a>
      </div>
     </div>

     <form method="get" className="grid gap-3 border-b border-slate-100 bg-slate-50/70 p-4 md:grid-cols-12 md:items-end">
      <label className="md:col-span-4">
       <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Search</span>
       <span className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"/>
        <input name="q" defaultValue={params.q} placeholder="Company, GSTIN, Member ID, mobile or email" className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none ring-[#15388c]/20 focus:border-[#15388c] focus:ring-4"/>
       </span>
      </label>
      <label className="md:col-span-2">
       <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Status</span>
       <select name="status" defaultValue={status} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#15388c]">
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="deactivated">Deactivated</option>
       </select>
      </label>
      <label className="md:col-span-2">
       <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Category</span>
       <select name="category" defaultValue={category} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#15388c]">
        <option value="">All categories</option>
        <option value="agriculture">Agriculture</option>
        <option value="other">Other</option>
       </select>
      </label>
      <label className="md:col-span-2">
       <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Joined from</span>
       <input type="date" name="from" defaultValue={params.from} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#15388c]"/>
      </label>
      <label className="md:col-span-2">
       <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Joined to</span>
       <input type="date" name="to" defaultValue={params.to} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#15388c]"/>
      </label>
      <div className="flex gap-2 md:col-span-12">
       <button className="rounded-xl bg-[#15388c] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#102d74]">Apply filters</button>
       <a href="/admin#companies" className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Clear</a>
       <p className="ml-auto self-center text-sm text-slate-500">{members.length===1?"1 company shown":`${members.length} companies shown`}</p>
      </div>
     </form>

     {members.length===0?<p className="p-12 text-center text-slate-500">No company memberships match these filters.</p>:
     <>
      <div className="overflow-x-auto">
       <table className="min-w-[1080px] w-full text-left text-sm">
        <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
         <tr>
          <th className="px-6 py-3.5">Company</th>
          <th className="px-4 py-3.5">GSTIN</th>
          <th className="px-4 py-3.5">Status</th>
          <th className="px-4 py-3.5">Category</th>
          <th className="px-4 py-3.5">Contact</th>
          <th className="px-4 py-3.5">Joined</th>
          <th className="px-4 py-3.5">Disputes</th>
          <th className="sticky right-0 bg-slate-50 px-6 py-3.5 text-right shadow-[-8px_0_8px_-8px_rgba(15,23,42,0.12)]">Actions</th>
         </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
         {members.map(member=>
          <tr key={String(member.id)} className="group align-top transition hover:bg-slate-50/80">
           <td className="px-6 py-5">
            <a href={`/admin/members/${member.id}`} className="font-semibold text-[#15388c] hover:underline">{member.companyName||"—"}</a>
            {member.loginId&&<p className="mt-1 inline-flex rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-600">{member.loginId}</p>}
            <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">{locationLine(member)||"—"}</p>
           </td>
           <td className="px-4 py-5">
            <code className="rounded-lg bg-slate-50 px-2 py-1 font-mono text-xs text-slate-700">{member.gstin||"—"}</code>
           </td>
           <td className="px-4 py-5">
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${statusClass(member.status||"pending")}`}>{member.status||"pending"}</span>
           </td>
           <td className="px-4 py-5 text-slate-700">{categoryLabel(member)}</td>
           <td className="px-4 py-5">
            <p className="font-medium text-slate-800">{member.responsiblePersonName||"—"}</p>
            {member.mobileNumber?<a href={`tel:${member.mobileNumber}`} className="mt-1 block text-xs text-slate-500 hover:text-[#15388c]">{member.mobileNumber}</a>:<p className="mt-1 text-xs text-slate-400">No mobile</p>}
            {member.email?<a href={`mailto:${member.email}`} className="mt-1 block truncate text-xs text-slate-500 hover:text-[#15388c]">{member.email}</a>:<p className="mt-1 text-xs text-slate-400">No email</p>}
           </td>
           <td className="whitespace-nowrap px-4 py-5 text-slate-600">{formatIndiaDate(member.createdAt)}</td>
           <td className="px-4 py-5">
            {member.reportedDisputes||member.resolvedDisputes?
             <div className="space-y-1 text-xs font-semibold">
              <a href={`/admin/reports?status=approved&memberId=${member.id}&disputeStatus=reported`} className="block text-rose-700 hover:underline">{member.reportedDisputes} reported</a>
              <a href={`/admin/reports?status=approved&memberId=${member.id}&disputeStatus=resolved`} className="block text-emerald-700 hover:underline">{member.resolvedDisputes} resolved</a>
             </div>
             :<span className="text-xs text-slate-400">None</span>}
           </td>
           <td className="sticky right-0 bg-white px-6 py-5 shadow-[-8px_0_8px_-8px_rgba(15,23,42,0.12)] group-hover:bg-slate-50">
            <div className="ml-auto flex w-40 flex-col gap-2">
             <a href={`/admin/members/${member.id}`} className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#15388c] hover:bg-slate-50">Open record</a>
             {["pending","approved","deactivated"].includes(member.status)&&<MemberStatusForm compact memberId={member.id} status={member.status}/>}
             {["pending","approved"].includes(member.status)&&<AdminCredentials compact memberId={member.id} pending={member.status==="pending"} hasCredentials={!!member.passwordHash}/>}
            </div>
           </td>
          </tr>
         )}
        </tbody>
       </table>
      </div>
     </>}
    </div>
   </section>
  </section>
 </main>;
}
