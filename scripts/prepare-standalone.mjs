import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

/**
 * After `next build` with standalone output, copy static assets into the
 * standalone folder so Hostinger can start `.next/standalone/server.js`.
 */
const root = process.cwd();
const standalone = join(root, ".next", "standalone");
const serverJs = join(standalone, "server.js");
const staticSrc = join(root, ".next", "static");
const staticDest = join(standalone, ".next", "static");
const publicSrc = join(root, "public");
const publicDest = join(standalone, "public");

if (!existsSync(serverJs)) {
  console.error("Missing .next/standalone/server.js — Hostinger deploy will fail.");
  process.exit(1);
}

mkdirSync(join(standalone, ".next"), { recursive: true });
if (existsSync(staticSrc)) {
  cpSync(staticSrc, staticDest, { recursive: true });
}
if (existsSync(publicSrc)) {
  cpSync(publicSrc, publicDest, { recursive: true });
}

console.log("Standalone server ready:", serverJs);
