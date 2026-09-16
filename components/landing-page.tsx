import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import {
  ShieldCheck, FileSearch, Scale, Lock, BadgeCheck,
  ArrowRight, CheckCircle2, Building2, Search, FileText
} from "lucide-react";

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="gradient-mesh absolute inset-0" />
        {/* Decorative floating orbs */}
        <div className="pointer-events-none absolute -right-20 top-10 size-72 rounded-full bg-blue-400/20 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute -left-16 bottom-0 size-80 rounded-full bg-amber-300/10 blur-3xl animate-float-slow" style={{ animationDelay: "2s" }} />

        {/* Nav bar (mobile-responsive with hamburger menu) */}
        <LandingNav />

        {/* Hero content */}
        <div className="relative z-10 mx-auto max-w-6xl px-5 pb-20 pt-12 sm:pt-20">
          <div className="max-w-3xl">
            <span className="animate-fade-in-up inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-amber-200 ring-1 ring-white/20 backdrop-blur-md">
              <BadgeCheck className="size-4" /> Private · Verified · Category-controlled
            </span>
            <h1 className="animate-fade-in-up delay-100 mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Know who you can <span className="bg-gradient-to-r from-amber-300 to-amber-100 bg-clip-text text-transparent">trust</span> before you trade.
            </h1>
            <p className="animate-fade-in-up delay-200 mt-6 max-w-2xl text-lg leading-relaxed text-blue-100">
              A private network where verified companies share structured seller
              reports, resolve disputes transparently, and protect each other from
              fraudulent or unreliable trading partners.
            </p>
            <div className="animate-fade-in-up delay-300 mt-8 flex flex-wrap gap-4">
              <Link href="/join" className="group inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-[#15388c] shadow-xl shadow-blue-900/30 transition hover:scale-[1.02] hover:shadow-2xl">
                Register your company
                <ArrowRight className="size-5 transition group-hover:translate-x-1" />
              </Link>
              <Link href="/login" className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-7 py-3.5 text-base font-semibold text-white ring-1 ring-white/25 backdrop-blur-md transition hover:bg-white/15">
                Member login
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="animate-fade-in-up delay-500 mt-12 flex flex-wrap gap-x-8 gap-y-4">
              {[
                { icon: ShieldCheck, label: "Admin-verified members" },
                { icon: Lock, label: "GSTIN-masked & HMAC-hashed" },
                { icon: Scale, label: "Structured dispute resolution" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-blue-100">
                  <Icon className="size-4 text-amber-300" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <svg className="relative z-10 block w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ height: "60px" }}>
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f5f7fb" />
        </svg>
      </section>

      {/* ── Features ── */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#a57c10]">Why join</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to vet trading partners
          </h2>
          <p className="mt-4 text-slate-500">
            Built for Indian businesses that need reliable, category-isolated
            seller intelligence before committing to a transaction.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: FileSearch, title: "Verified seller reports", desc: "Search any seller by GSTIN and instantly see ratings, dispute history, and resolution outcomes from peer companies." },
            { icon: Scale, title: "Dispute resolution", desc: "Structured workflow for recording, tracking, and resolving disputes with evidence-based documentation." },
            { icon: ShieldCheck, title: "Category isolation", desc: "Agriculture and other categories stay separate — your competitive intelligence never leaks to rivals." },
            { icon: Lock, title: "Bank-grade security", desc: "scrypt password hashing, HMAC-masked identifiers, httpOnly cookies, CSP headers, and audit logging." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-[#15388c]/30 hover:shadow-lg">
              <div className="grid size-12 place-items-center rounded-xl bg-[#15388c]/5 text-[#15388c] transition group-hover:bg-[#15388c] group-hover:text-white">
                <Icon className="size-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#a57c10]">How it works</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Three steps to trust</h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: Building2, step: "01", title: "Register your company", desc: "Submit your GSTIN, business details, and location. The administrator manually verifies and approves your membership." },
              { icon: Search, step: "02", title: "Search & report sellers", desc: "Look up any seller by GSTIN to see peer reports. File structured reports with ratings, dispute details, and evidence." },
              { icon: FileText, step: "03", title: "Resolve & stay informed", desc: "Track dispute resolutions, receive notifications, and make informed trading decisions backed by community intelligence." },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="relative">
                <div className="flex items-center gap-4">
                  <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#15388c] to-[#2852a4] text-white shadow-lg shadow-blue-900/20">
                    <Icon className="size-7" />
                  </div>
                  <span className="text-3xl font-bold text-slate-200">{step}</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security highlight ── */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="overflow-hidden rounded-3xl bg-slate-900 px-8 py-12 sm:px-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-8 text-amber-300" />
                <h2 className="text-2xl font-bold text-white sm:text-3xl">Security by design</h2>
              </div>
              <p className="mt-4 text-slate-300">
                Every layer of the platform is hardened: from rate-limited
                authentication to file-upload magic-byte validation to formula-injection-safe
                CSV exports.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "scrypt-hashed passwords with timing-safe comparison",
                  "HMAC-SHA256 identifier hashing with last-4 masking",
                  "httpOnly · secure · sameSite=strict session cookies",
                  "Per-request audit logging with 30-day retention governance",
                  "PIN-code, state, and district cross-validation for India",
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-200">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-slate-800/50 p-6 ring-1 ring-white/10">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Auth method", value: "scrypt + token" },
                  { label: "Cookie flags", value: "httpOnly · secure" },
                  { label: "Rate limiting", value: "Per-network + per-user" },
                  { label: "File validation", value: "Magic-byte + size cap" },
                  { label: "Data retention", value: "30-day governance" },
                  { label: "CSP", value: "Strict · no inline eval" },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl bg-slate-900/60 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="relative overflow-hidden rounded-3xl gradient-mesh px-8 py-14 text-center sm:px-12">
          <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 size-48 rounded-full bg-amber-300/10 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to join the network?</h2>
            <p className="mx-auto mt-3 max-w-xl text-blue-100">
              Register your company today. After admin verification, you&apos;ll receive
              your Member ID and temporary password to start searching and reporting.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/join" className="group inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-[#15388c] shadow-xl transition hover:scale-[1.02]">
                Register company
                <ArrowRight className="size-5 transition group-hover:translate-x-1" />
              </Link>
              <Link href="/plans" className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-7 py-3.5 text-base font-semibold text-white ring-1 ring-white/25 backdrop-blur-md transition hover:bg-white/15">
                View plans
              </Link>
              <Link href="/login" className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-7 py-3.5 text-base font-semibold text-white ring-1 ring-white/25 backdrop-blur-md transition hover:bg-white/15">
                I have a Member ID
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
