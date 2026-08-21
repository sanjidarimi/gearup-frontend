"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCategory } from "@/features/category/queries";
import { Category } from "@/types/category";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import {
  Layers,
  Tent,
  Bike,
  Waves,
  Compass,
  Footprints,
  Snowflake,
  Flame,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Trophy,
  ShieldAlert,
  LucideIcon,
} from "lucide-react";
import { CategoriesSkeleton } from "../shared/categories-skeleton";

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  "camping & hiking": Tent,
  camping: Tent,
  cycling: Bike,
  "fitness & training": Dumbbell,
  "outdoor adventure": Compass,
  "sports accessories": ShieldAlert,
  "team sports": Trophy,
  "water sports": Waves,
  "winter sports": Snowflake,
  hiking: Footprints,
  climbing: Compass,
  cooking: Flame,
};

function getCategoryIcon(name: string): LucideIcon {
  const normalized = name.toLowerCase().trim();
  return CATEGORY_ICON_MAP[normalized] ?? Layers;
}

export function Categories() {
  const { data, isLoading, isError } = useCategory();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    const frame = requestAnimationFrame(onSelect);

    return () => {
      cancelAnimationFrame(frame);
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (isLoading) {
    return <CategoriesSkeleton />;
  }

  if (isError || !data || !Array.isArray(data)) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
        Failed to load categories.
      </div>
    );
  }

  const categories: Category[] = data;

  return (
    <section className="w-full space-y-3 container mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Browse by Category
          </h2>
          <span className="text-xs text-muted-foreground">
            ({categories.length})
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Previous categories"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-card-foreground transition-all duration-150 hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Next categories"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-card-foreground transition-all duration-150 hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden" ref={emblaRef}>
        <div className="flex gap-2">
          <div className="flex-[0_0_auto]">
            <CategoryTile
              href="/gear"
              label="All Gear"
              Icon={Layers}
              isActive={!activeCategory}
            />
          </div>

          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.name);
            const isActive = activeCategory === cat.name;

            return (
              <div key={cat.id ?? cat.name} className="flex-[0_0_auto]">
                <CategoryTile
                  href={`/gear?category=${encodeURIComponent(cat.name)}`}
                  label={cat.name}
                  Icon={Icon}
                  isActive={isActive}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface CategoryTileProps {
  href: string;
  label: string;
  Icon: LucideIcon;
  isActive: boolean;
}

function CategoryTile({ href, label, Icon, isActive }: CategoryTileProps) {
  return (
    <Link
      href={href}
      className={`group flex min-w-27 sm:min-w-32 flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-center transition-all duration-150 ease-in-out hover:border-primary/50 hover:bg-accent hover:shadow-sm ${
        isActive
          ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/20"
          : "border-border bg-card text-card-foreground hover:text-accent-foreground"
      }`}
    >
      <Icon
        className={`h-5 w-5 transition-transform duration-150 group-hover:scale-110 ${
          isActive
            ? "text-primary"
            : "text-muted-foreground group-hover:text-primary"
        }`}
      />
      <span className="truncate text-xs font-medium leading-none max-w-25">
        {label}
      </span>
    </Link>
  );
}
