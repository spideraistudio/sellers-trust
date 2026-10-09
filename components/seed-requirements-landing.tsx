"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SeedRequestForm } from "@/components/seed-request-form";
import type { SeedRequest } from "@/lib/seed-requests";
import { Bell } from "lucide-react";


type OwnQuoteRow = { id:string; requestId:string; crop:string; segment:string; offeredQuantity:number; quantityUnit:string; price:number; priceUnit:string; status:string; updatedAt:string };

export function SeedRequirementsLanding({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState<SeedRequest[]>([]);
  const [browse, setBrowse] = useState<SeedRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [history, setHistory] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<"open"|"complete">("open");
  const [ownQuotes, setOwnQuotes] = useState<OwnQuoteRow[]>([]);
  useEffect(() => { fetch("/api/member/seed-requests").then(r => r.json()).then(data => setRequests(data.requests || [])).catch(() => {}); { fetch("/api/member/seed-browse").then(r=>r.json()).then(data=>setBrowse(data.requests||[])).catch(()=>{}); fetch("/api/member/seed-quote-history").then(r=>r.json()).then(data=>setOwnQuotes(data.quotations||[])).catch(()=>{}); } }, []);
  const visibleRequests = [...requests].filter(item => history ? (historyFilter === "open" ? item.status === "published" : item.status === "closed" || item.status === "cancelled") : item.status === "published").sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  async function save(next: boolean) {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/member/seed-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seedNotifications: next }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save preference.");
      setEnabled(result.seedNotifications);
      setMessage(`Seed notifications ${result.seedNotifications ? "on" : "off"}. Preference saved.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save preference.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="rounded-[12px] border border-blue-200 bg-blue-50 p-5 text-[#15388c]">
          <h2 className="text-lg font-semibold">Seed requirements</h2>
          <p className="mt-1 text-sm">Create and manage Seed buying requests and private quotations.</p>
        </div>
        <section className="rounded-[12px] border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="seed-notifications-title">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-blue-50 text-[#15388c]"><Bell className="size-5" /></span>
              <div>
                <h2 id="seed-notifications-title" className="font-semibold text-slate-900">Seed buying notifications</h2>
                <p className="mt-1 max-w-xl text-sm text-slate-600">Receive in-app alerts for Seed requirements in your eligible states. You can still browse and quote eligible requests when this is off.</p>
              </div>
            </div>
            <button type="button" role="switch" aria-label="Seed buying notifications" aria-checked={enabled} disabled={saving} onClick={() => save(!enabled)} className={`relative inline-flex h-9 w-16 shrink-0 items-center rounded-full transition disabled:opacity-50 ${enabled ? "bg-[#15388c]" : "bg-slate-400"}`}>
              <span className={`absolute size-7 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-8" : "translate-x-1"}`} />
            </button>
          </div>
          <p className="mt-3 text-sm text-slate-600" role="status" aria-live="polite">{message || `Notifications are ${enabled ? "on" : "off"}.`}</p>
        </section>
        <section className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">{history ? "Buying requirement history" : "My Requirements"}</h2><div className="flex flex-wrap gap-2"><button type="button" className="rounded-lg border px-4 py-2 text-sm font-semibold text-[#15388c]" onClick={() => setHistory(value => !value)}>{history ? "Back to open requirements" : "Buying requirement history"}</button><button className="rounded-lg bg-[#15388c] px-4 py-2 text-sm font-semibold text-white" onClick={() => setShowForm(value => !value)}>{showForm ? "Hide form" : "Create Seed request"}</button></div></div>{history && <div className="flex gap-2" aria-label="History filter"><button type="button" aria-pressed={historyFilter === "open"} className={`rounded-lg px-4 py-2 text-sm ${historyFilter === "open" ? "bg-[#15388c] text-white" : "border"}`} onClick={() => setHistoryFilter("open")}>Open</button><button type="button" aria-pressed={historyFilter === "complete"} className={`rounded-lg px-4 py-2 text-sm ${historyFilter === "complete" ? "bg-[#15388c] text-white" : "border"}`} onClick={() => setHistoryFilter("complete")}>Complete</button></div>}{showForm && <SeedRequestForm />}{visibleRequests.length ? <div className="space-y-3">{visibleRequests.map(item => <article key={item.id} className="rounded-xl border bg-white p-4"><div className="flex flex-wrap justify-between gap-3"><div><h3 className="font-semibold">{item.crop} · {item.segment} · {item.quantity} {item.quantityUnit}</h3><p className="text-sm text-slate-600">{item.description} · {item.status} · {item.anonymous ? "Anonymous" : "Company visible"}</p><p className="text-xs text-slate-500">ID {item.id}</p></div>{<Link className="self-start rounded-lg border px-3 py-2 text-sm text-[#15388c]" href={`/member/buy-sell/${item.id}`}>View details</Link>}</div></article>)}</div> : <p className="text-sm text-slate-600">{history ? `No ${historyFilter} requirements.` : "No open requirements."}</p>}</section>
        {<section className="space-y-3"><h2 className="text-lg font-semibold">My Quotations</h2>{ownQuotes.length ? ownQuotes.map(quote => <article key={quote.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4"><div><h3 className="font-semibold">{quote.crop} · {quote.segment}</h3><p className="text-sm text-slate-600">{quote.offeredQuantity} {quote.quantityUnit} · ₹{quote.price}/{quote.priceUnit} · {quote.status}</p></div><Link href={`/member/buy-sell/${quote.requestId}`} className="rounded-lg border px-3 py-2 text-sm text-[#15388c]">View quotation</Link></article>) : <p className="text-sm text-slate-600">No quotations sent yet.</p>}</section>}
        {<section className="space-y-3"><h2 className="text-lg font-semibold">Browse Requirements</h2>{browse.length ? browse.map(item => <article key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4"><div><h3 className="font-semibold">{item.crop} · {item.segment} · {item.quantity} {item.quantityUnit}</h3><p className="text-sm text-slate-600">{item.description} · Buyer: {item.ownerCompany} · Quotation deadline: {new Date(item.quotationDeadline).toLocaleString("en-IN")}</p></div><Link href={`/member/buy-sell/${item.id}`} className="rounded-lg border px-3 py-2 text-sm text-[#15388c]">View requirement</Link></article>) : <p className="text-sm text-slate-600">No eligible open requirements right now.</p>}</section>}
      </div>
    </>
  );
}
