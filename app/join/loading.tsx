import { Building2, FileText, User, Phone, Mail, MapPin } from "lucide-react";

export default function Loading() {
  const fieldIcon = "size-5 text-slate-300";
  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      {/* Header skeleton */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-4">
          <div className="size-12 animate-pulse rounded-xl bg-slate-200" />
          <div className="space-y-1.5">
            <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
          </div>
          <div className="ml-auto h-9 w-28 animate-pulse rounded-lg bg-slate-100" />
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-10">
        {/* Title skeleton */}
        <div className="mb-8">
          <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-10 w-3/4 max-w-md animate-pulse rounded-xl bg-slate-200" />
          <div className="mt-3 h-4 w-full max-w-2xl animate-pulse rounded bg-slate-100" />
          <div className="mt-1.5 h-4 w-2/3 max-w-xl animate-pulse rounded bg-slate-100" />
        </div>

        {/* Form card skeleton */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
          {/* Progress bar skeleton */}
          <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 sm:px-8">
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-10 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="mt-2 h-2 w-full animate-pulse rounded-full bg-slate-200" />
          </div>

          {/* Fields skeleton */}
          <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
            {[
              { icon: Building2, label: "w-32" },
              { icon: FileText, label: "w-28" },
              { icon: User, label: "w-36" },
              { icon: Phone, label: "w-32" },
              { icon: Mail, label: "w-32" },
              { icon: MapPin, label: "w-36" },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i}>
                <div className={`h-4 ${label} animate-pulse rounded bg-slate-200`} />
                <div className="relative mt-2">
                  <Icon className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${fieldIcon}`} />
                  <div className="h-12 w-full animate-pulse rounded-xl border border-slate-200 bg-slate-50" />
                </div>
              </div>
            ))}
          </div>

          {/* Button skeleton */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-5 sm:px-8">
            <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
            <div className="h-12 w-40 animate-pulse rounded-xl bg-[#15388c]/30" />
          </div>
        </div>
      </section>
    </main>
  );
}
