import { ACCESS_TOKEN_COOKIE, API_BASE_URL } from "@/lib/config";
import type { IUserProfile } from "@/types/auth";
import { cookies } from "next/headers";
import { cache } from "react";

// Deduplicated per request, so layouts and pages can both call it freely.
export const getMe = cache(async (): Promise<IUserProfile | null> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/get-me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!response.ok) return null;

    const result = await response.json();
    return result?.data ?? null;
  } catch {
    return null;
  }
});
