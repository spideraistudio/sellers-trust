"use client";
import { changeMemberStatus } from "@/app/actions";

export function MemberStatusForm({memberId,status,compact=false}:{memberId:number|string;status:string;compact?:boolean}){
 const next=status==="pending"?"rejected":status==="approved"?"deactivated":"approved";
 const label=next==="rejected"?"Reject":next==="deactivated"?"Deactivate":"Reactivate";
 return <form action={changeMemberStatus} onSubmit={event=>{if(!window.confirm(`${label} this company membership?`))event.preventDefault();}} className={compact?"block":"flex shrink-0 flex-wrap gap-2"}>
  <input type="hidden" name="memberId" value={memberId}/>
  <button name="status" value={next} className={`${compact?"w-full rounded-lg border px-3 py-1.5 text-xs font-semibold":"rounded-lg border px-4 py-2 text-sm font-semibold"} ${next==="rejected"?"border-rose-200 text-rose-700 hover:bg-rose-50":next==="approved"?"border-emerald-200 text-emerald-700 hover:bg-emerald-50":"border-slate-200 text-slate-700 hover:bg-slate-50"}`}>{label}</button>
 </form>;
}
