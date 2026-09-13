"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface RouteErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
  homeHref?: string;
  homeLabel?: string;
}

export function RouteError({
  error,
  retry,
  homeHref = "/",
  homeLabel = "Go home",
}: RouteErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="size-8" />
        </span>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
          Something went off-trail
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          An unexpected error stopped this page from loading. Try again, and if
          it keeps happening the backend may be unavailable.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            Reference: {error.digest}
          </p>
        )}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button size="lg" className="h-10 px-4" onClick={retry}>
            <RotateCcw />
            Try again
          </Button>
          <Button asChild size="lg" variant="outline" className="h-10 px-4">
            <Link href={homeHref}>
              <Home />
              {homeLabel}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
