"use client";

import { Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const HIDE_PREFIXES = ["/admin", "/member", "/admin-login", "/admin-logout"];

function shouldHide(path: string) {
  return HIDE_PREFIXES.some(
    prefix => path === prefix || path.startsWith(`${prefix}/`),
  );
}

export function ThemeToggle() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [ready, setReady] = useState(false);

  // Canonical next-themes mounted pattern: avoids hydration mismatch by only
  // rendering the resolved icon after mount. setState here is asynchronous
  // (fires after the browser paints) and does not cause cascading renders.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setReady(true), []);

  // Admin/member workspaces stay light — no theme switcher.
  useEffect(() => {
    if (shouldHide(pathname)) setTheme("light");
  }, [pathname, setTheme]);

  if (shouldHide(pathname)) return null;

  const dark = ready && resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="fixed bottom-5 right-5 z-50 grid size-11 place-items-center rounded-full border border-slate-300 bg-white text-[#15388c] shadow-lg transition hover:scale-105 dark:border-slate-600 dark:bg-slate-800 dark:text-amber-300"
      aria-label={dark ? "Use light mode" : "Use dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
    >
      {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}
