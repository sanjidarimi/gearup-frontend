"use client";
import Link from "next/link";
import Image from "next/image";
import { Tag, ArrowUpRight, CheckCircle2, XCircle } from "lucide-react";
import { Gear } from "@/types/gear";

interface GearCardProps {
  gear: Gear;
}

export const GearCard = ({ gear }: GearCardProps) => {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/40 hover:shadow-lg">
      <div>
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={gear.imageUrl || "/placeholder-gear.jpg"}
            alt={gear.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <Tag className="h-3.5 w-3.5 text-primary" />
            <span className="text-foreground">{gear.category.name}</span>
          </div>

          <div className="absolute right-3 top-3">
            {gear.isAvailable ? (
              <span className="flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-md">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                Available
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur-md">
                <XCircle className="h-3.5 w-3.5 text-destructive" />
                Booked
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {gear.brand}
          </p>
          <h3 className="line-clamp-1 text-lg font-semibold text-card-foreground transition-colors group-hover:text-primary">
            {gear.name}
          </h3>
        </div>
      </div>

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
          className="inline-flex items-center justify-center rounded-xl bg-secondary px-3.5 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <span>Rent</span>
          <ArrowUpRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};
