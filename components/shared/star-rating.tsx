"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = { sm: "size-3.5", md: "size-4", lg: "size-7" };

export function StarRating({ value, size = "md", className }: StarRatingProps) {
  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      aria-label={`Rated ${value} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            SIZES[size],
            index < Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted-foreground/40",
          )}
        />
      ))}
    </div>
  );
}

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const LABELS = ["Poor", "Fair", "Good", "Great", "Excellent"];

export function StarRatingInput({
  value,
  onChange,
  disabled,
}: StarRatingInputProps) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex items-center gap-3">
      <div
        role="radiogroup"
        aria-label="Rating"
        className="flex items-center gap-1"
        onMouseLeave={() => setHovered(0)}
      >
        {Array.from({ length: 5 }).map((_, index) => {
          const rating = index + 1;
          return (
            <button
              key={rating}
              type="button"
              role="radio"
              aria-checked={value === rating}
              aria-label={`${rating} star${rating > 1 ? "s" : ""}`}
              disabled={disabled}
              onClick={() => onChange(rating)}
              onMouseEnter={() => setHovered(rating)}
              className="rounded-md p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none"
            >
              <Star
                className={cn(
                  "size-7 transition-colors",
                  rating <= active
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-muted-foreground/40",
                )}
              />
            </button>
          );
        })}
      </div>
      <span className="text-sm font-medium text-muted-foreground">
        {active ? LABELS[active - 1] : "Tap to rate"}
      </span>
    </div>
  );
}
