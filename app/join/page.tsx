import { Building2 } from "lucide-react";
import { JoinForm } from "@/components/join-form";
import { BrandLogo } from "@/components/brand-logo";
export const dynamic="force-dynamic";
export default function JoinPage(){
  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-4">
          <span className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-[#15388c] to-[#2852a4] shadow-lg shadow-[#15388c]/20">
            <BrandLogo compact className="size-10"/>
          </span>
          <div>
            <p className="font-bold text-[#15388c]">Sellers Trust Network</p>
            <p className="text-xs text-slate-500">Company registration</p>
          </div>
          <a href="/login" className="ml-auto rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-[#15388c] transition hover:bg-slate-50">Member login</a>
        </div>
      </header>
      <section className="mx-auto max-w-5xl px-5 py-10">
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#a57c10]">
            <Building2 className="size-4"/>
            Membership application
          </div>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#15388c]">Register your company</h1>
          <p className="mt-3 max-w-2xl leading-7 text-slate-500">
            No ChatGPT account is required. The administrator will verify your
            details and manually provide your Member ID and temporary password
            after approval.
          </p>
        </div>
        <div className="animate-fade-in-up delay-200">
          <JoinForm/>
        </div>
      </section>
    </main>
  );
}
