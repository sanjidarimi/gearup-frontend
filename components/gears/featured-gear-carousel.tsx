"use client";

import { Button } from "@/components/ui/button";
import type { Gear } from "@/types/gear";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { GearCard } from "./gear-card";

interface FeaturedGearCarouselProps {
  items: Gear[];
  title?: string;
  subtitle?: string;
}

export function FeaturedGearCarousel({
  items,
  title = "Featured Gear",
  subtitle,
}: FeaturedGearCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateButtons = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const frame = requestAnimationFrame(updateButtons);
    emblaApi.on("select", updateButtons);
    emblaApi.on("reInit", updateButtons);

    return () => {
      cancelAnimationFrame(frame);
      emblaApi.off("select", updateButtons);
      emblaApi.off("reInit", updateButtons);
    };
  }, [emblaApi, updateButtons]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Ready to rent
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/gear"
            className="mr-2 hidden items-center gap-1.5 text-sm font-semibold text-primary hover:underline sm:inline-flex"
          >
            See all
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Button
            variant="outline"
            size="icon-lg"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            aria-label="Previous gear"
            className="rounded-full"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-lg"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            aria-label="Next gear"
            className="rounded-full"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-5 flex py-2">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="min-w-0 shrink-0 grow-0 basis-full pl-5 sm:basis-1/2 lg:basis-1/3"
            >
              <GearCard gear={item} priority={index < 3} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
