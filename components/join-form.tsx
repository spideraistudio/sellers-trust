"use client";
import { FormEvent, useMemo, useState, type ChangeEvent } from "react";
import { LocationFields } from "@/components/location-fields";
import { Check, X, Loader2, Building2, FileText, User, Phone, Mail, Tag } from "lucide-react";

const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const MOBILE_RE = /^[6-9][0-9]{9}$/;
const EMAIL_RE = /^\S+@\S+\.\S+$/;

function FieldIcon({ icon: Icon, valid, show }: { icon: typeof Building2; valid: boolean; show: boolean }) {
  if (!show) return (
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300">
      <Icon className="size-5" />
    </span>
  );
  return (
    <span className="absolute right-3 top-1/2 -translate-y-1/2">
      {valid ? <Check className="size-5 text-emerald-600" /> : <X className="size-5 text-rose-400" />}
    </span>
  );
}

const Input = ({ label, name, type = "text", placeholder = "", required = true, icon, valid, showIcon = false, hint, onChange }: {
  label: string; name: string; type?: string; placeholder?: string; required?: boolean;
  icon?: typeof Building2; valid?: boolean; showIcon?: boolean; hint?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}) => (
  <label className="space-y-2">
    <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
      {label}{required && <span className="text-rose-500">*</span>}
    </span>
    <div className="relative">
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-11 text-base outline-none transition placeholder:text-slate-400 focus:border-[#15388c] focus:ring-4 focus:ring-[#15388c]/10"
      />
      {icon && <FieldIcon icon={icon} valid={Boolean(valid)} show={showIcon} />}
    </div>
    {hint && <span className="block text-xs text-slate-400">{hint}</span>}
  </label>
);

export function JoinForm() {
  const [category, setCategory] = useState("agriculture");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [gstInput, setGstInput] = useState("");
  const [mobileInput, setMobileInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [companyInput, setCompanyInput] = useState("");
  const [personInput, setPersonInput] = useState("");

  const gstValid = GSTIN_RE.test(gstInput.toUpperCase());
  const mobileValid = MOBILE_RE.test(mobileInput);
  const emailValid = EMAIL_RE.test(emailInput);

  // Completion progress (6 core fields + location)
  const progress = useMemo(() => {
    let filled = 0;
    const total = 7;
    if (companyInput.trim().length >= 2) filled++;
    if (gstValid) filled++;
    if (personInput.trim().length >= 2) filled++;
    if (mobileValid) filled++;
    if (emailValid) filled++;
    if (category === "other" || category === "agriculture") filled++;
    // location fields are tracked by the LocationFields component internally;
    // approximate with a flag after first interaction
    filled++; // location is always "attempted" since it's required
    return Math.min(100, Math.round((filled / total) * 100));
  }, [companyInput, gstValid, personInput, mobileValid, emailValid, category]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const form = new FormData(event.currentTarget);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form.entries())),
      });
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json"))
        throw new Error("The registration service is temporarily unavailable.");
      const result = await response.json() as { error?: string };
      if (!response.ok) {
        setError(result.error || "Submission failed.");
        setLoading(false);
        return;
      }
      setSubmitted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The connection was interrupted. Please try again.");
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <section className="animate-fade-in-up overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-lg">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6">
          <div className="flex items-center gap-3 text-white">
            <span className="grid size-10 place-items-center rounded-full bg-white/20">
              <Check className="size-6" />
            </span>
            <p className="text-sm font-semibold uppercase tracking-wide">Application submitted</p>
          </div>
        </div>
        <div className="p-8">
          <h2 className="text-3xl font-bold text-slate-900">Your company is awaiting admin review.</h2>
          <p className="mt-3 leading-7 text-slate-600">
            After approval, the administrator will share your Member ID and temporary
            password manually. You can then use the member login page.
          </p>
          <a href="/login" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#15388c] px-6 py-3 font-semibold text-white transition hover:bg-[#1d46a8]">
            Go to member login
          </a>
        </div>
      </section>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
      {/* Progress bar */}
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 sm:px-8">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-600">Completion</span>
          <span className="font-bold text-[#15388c]">{progress}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#15388c] to-[#2852a4] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <form onSubmit={submit} className="p-6 sm:p-8">
        {/* Honeypot */}
        <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        <div className="grid gap-6 sm:grid-cols-2">
          <Input label="Company name" name="companyName" placeholder="Registered company name" icon={Building2}
            showIcon={companyInput.length > 0} valid={companyInput.trim().length >= 2}
            onChange={e => setCompanyInput(e.target.value)} />
          <Input label="GST number" name="gstin" placeholder="27ABCDE1234F1Z5" icon={FileText}
            showIcon={gstInput.length > 0} valid={gstValid}
            hint={gstInput.length > 0 && !gstValid ? "Format: 2 digits · 5 letters · 4 digits · letter · letter Z · alphanumeric" : undefined}
            onChange={e => setGstInput(e.target.value.toUpperCase())} />
          <Input label="Responsible person" name="responsiblePersonName" placeholder="Proprietor, partner or director" icon={User}
            showIcon={personInput.length > 0} valid={personInput.trim().length >= 2}
            onChange={e => setPersonInput(e.target.value)} />
          <Input label="Mobile number" name="mobileNumber" type="tel" placeholder="10-digit Indian mobile" icon={Phone}
            showIcon={mobileInput.length > 0} valid={mobileValid}
            hint={mobileInput.length > 0 && !mobileValid ? "Starts with 6-9, exactly 10 digits" : undefined}
            onChange={e => setMobileInput(e.target.value.replace(/\D/g, "").slice(0, 10))} />
          <Input label="Email address" name="email" type="email" placeholder="business@example.com" icon={Mail}
            showIcon={emailInput.length > 0} valid={emailValid}
            onChange={e => setEmailInput(e.target.value)} />
          <label className="space-y-2">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">Business category<span className="text-rose-500">*</span></span>
            <div className="relative">
              <select
                name="category"
                value={category}
                onChange={event => setCategory(event.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-11 text-base outline-none transition focus:border-[#15388c] focus:ring-4 focus:ring-[#15388c]/10"
              >
                <option value="agriculture">Agriculture</option>
                <option value="other">Any other</option>
              </select>
              <Tag className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            </div>
          </label>
          {category === "other" && (
            <Input label="Specify category" name="otherCategory" placeholder="Category name" icon={Tag} showIcon={false} valid={false} />
          )}
          <div className={category === "other" ? "hidden" : "hidden sm:block"} />
          <LocationFields />
          <Input label="Taluka / Tehsil" name="taluka" />
          <label className="space-y-2 sm:col-span-2">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">Registered address<span className="text-rose-500">*</span></span>
            <textarea
              name="address"
              required
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition placeholder:text-slate-400 focus:border-[#15388c] focus:ring-4 focus:ring-[#15388c]/10"
              placeholder="Full registered business address"
            />
          </label>
          {error && (
            <div role="alert" className="sm:col-span-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800">
              {error}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">No ChatGPT account required.</p>
          <button
            disabled={loading}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#15388c] px-7 font-semibold text-white shadow-lg shadow-[#15388c]/20 transition hover:bg-[#1d46a8] hover:shadow-xl disabled:opacity-60"
          >
            {loading && <Loader2 className="size-5 animate-spin" />}
            {loading ? "Submitting…" : "Submit for approval"}
          </button>
        </div>
      </form>
    </div>
  );
}
