# Sellers Trust Network

Next.js 16 app (SSR + API routes + MongoDB).

## Hostinger Node.js deploy

In hPanel → Node.js Apps, use:

| Setting | Value |
| --- | --- |
| Application type | `next` |
| Node.js version | `20` (or newer) |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Start command | `npm run start -- -p $PORT` |
| Output directory | `.next` |

Set these environment variables before deploy:

- `MONGODB_URI`
- `ADMIN_LOGIN_ID`
- `ADMIN_PASSWORD_HASH` (or `ADMIN_INITIAL_PASSWORD`)
- `ADMIN_EMAILS`
- `IDENTIFIER_LOOKUP_KEY`
- any other secrets your local `.env` uses

## Local

```bash
npm ci
npm run build
npm run start -- -p 3000
```
