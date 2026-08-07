"use server";

import { LoginState, RegisterState, UserRole } from "@/types/auth";
import { cookies } from "next/headers";

export const registerUserAction = async (
  prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as UserRole;

  if (!name || !email || !password || !role) {
    return { error: "All fields are required.", success: false };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long.", success: false };
  }

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        error: result.message || "Registration failed.",
        success: false,
      };
    }

    return { success: true, message: "Registration successful! Please login." };
  } catch (error) {
    console.error("Register Error:", error);
    return { error: "Something went wrong. Please try again.", success: false };
  }
};

export async function loginUserAction(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter both email and password.", success: false };
  }

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        error: result.message || "Invalid credentials.",
        success: false,
      };
    }

    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

    if (result.data?.accessToken) {
      cookieStore.set("accessToken", result.data.accessToken, {
        httpOnly: true,
        secure: isProduction,
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
        path: "/",
      });
    }

    if (result.data?.refreshToken) {
      cookieStore.set("refreshToken", result.data.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
        path: "/",
      });
    }

    const role = result.data?.user?.role;

    return {
      success: true,
      role: role as UserRole,
    };
  } catch (error) {
    console.error("Login Error:", error);
    return { error: "Network error or server unavailable. Please try again.", success: false };
  }
}