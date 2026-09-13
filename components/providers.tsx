"use client";

import { Toaster } from "@/components/ui/sonner";
import { ApiError } from "@/lib/api-client";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

let redirectingToLogin = false;

function handleExpiredSession(error: unknown) {
  if (!(error instanceof ApiError) || error.status !== 401) return;
  if (redirectingToLogin || typeof window === "undefined") return;

  redirectingToLogin = true;
  toast.error("Your session has expired", {
    description: "Please sign in again to continue.",
  });

  const redirect = encodeURIComponent(
    `${window.location.pathname}${window.location.search}`,
  );
  window.location.assign(`/auth/login?redirect=${redirect}`);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              if (error instanceof ApiError && error.status < 500) return false;
              return failureCount < 2;
            },
          },
        },
        queryCache: new QueryCache({
          onError: (error, query) => {
            if (query.meta?.silent) return;
            handleExpiredSession(error);
          },
        }),
        mutationCache: new MutationCache({
          onError: handleExpiredSession,
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors closeButton position="top-right" />
    </QueryClientProvider>
  );
}
