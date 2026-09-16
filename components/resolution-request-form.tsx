"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { readJsonResponse } from "@/lib/client-response";

export function ResolutionRequestForm({reportId}:{reportId:string}) {
 const [busy,setBusy]=useState(false),[error,setError]=useState("");
 return <form className="space-y-6 rounded-2xl border bg-white p-5 sm:p-7" onSubmit={async event=>{
  event.preventDefault();setBusy(true);setError("");
  try{const form=new FormData(event.currentTarget);form.set("reportId",reportId);const response=await fetch("/api/resolution-request",{method:"POST",body:form});const data=await readJsonResponse<{error?:string}>(response);if(!response.ok)throw new Error(data.error||"Unable to submit resolution request.");window.location.href="/member/reports";}
  catch(cause){setError(cause instanceof Error?cause.message:"Unable to submit resolution request.");setBusy(false);}
 }}>
  <label className="block text-sm font-medium">Resolution date *<input name="resolvedOn" type="date" required max={new Date().toISOString().slice(0,10)} className="mt-2 h-12 w-full rounded-lg border px-3 text-base"/></label>
  <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">Amount resolved in this settlement *<input name="resolvedAmount" type="number" min="0.01" step="0.01" required className="mt-2 h-12 w-full rounded-lg border px-3 text-base"/></label><label className="block text-sm font-medium">Denomination *<select name="resolvedUnit" className="mt-2 h-12 w-full rounded-lg border bg-white px-3 text-base"><option value="thousands">Thousands</option><option value="lakhs">Lakhs</option><option value="crores">Crores</option></select></label></div>
  <label className="block text-sm font-medium">Factual resolution description *<textarea name="description" required minLength={10} maxLength={2000} rows={6} placeholder="Explain how the commercial dispute was resolved." className="mt-2 w-full rounded-lg border p-3 text-base"/></label>
  <label className="block text-sm font-medium">Supporting document (optional)<input name="document" type="file" accept=".pdf,.jpg,.jpeg,.png" className="mt-2 w-full rounded-lg border border-dashed p-5 text-sm"/><span className="mt-2 block font-normal text-slate-500">PDF, JPG or PNG, maximum 1.5 MB.</span></label>
  {error&&<p role="alert" className="text-rose-700">{error}</p>}
  <div className="flex flex-wrap gap-3"><Button disabled={busy} type="submit">{busy?"Submitting…":"Send for admin approval"}</Button><a href="/member/reports" className="rounded-lg border px-4 py-2 text-sm font-semibold">Cancel</a></div>
 </form>;
}
