import {
  ACCESS_TOKEN_MAX_AGE,
  authCookieOptions,
  refreshAccessToken,
} from "@/lib/auth-cookies";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/config";
import { ROLE_HOME } from "@/lib/constants";
import { decodeToken, isTokenExpired } from "@/lib/jwt";
import type { AuthTokenPayload, UserRole } from "@/types/auth";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_ROUTES = ["/auth/login", "/auth/register"];
const CUSTOMER_ONLY_ROUTES = ["/checkout", "/payment"];
const DASHBOARD_ROLE: Record<string, UserRole> = {
  customer: "CUSTOMER",
  provider: "PROVIDER",
  admin: "ADMIN",
};

interface Session {
  user: AuthTokenPayload | null;
  freshToken?: string;
  clearCookies?: boolean;
}

async function resolveSession(request: NextRequest): Promise<Session> {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const payload = decodeToken(accessToken);

  if (payload && !isTokenExpired(payload)) return { user: payload };

  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  if (refreshToken) {
    const freshToken = await refreshAccessToken(refreshToken);
    const freshPayload = decodeToken(freshToken);
    if (freshToken && freshPayload) {
      return { user: freshPayload, freshToken };
    }
  }

  return { user: null, clearCookies: Boolean(accessToken || refreshToken) };
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = await resolveSession(request);
  const { user } = session;

  if (session.freshToken) {
    // Let server components in this same request read the refreshed token.
    request.cookies.set(ACCESS_TOKEN_COOKIE, session.freshToken);
  }

  const finalize = (response: NextResponse) => {
    if (session.freshToken) {
      response.cookies.set(
        ACCESS_TOKEN_COOKIE,
        session.freshToken,
        authCookieOptions(ACCESS_TOKEN_MAX_AGE),
      );
    }
    if (session.clearCookies) {
      response.cookies.delete(ACCESS_TOKEN_COOKIE);
      response.cookies.delete(REFRESH_TOKEN_COOKIE);
    }
    return response;
  };

  const next = () =>
    finalize(NextResponse.next({ request: { headers: request.headers } }));
  const redirectTo = (path: string) =>
    finalize(NextResponse.redirect(new URL(path, request.url)));

  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    // The dashboard sends people here when the backend rejects their token,
    // so drop the cookies instead of bouncing them straight back.
    if (request.nextUrl.searchParams.get("reason") === "session") {
      session.freshToken = undefined;
      session.clearCookies = true;
      return next();
    }
    return user ? redirectTo(ROLE_HOME[user.role]) : next();
  }

  if (!user) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    return finalize(NextResponse.redirect(loginUrl));
  }

  const home = ROLE_HOME[user.role];

  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    return redirectTo(home);
  }

  if (pathname.startsWith("/dashboard/")) {
    const requiredRole = DASHBOARD_ROLE[pathname.split("/")[2] ?? ""];
    if (requiredRole && requiredRole !== user.role) return redirectTo(home);
  }

  if (
    CUSTOMER_ONLY_ROUTES.some((route) => pathname.startsWith(route)) &&
    user.role !== "CUSTOMER"
  ) {
    return redirectTo(home);
  }

  return next();
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/dashboard/:path*",
    "/checkout/:path*",
    "/payment/:path*",
  ],
};
