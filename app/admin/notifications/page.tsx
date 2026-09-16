import { redirect } from "next/navigation";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { isConfiguredAdmin } from "@/lib/member-data";
import { listNotifications } from "@/lib/notifications";
import { NotificationList } from "@/components/notification-list";
import { ReportShell } from "@/components/report-shell";
import { actionLabel,auditEntries } from "@/lib/admin-dashboard";
import { formatIndiaDateTime } from "@/lib/india-time";

export const dynamic="force-dynamic";

export default async function Page(){
 const user=await requireChatGPTUser("/admin/notifications");
 if(!isConfiguredAdmin(user.email))redirect("/join");
 const [items,activity]=await Promise.all([listNotifications("admin",null),auditEntries(12)]);
 return <ReportShell admin title="Notifications" description="New work and security warnings requiring administrator attention.">
  <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
   <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
    <div>
     <h2 className="text-lg font-semibold text-[#15388c]">Recent activity</h2>
     <p className="mt-1 text-sm text-slate-500">Latest membership, report and resolution events.</p>
    </div>
    <a href="/admin/audit" className="text-sm font-semibold text-emerald-800 underline">View complete audit trail</a>
   </div>
   {activity.length===0?<p className="p-8 text-center text-slate-500">No activity recorded yet.</p>:
   <div className="overflow-x-auto">
    <table className="min-w-full text-left text-sm">
     <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
      <tr>
       <th className="px-5 py-3">Event</th>
       <th className="px-5 py-3">Subject</th>
       <th className="px-5 py-3">Actor</th>
       <th className="px-5 py-3">Source</th>
       <th className="px-5 py-3">When</th>
      </tr>
     </thead>
     <tbody className="divide-y divide-slate-100">
      {activity.map((entry,index)=>
       <tr key={`${entry.source}-${entry.created_at}-${index}`} className="align-top hover:bg-slate-50/80">
        <td className="px-5 py-3.5 font-semibold text-slate-800">{actionLabel(entry.action)}</td>
        <td className="px-5 py-3.5 text-slate-600">{entry.subject}{entry.details?` · ${entry.details}`:""}</td>
        <td className="px-5 py-3.5 text-slate-700">{entry.actor}</td>
        <td className="px-5 py-3.5 capitalize text-slate-500">{entry.source}</td>
        <td className="whitespace-nowrap px-5 py-3.5 text-slate-500">{formatIndiaDateTime(entry.created_at)}</td>
       </tr>
      )}
     </tbody>
    </table>
   </div>}
  </section>
  <NotificationList initial={items} admin/>
 </ReportShell>;
}
