import { Gear } from "@/types/gear";
import Image from "next/image";

export function GearCard({ gear }: { gear: Gear }) {
  const isAvailable = gear.isAvailable && gear.stock > 0;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/50 hover:shadow-md">
      <div className="space-y-3">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={gear.imageUrl}
            alt={gear.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span
            className={`absolute top-2 right-2 rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${
              isAvailable
                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                : "bg-destructive/10 text-destructive border border-destructive/20"
            }`}
          >
            {isAvailable ? "Available" : "Out of Stock"}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-semibold uppercase tracking-wider text-primary">
            {gear.brand}
          </span>
          <span>{gear.category?.name}</span>
        </div>

        <h3 className="line-clamp-2 text-sm font-bold text-card-foreground">
          {gear.name}
        </h3>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <div>
          <span className="text-base font-extrabold text-foreground">
            ${gear.pricePerDay}
          </span>
          <span className="text-xs text-muted-foreground"> / day</span>
        </div>
        <button
          disabled={!isAvailable}
          className="rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Rent Now
        </button>
      </div>
    </div>
  );
}
