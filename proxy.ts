import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
const AUTH_ROUTES = ["/login", "/register"];
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const decodedToken = accessToken
    ? (jwt.decode(accessToken) as JwtPayload)
    : null;
  console.log(decodedToken);
  let userRole = null;
  if (decodedToken) {
    let userRole = decodedToken.role;
  }
  if (accessToken && AUTH_ROUTES.includes(pathname)) {
    if (userRole === "CUSTOMER") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    } else if (userRole === "PROVIDER") {
      return NextResponse.redirect(new URL("dashboard/provider", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
