import { API_BASE_URL, REFRESH_TOKEN_COOKIE } from "./config";

export const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export function authCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        cookie: `${REFRESH_TOKEN_COOKIE}=${encodeURIComponent(refreshToken)}`,
      },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const result = await response.json();
    return result?.data?.accessToken ?? null;
  } catch {
    return null;
  }
}
