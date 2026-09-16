import { requireApprovedMember } from "@/lib/member-session";
import { reportDb } from "@/lib/report-store";
import { ReportShell } from "@/components/report-shell";
import { AccountDeletionForm } from "@/components/account-deletion-form";
export const dynamic="force-dynamic";
export default async function Page(){const member=await requireApprovedMember(),pending=Boolean(await reportDb().prepare("SELECT id FROM account_deletion_requests WHERE member_id=? AND status='pending'").bind(member.id).first());return <ReportShell title="Account & security" description="Manage password security and account closure."><section className="mb-6 rounded-2xl border bg-white p-6"><h2 className="text-xl font-semibold">Password security</h2><p className="mt-2 text-slate-600">Change your password if it may be known by another person or company.</p><a href="/member/password" className="mt-4 inline-block rounded-lg bg-[#15388c] px-5 py-3 font-semibold text-white">Change password</a></section><AccountDeletionForm pending={pending}/></ReportShell>;}
