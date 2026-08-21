"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGears } from "@/features/gear/queries";
import { AlertCircle, RefreshCw } from "lucide-react";
import { FeaturedGearCarousel } from "./featured-gear-carousel";

interface FeaturedGearSectionProps {
  title?: string;
  subtitle?: string;
}

export function FeaturedGearSection({
  title = "Featured Gear",
  subtitle = "High-demand professional equipment ready for deployment",
}: FeaturedGearSectionProps) {
  const { data, isLoading, isError, refetch } = useGears();

  if (isLoading) {
    return (
      <div className="space-y-4  container mx-auto">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 bg-muted" />
          <Skeleton className="h-4 w-96 bg-muted" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col space-y-3 rounded-xl border border-border p-4"
            >
              <Skeleton className="aspect-4/3 w-full rounded-lg bg-muted" />
              <Skeleton className="h-4 w-2/3 bg-muted" />
              <Skeleton className="h-4 w-1/3 bg-muted" />
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-6 w-16 bg-muted" />
                <Skeleton className="h-8 w-24 bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
        <AlertCircle className="size-10 text-destructive mb-2" />
        <h3 className="font-semibold text-foreground">
          Failed to load featured gear
        </h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          Something went wrong while fetching the gear list.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-2 border-border"
        >
          <RefreshCw className="size-4" /> Try Again
        </Button>
      </div>
    );
  }

  const gearItems = Array.isArray(data) ? data : data?.data || [];

  if (!gearItems || gearItems.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        No gear available at the moment.
      </div>
    );
  }

  return (
    <FeaturedGearCarousel items={gearItems} title={title} subtitle={subtitle} />
  );
}
