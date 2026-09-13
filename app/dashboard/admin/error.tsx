"use client";

import { RouteError } from "@/components/shared/route-error";

export default function AdminDashboardError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <RouteError
      error={error}
      retry={unstable_retry}
      homeHref="/dashboard/admin"
      homeLabel="Dashboard home"
    />
  );
}
