"use client";
import { useState } from "react";
import type { AppNotification } from "@/lib/notifications";
import { readJsonResponse } from "@/lib/client-response";

export function NotificationList({initial,admin=false}:{initial:AppNotification[];admin?:boolean}){
 const [items,setItems]=useState(initial),[error,setError]=useState("");
 const unread=items.filter(item=>!item.read_at).length;
 async function mark(id?:string){
  setError("");
  try{
   const audience=admin?"admin":"member";
   const response=await fetch("/api/notifications",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(id?{id,audience}:{all:true,audience})});
   const data=await readJsonResponse<{error?:string}>(response);
   if(!response.ok)throw new Error(data.error||"Unable to update notification.");
   setItems(current=>current.map(item=>!id||item.id===id?{...item,read_at:Date.now()}:item));
   return true;
  }catch(cause){setError(cause instanceof Error?cause.message:"Unable to update notification.");return false;}
 }
 async function open(item:AppNotification){if(!item.read_at&&!await mark(item.id))return;window.location.assign(item.href);}
 return <section>{error&&<p role="alert" className="mb-4 rounded-lg bg-rose-50 p-4 text-rose-700">{error}</p>}<div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-500">{unread} unread · {items.length} stored for up to 10 days</p>{unread>0&&<button onClick={()=>mark()} className="rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800">Mark all as read</button>}</div><div className="space-y-3">{items.length?items.map(item=><article key={item.id} className={`rounded-2xl border p-5 ${item.read_at?"bg-white":"border-emerald-200 bg-emerald-50"}`}><button onClick={()=>open(item)} className="w-full text-left"><div className="flex items-start justify-between gap-4"><h2 className="font-semibold">{item.title}</h2>{!item.read_at&&<span className="mt-1 size-2.5 shrink-0 rounded-full bg-emerald-600"/>}</div><p className="mt-2 leading-6 text-slate-600">{item.message}</p><p className="mt-3 text-xs text-slate-500">{new Date(item.created_at).toLocaleString("en-IN",{timeZone:"Asia/Kolkata"})} · Open details →</p></button></article>):<p className="rounded-2xl border bg-white p-8 text-center text-slate-500">No notifications yet.</p>}</div></section>;
}
