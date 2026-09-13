"use client";

import { ErrorState } from "@/components/shared/error-state";
import { useGears } from "@/hooks/gear/queries";
import { getErrorMessage } from "@/lib/api-client";
import { PackageOpen } from "lucide-react";
import Link from "next/link";
import { GearCardSkeleton } from "./gear-card";
import { FeaturedGearCarousel } from "./featured-gear-carousel";

interface FeaturedGearSectionProps {
  title?: string;
  subtitle?: string;
}

const FEATURED_PARAMS = { limit: 9, isAvailable: "true" };

export function FeaturedGearSection({
  title = "Featured Gear",
  subtitle = "Popular equipment ready to book right now",
}: FeaturedGearSectionProps) {
  const { data, isLoading, isError, error, refetch } = useGears(FEATURED_PARAMS);
  const items = data?.data ?? [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {isLoading ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-7 w-48 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-72 animate-pulse rounded-md bg-muted" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <GearCardSkeleton key={index} />
            ))}
          </div>
        </div>
      ) : isError ? (
        <ErrorState
          title="Couldn't load featured gear"
          message={getErrorMessage(error)}
          onRetry={() => refetch()}
        />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border p-10 text-center">
          <PackageOpen className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-semibold text-foreground">No gear listed yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Providers are stocking up. Check back soon or{" "}
            <Link href="/auth/register?role=PROVIDER" className="text-primary hover:underline">
              list your own gear
            </Link>
            .
          </p>
        </div>
      ) : (
        <FeaturedGearCarousel items={items} title={title} subtitle={subtitle} />
      )}
    </section>
  );
}
