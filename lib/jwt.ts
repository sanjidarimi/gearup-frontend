import type { AuthTokenPayload } from "@/types/auth";

// Decode only. The backend verifies the signature on every API call;
// the frontend just needs the role and expiry for routing decisions.
export function decodeToken(token?: string | null): AuthTokenPayload | null {
  if (!token) return null;

  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
    const data = JSON.parse(new TextDecoder().decode(bytes));

    return data?.id && data?.role ? (data as AuthTokenPayload) : null;
  } catch {
    return null;
  }
}

export function isTokenExpired(payload: AuthTokenPayload, skewSeconds = 10) {
  if (!payload.exp) return false;
  return payload.exp * 1000 <= Date.now() + skewSeconds * 1000;
}
