
"use client";

import { useSingleGear } from "@/features/gear/queries";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Loader2,
  PackageCheck,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";

interface GearDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function GearDetailPage({ params }: GearDetailPageProps) {
  const { id } = use(params);
  const { data, isLoading, isError } = useSingleGear(id);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-xl font-bold text-foreground">
          Gear item not found
        </h2>
        <Link
          href="/gear"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalog
        </Link>
      </div>
    );
  }

  const gear = data.data;

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link
          href="/gear"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Equipment
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Display Gallery */}
          <div className="lg:col-span-7">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-border bg-card">
              <Image
                src={gear.imageUrl || "/placeholder-gear.jpg"}
                alt={gear.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Booking & Specs Sidebar */}
          <div className="flex flex-col justify-between space-y-6 lg:col-span-5">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                  {gear.category?.name || "General"}
                </span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {gear.brand}
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-bold tracking-tight text-card-foreground sm:text-3xl">
                {gear.name}
              </h1>

              <div className="mt-6 flex items-baseline gap-2 border-b border-border pb-6">
                <span className="text-3xl font-extrabold text-foreground">
                  ${gear.pricePerDay}
                </span>
                <span className="text-sm text-muted-foreground">
                  / per day rental
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <PackageCheck className="h-4 w-4 text-primary" />
                    Available Stock
                  </span>
                  <span className="font-semibold text-foreground">
                    {gear.stock} units
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Rental Status
                  </span>
                  {gear.isAvailable ? (
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Ready to Rent
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-medium text-muted-foreground">
                      <XCircle className="h-4 w-4 text-destructive" />
                      Unavailable
                    </span>
                  )}
                </div>
              </div>

              <button
                disabled={!gear.isAvailable || gear.stock === 0}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Calendar className="h-4 w-4" />
                Reserve Rental Dates
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
