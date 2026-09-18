import { NextResponse, type NextRequest } from "next/server";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { isConfiguredAdmin } from "@/lib/member-data";
import { currentMember } from "@/lib/member-session";

export const dynamic = "force-dynamic";

/**
 * Brand-logo destination used across every page.
 *
 * Resolves the caller's session and sends them to the home page that belongs
 * to them: administrators to the admin console, approved members to their
 * workspace, and everyone else to the public landing page.
 */
export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL(await homePath(), request.url));
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

async function homePath(): Promise<string> {
  try {
    const admin = await getChatGPTUser();
    if (admin && isConfiguredAdmin(admin.email)) return "/admin";
  } catch {
    // Session lookup failures must never block the logo; fall through.
  }

  try {
    const member = await currentMember();
    if (member) return member.mustChangePassword ? "/member/password" : "/member";
  } catch {
    // Same here — an unreachable database still returns the public home page.
  }

  return "/";
}
