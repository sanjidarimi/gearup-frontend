"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { GearImage } from "./gear-image";

export interface GalleryImage {
  src: string | null;
  alt: string;
  isProductPhoto: boolean;
}

interface GearGalleryProps {
  images: GalleryImage[];
  category?: string | null;
}

export function GearGallery({ images, category }: GearGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  const go = (direction: 1 | -1) =>
    setActiveIndex((index) => (index + direction + images.length) % images.length);

  return (
    <div
      className="space-y-3"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") go(1);
        if (event.key === "ArrowLeft") go(-1);
      }}
    >
      <div className="group relative aspect-4/3 overflow-hidden rounded-3xl border border-border bg-muted">
        <GearImage
          key={activeIndex}
          src={active.src}
          alt={active.alt}
          category={category}
          priority={activeIndex === 0}
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover animate-in fade-in duration-300"
        />

        {!active.isProductPhoto && (
          <span className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            In the field · illustrative photo
          </span>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground opacity-0 shadow-md backdrop-blur transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground opacity-0 shadow-md backdrop-blur transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
            >
              <ChevronRight className="size-5" />
            </button>
            <span className="absolute right-4 top-4 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
              {activeIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl border-2 bg-muted transition-all",
                index === activeIndex
                  ? "border-primary"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <GearImage
                src={image.src}
                alt=""
                category={category}
                sizes="140px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
