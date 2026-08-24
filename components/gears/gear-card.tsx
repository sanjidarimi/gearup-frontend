// components/gear-card.tsx (ba components/gear/gear-card.tsx)
"use client";

import { Gear } from "@/types/gear";
import { ArrowUpRight, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface GearCardProps {
  gear: Gear;
}

export const GearCard = ({ gear }: GearCardProps) => {
  const isAvailable = gear?.isAvailable && gear?.stock > 0;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/40 hover:shadow-lg">
      <Link href={`/gear/${gear.id}`} className="block">
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={gear.imageUrl || "/placeholder-gear.jpg"}
            alt={gear.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute top-3 right-3">
            {isAvailable ? (
              <span className="flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-emerald-600 backdrop-blur-md">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Available
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-destructive backdrop-blur-md">
                <XCircle className="h-3.5 w-3.5" />
                Out of Stock
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {gear.brand} • {gear.category?.name}
          </p>
          <h3 className="line-clamp-1 text-lg font-semibold text-card-foreground transition-colors group-hover:text-primary">
            {gear.name}
          </h3>
        </div>
      </Link>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <div>
          <span className="text-xs text-muted-foreground">Daily Rate</span>
          <p className="text-lg font-bold text-foreground">
            ${gear.pricePerDay}
            <span className="text-xs font-normal text-muted-foreground">
              /day
            </span>
          </p>
        </div>

        <Link
          href={`/gear/${gear.id}`}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <span>Rent Now</span>
          <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};
