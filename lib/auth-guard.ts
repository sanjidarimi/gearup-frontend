import { ROLE_HOME } from "@/lib/constants";
import { getMe } from "@/services/get-me";
import type { UserRole } from "@/types/auth";
import { redirect } from "next/navigation";

// Proxy already blocks the obvious cases using the token; this double-checks
// against the backend so suspended or deleted accounts are logged out too.
export async function requireUser() {
  const user = await getMe();
  if (!user) redirect("/auth/login?reason=session");
  return user;
}

export async function requireRole(role: UserRole) {
  const user = await requireUser();
  if (user.role !== role) redirect(ROLE_HOME[user.role]);
  return user;
}
