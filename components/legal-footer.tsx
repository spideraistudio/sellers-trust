import Link from "next/link";
import { ShieldCheck, Mail, MapPin } from "lucide-react";

export function LegalFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-8">
        {/* Multi-column layout */}
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-[#15388c]" />
              <span className="font-bold text-slate-900">Sellers Trust Network</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Private, category-controlled company verification network for Indian
              businesses.
            </p>
          </div>

          {/* Platform column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Platform</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/about" className="text-slate-600 transition hover:text-[#15388c] hover:underline">About</Link></li>
              <li><Link href="/plans" className="text-slate-600 transition hover:text-[#15388c] hover:underline">Plans</Link></li>
              <li><Link href="/faq" className="text-slate-600 transition hover:text-[#15388c] hover:underline">FAQ</Link></li>
              <li><Link href="/health" className="text-slate-600 transition hover:text-[#15388c] hover:underline">Status</Link></li>
            </ul>
          </div>

          {/* Account column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Account</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/join" className="text-slate-600 transition hover:text-[#15388c] hover:underline">Register company</Link></li>
              <li><Link href="/login" className="text-slate-600 transition hover:text-[#15388c] hover:underline">Member login</Link></li>
              <li><Link href="/admin-login" className="text-slate-600 transition hover:text-[#15388c] hover:underline">Admin login</Link></li>
              <li><Link href="/forgot-password" className="text-slate-600 transition hover:text-[#15388c] hover:underline">Forgot password</Link></li>
            </ul>
          </div>

          {/* Legal + contact column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Legal &amp; contact</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/privacy" className="text-slate-600 transition hover:text-[#15388c] hover:underline">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-600 transition hover:text-[#15388c] hover:underline">Terms of Use</Link></li>
              <li><Link href="/disclaimer" className="text-slate-600 transition hover:text-[#15388c] hover:underline">Disclaimer</Link></li>
              <li><Link href="/contact" className="text-slate-600 transition hover:text-[#15388c] hover:underline">Contact us</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact info bar */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-100 pt-5 text-xs text-slate-500">
          <a href="mailto:meetpatel.hmt@gmail.com" className="flex items-center gap-1.5 transition hover:text-[#15388c]">
            <Mail className="size-3.5" />
            meetpatel.hmt@gmail.com
          </a>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            Himatnagar, Gujarat 383001, India
          </span>
        </div>

        {/* Copyright */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-400">
          <p>© 2026 Meet Patel · Sellers Trust Network. All rights reserved.</p>
          <p>Operated by Meet Patel · Grievance Officer</p>
        </div>
      </div>
    </footer>
  );
}
