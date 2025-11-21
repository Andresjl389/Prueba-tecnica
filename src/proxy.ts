import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "./lib/session";

const publicPaths = ["/", "/login", "/api/auth/login"];
const protectedPrefixes = ["/cliente", "/soporte", "/admin", "/api"];

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic = publicPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  const isProtected = protectedPrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (!isProtected || isPublic) return NextResponse.next();

  const sessionToken = req.cookies.get("session")?.value;
  const session = await verifySessionToken(sessionToken);

  if (session) return NextResponse.next();

  if (pathname.startsWith("/api")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const redirectUrl = req.nextUrl.clone();
  redirectUrl.pathname = "/";
  redirectUrl.searchParams.set("redirectTo", pathname);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth/login).*)"],
};
