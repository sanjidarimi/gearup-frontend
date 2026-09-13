"use server";

import {
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
  authCookieOptions,
} from "@/lib/auth-cookies";
import {
  ACCESS_TOKEN_COOKIE,
  API_BASE_URL,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/config";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@/lib/validations/auth";
import type { ActionResult } from "@/types/auth";
import { cookies } from "next/headers";

const NETWORK_ERROR =
  "Can't reach the GearUp server right now. Please try again in a moment.";

// The API hides most thrown errors behind a generic 500 message in
// production, so translate that into something a person can act on.
function readableError(message: unknown, fallback: string) {
  if (typeof message !== "string" || !message) return fallback;
  if (message === "Internal Server Error") return fallback;
  return message.charAt(0).toUpperCase() + message.slice(1);
}

export async function registerUserAction(
  input: RegisterInput,
): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Please check the form.",
    };
  }

  const { name, email, password, role } = parsed.data;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: readableError(
          result?.message,
          "We couldn't create that account. The email may already be registered.",
        ),
      };
    }

    return { success: true, message: "Account created! Please sign in." };
  } catch {
    return { success: false, message: NETWORK_ERROR };
  }
}

export async function loginUserAction(
  input: LoginInput,
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Please check the form.",
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);
    const accessToken: string | undefined = result?.data?.accessToken;

    if (!response.ok || !result?.success || !accessToken) {
      return {
        success: false,
        message: readableError(
          result?.message,
          "Incorrect email or password. If they're correct, your account may be suspended.",
        ),
      };
    }

    const cookieStore = await cookies();
    cookieStore.set(
      ACCESS_TOKEN_COOKIE,
      accessToken,
      authCookieOptions(ACCESS_TOKEN_MAX_AGE),
    );

    if (result.data.refreshToken) {
      cookieStore.set(
        REFRESH_TOKEN_COOKIE,
        result.data.refreshToken,
        authCookieOptions(REFRESH_TOKEN_MAX_AGE),
      );
    }

    return {
      success: true,
      message: `Welcome back, ${result.data.user?.name ?? "adventurer"}!`,
      role: result.data.user?.role,
    };
  } catch {
    return { success: false, message: NETWORK_ERROR };
  }
}
