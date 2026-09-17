/**
 * Hostinger Node.js entry file.
 * Application startup file should be: server.js
 * Start command can be: npm start  OR  node server.js
 */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const standaloneServer = join(root, ".next", "standalone", "server.js");

if (!existsSync(standaloneServer)) {
  console.error("Missing .next/standalone/server.js. Run: npm run build");
  process.exit(1);
}

// Hostinger reverse-proxy needs the app bound on all interfaces.
if (!process.env.HOSTNAME) process.env.HOSTNAME = "0.0.0.0";

await import(pathToFileURL(standaloneServer).href);
