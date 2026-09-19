"use client";

import {
  CheckCircle2,
  FilePlus2,
  Files,
  Leaf,
  LockKeyhole,
  Search,
} from "lucide-react";
import { useWorkspacePageMeta } from "@/components/workspace-shell";
import Link from "next/link";

export type DashboardProfile = {
  companyName: string;
  gstin: string;
  address: string;
  taluka: string;
  district: string;
  state: string;
  pincode: string;
  responsiblePersonName: string;
  mobileNumber: string;
  email: string;
  approvedOn: string;
  categoryLabel: string | null;
  requestedCategory: string | null;
  isPilot?: boolean;
  searchEnabled?: boolean;
};

export function MemberDashboard({
  profile,
  preview = false,
}: {
  profile: DashboardProfile;
  preview?: boolean;
  notificationCount?: number;
}) {
  useWorkspacePageMeta({
    eyebrow: preview ? "Administrator console" : "Company workspace",
    title: preview ? "Member preview" : profile.companyName,
    description: preview
      ? "Fictional sample company · no membership data is changed."
      : `Welcome, ${profile.responsiblePersonName}.`,
    actions: preview
      ? [{ href: "/admin", label: "Return to admin", variant: "primary" }]
      : [
          { href: "/member/sellers", label: "Search sellers", variant: "primary" },
          { href: "/member/submit-report", label: "Submit report", variant: "secondary" },
          { href: "/member/profile", label: "Company profile", variant: "ghost" },
        ],
  });

  const actions = [
    {
      href: "/member/sellers",
      label: "Search sellers",
      text: "Check approved seller experiences by GSTIN.",
      icon: Search,
    },
    {
      href: "/member/submit-report",
      label: "Submit report",
      text: "Record a factual commercial experience.",
      icon: FilePlus2,
    },
    {
      href: "/member/reports",
      label: "My reports",
      text: "Review submissions and request changes.",
      icon: Files,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      {preview && (
        <div className="mb-5 rounded-[12px] border border-amber-200 bg-amber-50 px-5 py-3 text-center text-sm text-amber-900">
          Administrator preview · Fictional company · No membership data is changed.
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Company workspace</p>
          <h2 className="mt-2 break-words text-2xl font-semibold tracking-tight sm:text-3xl">
            {profile.companyName}
          </h2>
          <p className="mt-2 text-slate-500">Welcome, {profile.responsiblePersonName}.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {profile.isPilot && (
            <span className="rounded-[12px] border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900">
              Pilot test account
            </span>
          )}
          <span className="flex items-center gap-2 rounded-[12px] border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
            <CheckCircle2 className="size-4" />
            Membership approved
          </span>
        </div>
      </div>

      {profile.categoryLabel ? (
        <div className="my-7 flex flex-wrap items-center justify-between gap-4 rounded-[12px] border border-blue-200 bg-[#f8fafc] px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-[12px] bg-blue-50 text-[#15388c]">
              <Leaf className="size-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Assigned category
              </p>
              <p className="font-semibold text-[#15388c]">{profile.categoryLabel}</p>
            </div>
          </div>
          <p className="flex items-center gap-2 text-sm text-slate-500">
            <LockKeyhole className="size-4" />
            Search and reports are restricted to this category.
          </p>
        </div>
      ) : (
        <div className="my-7 rounded-[12px] border border-amber-200 bg-amber-50 p-5">
          <strong>Category review required</strong>
          <p className="mt-1 text-sm">
            Requested category: {profile.requestedCategory || "Other"}
          </p>
        </div>
      )}

      {profile.categoryLabel && !preview && (
        <Link
          href="/member/sellers"
          className={`mt-6 flex items-center justify-between gap-3 rounded-[12px] border px-4 py-3.5 transition ${
            profile.searchEnabled === false
              ? "border-amber-200 bg-amber-50/70 hover:border-amber-300"
              : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`grid size-10 place-items-center rounded-[12px] ${
                profile.searchEnabled === false
                  ? "bg-amber-100 text-amber-800"
                  : "bg-[#15388c]/10 text-[#15388c]"
              }`}
            >
              {profile.searchEnabled === false ? (
                <LockKeyhole className="size-5" />
              ) : (
                <Search className="size-5" />
              )}
            </span>
            <div>
              <p className="text-[13px] font-semibold text-slate-900">
                {profile.searchEnabled === false
                  ? "Seller search disabled"
                  : "Search sellers by GSTIN"}
              </p>
              <p className="text-[12px] text-slate-500">
                {profile.searchEnabled === false
                  ? "Contact the administrator to enable search access."
                  : `Category: ${profile.categoryLabel}`}
              </p>
            </div>
          </div>
          <span
            className={`text-[12px] font-semibold ${
              profile.searchEnabled === false ? "text-amber-800" : "text-[#15388c]"
            }`}
          >
            {profile.searchEnabled === false ? "View →" : "Open →"}
          </span>
        </Link>
      )}

      <section className="mt-8">
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Workspace actions</h3>
          <p className="mt-1 text-slate-500">Choose what you want to do next.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {actions.map(action => (
            <Link
              key={action.href}
              href={preview ? "#" : action.href}
              className="rounded-[12px] border border-slate-200 bg-[#f8fafc] p-6 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:shadow-sm"
            >
              <action.icon className="size-6 text-[#15388c]" />
              <h4 className="mt-5 font-semibold">{action.label}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-500">{action.text}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
