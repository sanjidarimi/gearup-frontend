"use client";

import { getCategoryVisual } from "@/lib/images";
import Image from "next/image";
import { useState } from "react";

interface GearImageProps {
  src?: string | null;
  alt: string;
  category?: string | null;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

function isUsableSrc(src?: string | null): src is string {
  return Boolean(src && (src.startsWith("/") || /^https?:\/\//i.test(src)));
}

// Provider-supplied URLs can be missing or broken, so fall back to a
// category photo instead of showing an empty box.
export function GearImage({
  src,
  alt,
  category,
  sizes = "(max-width: 768px) 100vw, 33vw",
  className,
  priority,
}: GearImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const fallback = getCategoryVisual(category).cover;
  const resolved = isUsableSrc(src) && src !== failedSrc ? src : fallback;

  return (
    <Image
      src={resolved}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      unoptimized={resolved.startsWith("http://")}
      onError={() => {
        if (resolved !== fallback) setFailedSrc(resolved);
      }}
    />
  );
}
