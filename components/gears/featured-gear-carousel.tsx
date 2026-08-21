/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Gear } from "@/types/gear";
import { GearCard } from "./gear-card";

interface FeaturedGearCarouselProps {
  items: Gear[];
  title?: string;
  subtitle?: string;
}

export function FeaturedGearCarousel({
  items,
  title = "Featured Gear",
  subtitle = "High-demand professional equipment ready for deployment",
}: FeaturedGearCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    skipSnaps: false,
    dragFree: false,
  });

  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="space-y-4 container mx-auto mb-20">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Previous gear"
            className="size-9 rounded-full border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-40"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Next gear"
            className="size-9 rounded-full border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-40"
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-4 flex">
          {items.map((item) => (
            <div
              key={item.id}
              className="min-w-0 shrink-0 grow-0 pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <GearCard gear={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
