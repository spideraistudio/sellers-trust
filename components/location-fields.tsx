"use client";

import { useState } from "react";
import { MapPin, Building, Hash, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import stateDistricts from "@/lib/data/state-districts.json";

const locationData = stateDistricts as Record<string, string[]>;
const states = Object.keys(locationData);

export function LocationFields({ defaultState = "", defaultDistrict = "", defaultPincode = "", readOnly = false }: { defaultState?: string; defaultDistrict?: string; defaultPincode?: string; readOnly?: boolean }) {
  const [state, setState] = useState(defaultState);
  const [district, setDistrict] = useState(defaultDistrict);
  const [pincode, setPincode] = useState(defaultPincode);
  const [status, setStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");
  const [message, setMessage] = useState("");
  const districts = locationData[state] || [];

  async function checkPincode() {
    if (readOnly || !state || !district || !/^[1-9][0-9]{5}$/.test(pincode)) {
      if (!readOnly && pincode) { setStatus("invalid"); setMessage("Select the state and district, then enter a valid six-digit PIN code."); }
      return;
    }
    setStatus("checking");
    try {
      const response = await fetch("/api/location-validation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ state, district, pincode }) });
      const data = await response.json() as { valid?: boolean; error?: string };
      setStatus(response.ok && data.valid ? "valid" : "invalid");
      setMessage(response.ok && data.valid ? "PIN code matches the selected state and district." : data.error || "PIN code could not be verified.");
    } catch {
      setStatus("invalid"); setMessage("PIN-code verification is temporarily unavailable. Please try again.");
    }
  }

  return (
    <>
      <label className="block text-sm font-medium text-slate-700">State *
        <div className="relative mt-2">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
          <select name="state" required value={state} disabled={readOnly} onChange={event => { setState(event.target.value); setDistrict(""); setPincode(""); setStatus("idle"); setMessage(""); }} className={`h-12 w-full appearance-none rounded-xl border bg-white pl-11 pr-4 text-base outline-none transition focus:border-[#15388c] focus:ring-4 focus:ring-[#15388c]/10 disabled:bg-slate-100 disabled:text-slate-600 ${status === "invalid" ? "border-rose-400" : status === "valid" ? "border-emerald-500" : "border-slate-200"}`}>
            <option value="">Select state</option>
            {defaultState && !states.includes(defaultState) && <option value={defaultState}>{defaultState}</option>}
            {states.map(name => <option value={name} key={name}>{name}</option>)}
          </select>
        </div>
        {readOnly && <input type="hidden" name="state" value={state} />}
      </label>
      <label className="block text-sm font-medium text-slate-700">District *
        <div className="relative mt-2">
          <Building className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
          <select name="district" required value={district} disabled={readOnly || !state} onChange={event => { setDistrict(event.target.value); setPincode(""); setStatus("idle"); setMessage(""); }} className={`h-12 w-full appearance-none rounded-xl border bg-white pl-11 pr-4 text-base outline-none transition focus:border-[#15388c] focus:ring-4 focus:ring-[#15388c]/10 disabled:bg-slate-100 disabled:text-slate-600 ${status === "invalid" ? "border-rose-400" : status === "valid" ? "border-emerald-500" : "border-slate-200"}`}>
            <option value="">{state ? "Select district" : "Select state first"}</option>
            {defaultDistrict && !districts.includes(defaultDistrict) && <option value={defaultDistrict}>{defaultDistrict}</option>}
            {districts.map(name => <option value={name} key={name}>{name}</option>)}
          </select>
        </div>
        {readOnly && <input type="hidden" name="district" value={district} />}
      </label>
      <label className="block text-sm font-medium text-slate-700">PIN code *
        <div className="relative mt-2">
          <Hash className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
          <input name="pincode" required={!readOnly || Boolean(pincode)} value={pincode} readOnly={readOnly} inputMode="numeric" autoComplete="postal-code" pattern="[1-9][0-9]{5}" maxLength={6} placeholder="Six-digit PIN code" onChange={event => { setPincode(event.target.value.replace(/\D/g, "").slice(0, 6)); setStatus("idle"); setMessage(""); }} onBlur={checkPincode} className={`h-12 w-full rounded-xl border bg-white pl-11 pr-10 text-base outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-[#15388c]/10 focus:border-[#15388c] ${readOnly ? "bg-slate-100 text-slate-600" : ""} ${status === "invalid" ? "border-rose-400" : status === "valid" ? "border-emerald-500" : "border-slate-200"}`} />
          {!readOnly && status !== "idle" && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              {status === "checking" ? <Loader2 className="size-5 animate-spin text-slate-400" /> :
               status === "valid" ? <CheckCircle2 className="size-5 text-emerald-600" /> :
               <XCircle className="size-5 text-rose-500" />}
            </span>
          )}
        </div>
        {!readOnly && <span aria-live="polite" className={`mt-2 block text-sm ${status === "invalid" ? "text-rose-600" : status === "valid" ? "text-emerald-700" : "text-slate-500"}`}>{status === "checking" ? "Checking PIN code…" : message}</span>}
      </label>
    </>
  );
}
