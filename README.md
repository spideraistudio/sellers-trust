# Sellers Trust Network

Next.js 16 SSR app (API routes + MongoDB) for Hostinger Node.js hosting.

## Hostinger settings (must match)

| Field | Value |
| --- | --- |
| Framework preset | Next.js |
| Branch | `Dev` |
| Node version | `20.x` |
| Root directory | `./` |
| Build command | `npm run build` |
| Package manager | npm |
| Output directory | `.next` |
| Entry file | leave empty (Hostinger starts the standalone server) |

Also set env vars in Hostinger before redeploy: `MONGODB_URI`, admin secrets, etc.

## Why "Build Failed" can show even when logs look green

Hostinger always runs Next in **standalone** mode and then looks for `.next/standalone`.  
If that folder is missing, the UI shows **Build Failed** even after `✓ Compiled successfully`.

This repo sets `output: "standalone"` in `next.config.ts` so that artifact is always produced.

## Local

```bash
npm ci
npm run build
npm run start
```
