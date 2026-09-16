import { redirect } from "next/navigation";
import { currentMember } from "@/lib/member-session";
import { CredentialForm } from "@/components/credential-form";
export const dynamic = "force-dynamic";
export default async function Password() { const member = await currentMember(); if(!member) redirect("/login");return <main className="grid min-h-screen place-items-center bg-[#f5f7fb] p-5"><section className="w-full max-w-md rounded-2xl border bg-white p-8"><h1 className="text-3xl font-semibold">Change password</h1><p className="mt-3">Member ID: {member.loginId}</p><p className="mt-2 text-slate-600">{member.mustChangePassword ? "Replace your temporary password to open your workspace." : "Your member ID will remain the same."}</p><CredentialForm change/></section></main>; }
