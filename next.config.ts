import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Hostinger also forces standalone for Next.js apps and starts
  // `.next/standalone/server.js`. Keep this explicit for local parity.
  output: "standalone",
  // Pin tracing to this app folder so a parent/sibling lockfile on Hostinger
  // cannot move the standalone output and fail deploy with "no standalone server".
  outputFileTracingRoot: path.join(process.cwd()),
  poweredByHeader: false,
  async headers() {
    // NOTE: Content-Security-Policy is set per-request by proxy.ts with a
    // cryptographic nonce (H1 fix). Static security headers remain here.
    return [{source:"/:path*",headers:[
      {key:"X-Content-Type-Options",value:"nosniff"},
      {key:"Referrer-Policy",value:"strict-origin-when-cross-origin"},
      {key:"Permissions-Policy",value:"camera=(), microphone=(), geolocation=()"},
      {key:"Strict-Transport-Security",value:"max-age=31536000"},
    ]},...['/admin/:path*','/member/:path*','/api/:path*','/login','/admin-login','/forgot-password'].map(source=>({source,headers:[{key:"Cache-Control",value:"private, no-store"}]}))];
  },
};

export default nextConfig;
