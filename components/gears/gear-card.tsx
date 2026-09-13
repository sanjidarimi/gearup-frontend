import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Gear } from "@/types/gear";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { GearImage } from "./gear-image";

interface GearCardProps {
  gear: Gear;
  priority?: boolean;
  // Carries the rental dates picked on the catalog over to the details page.
  linkQuery?: string;
}

export function GearCard({ gear, priority, linkQuery }: GearCardProps) {
  const isAvailable = gear.isAvailable && gear.stock > 0;
  const href = `/gear/${gear.id}${linkQuery ? `?${linkQuery}` : ""}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
      <Link
        href={href}
        className="relative block aspect-4/3 overflow-hidden bg-muted"
        aria-label={`View ${gear.name}`}
      >
        <GearImage
          src={gear.imageUrl}
          alt={gear.name}
          category={gear.category?.name}
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          {gear.category?.name ? (
            <span className="rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm backdrop-blur">
              {gear.category.name}
            </span>
          ) : (
            <span />
          )}
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur",
              isAvailable
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                isAvailable ? "bg-emerald-500" : "bg-zinc-400",
              )}
            />
            {isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {gear.brand || "Independent brand"}
        </p>
        <h3 className="mt-1 line-clamp-1 text-base font-semibold text-card-foreground transition-colors group-hover:text-primary">
          <Link href={href}>{gear.name}</Link>
        </h3>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <p className="text-xl font-bold text-foreground">
              {formatCurrency(gear.pricePerDay)}
              <span className="text-xs font-normal text-muted-foreground">
                {" "}
                / day
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              {isAvailable ? `${gear.stock} in stock` : "Currently rented out"}
            </p>
          </div>

          <Link
            href={href}
            className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Rent now
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function GearCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-3/4" />
        <div className="flex items-end justify-between pt-4">
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
