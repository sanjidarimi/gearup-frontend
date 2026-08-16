"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { IUserProfile, UserRole } from "@/types/auth";

const roleToDashboard: Record<UserRole, string> = {
  ADMIN: "/dashboard/admin",
  PROVIDER: "/dashboard/provider",
  CUSTOMER: "/dashboard/customer",
};

export function DashboardGuard({
  user,
  children,
}: {
  user: IUserProfile;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const allowedPath = roleToDashboard[user.role];

  useEffect(() => {
    if (!pathname.startsWith(allowedPath)) {
      router.push(allowedPath);
    }
  }, [pathname, allowedPath, router]);

  if (!pathname.startsWith(allowedPath)) {
    return null;
  }

  return <>{children}</>;
}
