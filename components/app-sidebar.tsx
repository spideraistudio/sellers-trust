"use client";

import { usePathname } from "next/navigation";
import { Bell, Building2, CircleHelp, FilePlus2, Files, FlaskConical, Gavel, Home, Info, LogOut, Mail, Menu, Search, ScrollText, ShieldCheck, UserCog } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type NavItem={href:string;label:string;icon:typeof Home;exact?:boolean;section?:string};
const memberItems:NavItem[] = [
  { href: "/member", label: "Dashboard", icon: Home, exact: true },
  { href: "/member/sellers", label: "Search sellers", icon: Search },
  { href: "/member/submit-report", label: "Submit report", icon: FilePlus2 },
  { href: "/member/reports", label: "My reports", icon: Files },
  { href: "/member/profile", label: "Company profile", icon: Building2, section: "Company" },
  { href: "/member/account", label: "Account & security", icon: UserCog, section: "Company" },
  { href: "/member/issues", label: "Report a problem", icon: CircleHelp },
  { href: "/member/about", label: "About us", icon: Info, section: "Help" },
  { href: "/member/contact", label: "Contact us", icon: Mail, section: "Help" },
  { href: "/privacy", label: "Privacy Policy", icon: ShieldCheck, section: "Legal" },
  { href: "/terms", label: "Terms of Use", icon: ScrollText, section: "Legal" },
  { href: "/disclaimer", label: "Disclaimer", icon: Gavel, section: "Legal" },
];

const adminItems:NavItem[] = [
  { href: "/admin/security", label: "Account & security", icon: UserCog },
  { href: "/admin", label: "Dashboard & companies", icon: Home, exact: true },
  { href: "/admin/reports", label: "Seller reports", icon: Files },
  { href: "/admin/resolutions", label: "Resolution requests", icon: Gavel },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/pilot", label: "Pilot Center", icon: FlaskConical },
  { href: "/admin/governance", label: "Data governance", icon: ShieldCheck },
  { href: "/admin/audit", label: "Audit trail", icon: ScrollText },
];

export function AppSidebar({ admin = false }: { admin?: boolean }) {
  const path = usePathname();
  const items = admin ? adminItems : memberItems;

  return <Sheet>
    <SheetTrigger asChild>
      <button type="button" className="fixed left-4 top-3 z-40 inline-flex h-10 items-center gap-2 rounded-xl bg-[#15388c] px-4 text-sm font-semibold text-white shadow-md transition hover:bg-[#102d74] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b447] focus-visible:ring-offset-2" aria-label="Open navigation menu">
        <Menu className="size-5" /> Menu
      </button>
    </SheetTrigger>
    <SheetContent side="left" showCloseButton className="w-72 gap-0 border-blue-950/20 bg-[#102d74] p-0 text-white sm:max-w-72">
      <SheetTitle className="sr-only">{admin ? "Administrator" : "Member"} navigation</SheetTitle>
      <SheetDescription className="sr-only">Open a Sellers Trust Network section.</SheetDescription>
      <SheetClose asChild>
        <a href={admin ? "/admin" : "/member"} className="flex items-center gap-3 border-b border-white/10 px-5 py-5 pr-14">
          <span className="grid size-12 place-items-center rounded-xl bg-white/10"><BrandLogo compact className="size-10" /></span>
          <span><strong className="block leading-tight">Sellers Trust</strong><strong className="block leading-tight">Network</strong><small className="mt-1 block font-normal text-blue-200">{admin ? "Administrator" : "Member workspace"}</small></span>
        </a>
      </SheetClose>
      <nav aria-label={admin ? "Administrator navigation" : "Member navigation"} className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {items.map((item,index) => {
          const target = item.href.split("#")[0];
          const active = item.exact ? path === target : path.startsWith(target) && target !== "/admin";
          const Icon = item.icon;
          return <div key={item.href}>{item.section&&<p className={`${index?"mt-5":""} px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-blue-300`}>{item.section}</p>}<SheetClose asChild>
            <a href={item.href} aria-current={active ? "page" : undefined} className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${active ? "bg-white text-[#102d74] shadow-sm" : "text-blue-100 hover:bg-white/10 hover:text-white"}`}>
              {active && <span className="absolute -left-1 h-7 w-1 rounded-full bg-[#d6b447]" />}
              <Icon className={`size-5 ${active ? "text-[#a57c10]" : "text-blue-200"}`} />{item.label}
            </a>
          </SheetClose></div>;
        })}
      </nav>
      <div className="border-t border-white/10 p-3">
        <a href={admin ? "/admin-logout" : "/logout"} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-blue-100 hover:bg-white/10 hover:text-white"><LogOut className="size-5" />Sign out</a>
        <p className="px-4 pb-2 pt-4 text-xs text-blue-300">Secure company network</p>
      </div>
    </SheetContent>
  </Sheet>;
}
