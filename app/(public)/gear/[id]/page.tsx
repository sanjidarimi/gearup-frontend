import { getGearById } from "@/services/gear-api";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Layers,
  Package,
  ShieldCheck,
  Tag,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface GearDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function GearDetailsPage({
  params,
}: GearDetailsPageProps) {
  const { id } = await params;

  const response = await getGearById(id);
  const gear = response?.data;

  if (!gear) {
    notFound();
  }

  const isAvailable = gear.isAvailable && gear.stock > 0;

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Back Navigation */}
        <Link
          href="/gear"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all gear
        </Link>

        {/* Main Product Card */}
        <div className="grid grid-cols-1 gap-8 rounded-3xl border border-border bg-card p-6 lg:grid-cols-12 lg:p-10">
          {/* Left Column: Image Preview */}
          <div className="lg:col-span-6">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border/50 bg-muted sm:aspect-square">
              <Image
                src={gear.imageUrl || "/placeholder-gear.jpg"}
                alt={gear.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute top-4 right-4">
                {isAvailable ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold text-emerald-600 shadow-sm backdrop-blur-md">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Available ({gear.stock} in stock)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold text-destructive shadow-sm backdrop-blur-md">
                    <XCircle className="h-3.5 w-3.5" />
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="flex flex-col justify-between space-y-6 lg:col-span-6">
            <div className="space-y-6">
              {/* Category & Brand Badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                  <Tag className="h-3 w-3" />
                  {gear.brand}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  ID: {gear.id.slice(0, 8)}...
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                  {gear.name}
                </h1>
                {/* <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {gear?.description || "No description provided for this gear item."}
                </p> */}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/50 p-3">
                  <Package className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground">
                      Available Stock
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {gear.stock} Units
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/50 p-3">
                  <Layers className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground">
                      Condition
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      Pro-Grade
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-border pt-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Rental Rate
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-foreground">
                      ${gear.pricePerDay}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                      / day
                    </span>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> Instant booking confirmation
                </span>
              </div>

              <div className="space-y-3">
                <button
                  disabled={!isAvailable}
                  className="w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isAvailable ? "Proceed to Booking" : "Currently Unavailable"}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Inspected and verified before every dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
