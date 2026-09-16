import { CheckCircle2, XCircle, Server, Database, Activity } from "lucide-react";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

async function checkDatabase(): Promise<{ ok: boolean; latencyMs: number | null; error?: string }> {
  try {
    const start = Date.now();
    const res = await fetch("http://localhost:3000/api/health", { cache: "no-store" });
    const data = await res.json() as { ok?: boolean; database?: string };
    const latencyMs = Date.now() - start;
    return { ok: Boolean(data.ok), latencyMs };
  } catch (e) {
    return { ok: false, latencyMs: null, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export default async function HealthPage() {
  const db = await checkDatabase();
  const uptime = "Available in production";

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <div className="mx-auto max-w-3xl px-5 py-12">
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#a57c10]">
            <Activity className="size-4" />
            System status
          </div>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">Service health</h1>
          <p className="mt-2 text-slate-500">
            Real-time status of Sellers Trust Network services.
          </p>
        </div>

        {/* Overall status banner */}
        <div className={`mb-6 animate-fade-in-up delay-100 overflow-hidden rounded-2xl border p-6 ${db.ok ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
          <div className="flex items-center gap-4">
            {db.ok ? (
              <CheckCircle2 className="size-10 shrink-0 text-emerald-600" />
            ) : (
              <XCircle className="size-10 shrink-0 text-rose-600" />
            )}
            <div>
              <p className={`text-xl font-bold ${db.ok ? "text-emerald-900" : "text-rose-900"}`}>
                {db.ok ? "All systems operational" : "Database unavailable"}
              </p>
              <p className={`text-sm ${db.ok ? "text-emerald-700" : "text-rose-700"}`}>
                {db.ok
                  ? "The platform is running normally."
                  : "The application server is up but cannot reach the database. Public pages remain accessible."}
              </p>
            </div>
          </div>
        </div>

        {/* Service cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Application server */}
          <div className="animate-fade-in-up delay-200 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-[#15388c]/5 text-[#15388c]">
                  <Server className="size-5" />
                </span>
                <div>
                  <p className="font-semibold text-slate-900">Application server</p>
                  <p className="text-xs text-slate-500">Next.js 16</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                Online
              </span>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Status</dt>
                <dd className="font-medium text-slate-900">Operational</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Runtime</dt>
                <dd className="font-medium text-slate-900">Node.js</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Uptime</dt>
                <dd className="font-medium text-slate-900">{uptime}</dd>
              </div>
            </dl>
          </div>

          {/* Database */}
          <div className="animate-fade-in-up delay-300 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`grid size-10 place-items-center rounded-xl ${db.ok ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                  <Database className="size-5" />
                </span>
                <div>
                  <p className="font-semibold text-slate-900">Database</p>
                  <p className="text-xs text-slate-500">MongoDB Atlas</p>
                </div>
              </div>
              <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${db.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                <span className={`size-1.5 rounded-full ${db.ok ? "bg-emerald-500" : "bg-rose-500"}`} />
                {db.ok ? "Connected" : "Offline"}
              </span>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Status</dt>
                <dd className={`font-medium ${db.ok ? "text-emerald-700" : "text-rose-700"}`}>
                  {db.ok ? "Operational" : "Unavailable"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Latency</dt>
                <dd className="font-medium text-slate-900">
                  {db.latencyMs !== null ? `${db.latencyMs} ms` : "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Storage</dt>
                <dd className="font-medium text-slate-900">MongoDB</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Security features always available */}
        <div className="mt-6 animate-fade-in-up delay-400 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Security services</h2>
          <p className="mt-1 text-sm text-slate-500">These services run independently of database availability.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "CSP & security headers",
              "HSTS transport security",
              "Rate limiting (in-memory)",
              "Password strength meter",
              "Live GSTIN validation",
              "Form input sanitization",
            ].map(feature => (
              <div key={feature} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                <span className="text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Last checked */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Last checked: {new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
        </p>
      </div>
    </main>
  );
}
