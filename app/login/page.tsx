import { CredentialForm } from "@/components/credential-form";
import { BrandLogo } from "@/components/brand-logo";
import { ShieldCheck, Lock, Scale } from "lucide-react";

export const dynamic="force-dynamic";
export default function Login(){
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* ── Brand panel (desktop only) ── */}
      <div className="gradient-mesh relative hidden flex-col justify-between overflow-hidden p-12 lg:flex">
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute -right-16 top-20 size-72 rounded-full bg-blue-400/20 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute -left-10 bottom-10 size-80 rounded-full bg-amber-300/10 blur-3xl animate-float-slow" style={{ animationDelay: "2s" }} />

        {/* Logo */}
        <a href="/home" className="relative z-10 flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-md">
            <BrandLogo compact className="size-10" />
          </span>
          <span className="text-lg font-semibold text-white">Sellers Trust Network</span>
        </a>

        {/* Value proposition */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold leading-tight text-white">
            Trusted seller intelligence for Indian businesses
          </h1>
          <p className="mt-4 max-w-md text-blue-100">
            Sign in to search verified seller reports, file disputes, and make
            informed trading decisions.
          </p>
          <div className="mt-8 space-y-3">
            {[
              { icon: ShieldCheck, text: "Admin-verified company membership" },
              { icon: Lock, text: "Secure, rate-limited authentication" },
              { icon: Scale, text: "Structured dispute resolution workflow" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-blue-100">
                <span className="grid size-8 place-items-center rounded-lg bg-white/10 ring-1 ring-white/15">
                  <Icon className="size-4 text-amber-300" />
                </span>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="relative z-10 text-xs text-blue-200/70">
          © 2026 Meet Patel · Sellers Trust Network
        </p>
      </div>

      {/* ── Form panel ── */}
      <div className="flex items-center justify-center bg-[#f5f7fb] p-5 sm:p-8">
        <section className="w-full max-w-md animate-fade-in-up">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center justify-center lg:hidden">
            <a href="/home" className="grid size-14 place-items-center rounded-xl bg-[#15388c]">
              <BrandLogo compact className="size-12" />
            </a>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
            <div className="p-8">
              <h1 className="text-3xl font-bold tracking-tight text-[#15388c]">Member login</h1>
              <p className="mt-2 text-slate-600">
                Use the Member ID and password shared by your administrator.
              </p>
              <CredentialForm/>
              <div className="mt-6 flex items-center justify-center gap-3 border-t border-slate-100 pt-5 text-sm font-semibold">
                <a href="/join" className="text-[#15388c] underline transition hover:text-[#1d46a8]">Register company</a>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-slate-400">
            Administrator issues credentials after verification
          </p>
        </section>
      </div>
    </main>
  );
}
