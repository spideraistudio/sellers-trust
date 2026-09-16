"use client";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { readJsonResponse } from "@/lib/client-response";
import { PasswordStrengthMeter } from "@/components/password-strength-meter";

export function CredentialForm({ change = false }: { change?: boolean }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const fields = change
    ? [["currentPassword", "Current or temporary password"], ["password", "New password"], ["confirmPassword", "Confirm new password"]]
    : [["loginId", "Member ID"], ["password", "Password"]];

  return (
    <form className="mt-6 space-y-5" onSubmit={async event => {
      event.preventDefault();setBusy(true);setError("");
      try {
        const data = Object.fromEntries(new FormData(event.currentTarget));
        const response = await fetch("/api/member-auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...data,action:change ? "password" : "login"})});
        const result = await readJsonResponse<{error?:string;redirect:string}>(response); if(!response.ok) throw new Error(result.error||"Unable to complete the request.");
        window.location.assign(result.redirect);
      } catch(e) {setError(e instanceof Error ? e.message : "Please try again.");setBusy(false);}
    }}>
      {fields.map(([name, label]) => {
        const isPassword = name !== "loginId";
        const showToggle = isPassword && (!change || name !== "currentPassword");
        return (
          <label key={name} className="block text-sm font-medium text-slate-700">
            {label}
            <div className="relative mt-2">
              <input
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 text-base outline-none transition placeholder:text-slate-400 focus:border-[#15388c] focus:ring-4 focus:ring-[#15388c]/10"
                name={name}
                required
                type={isPassword ? (showToggle && showPassword ? "text" : "password") : "text"}
                autoComplete={name === "loginId" ? "username" : change && name !== "currentPassword" ? "new-password" : "current-password"}
                maxLength={128}
                minLength={change && name !== "currentPassword" ? 12 : 1}
                onChange={name === "password" && change ? (e) => setNewPassword(e.target.value) : undefined}
              />
              {showToggle && (
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              )}
            </div>
            {name === "password" && change && <PasswordStrengthMeter password={newPassword} />}
          </label>
        );
      })}
      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">
          {error}
        </div>
      )}
      <button
        disabled={busy}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#15388c] font-semibold text-white shadow-lg shadow-[#15388c]/20 transition hover:bg-[#1d46a8] hover:shadow-xl disabled:opacity-50"
      >
        {busy && <Loader2 className="size-5 animate-spin" />}
        {busy ? "Please wait…" : change ? "Change password" : "Log in"}
      </button>
      <p className="text-sm text-slate-500">
        {change
          ? "Use 12–128 characters. Your current session will remain active."
          : "Forgot your ID or password? Contact your administrator for new temporary credentials."}
      </p>
    </form>
  );
}
