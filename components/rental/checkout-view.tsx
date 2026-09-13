"use client";

import { GearImage } from "@/components/gears/gear-image";
import { DateRangePicker } from "@/components/shared/date-range-picker";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCreateRental } from "@/hooks/rental/queries";
import { useRentalBooking } from "@/hooks/rental/use-rental-booking";
import { formatCurrency, toUtcDateString } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Gear } from "@/types/gear";
import { format } from "date-fns";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Info,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QuantityStepper } from "./quantity-stepper";

interface CheckoutViewProps {
  gear: Gear;
  categoryName: string | null;
  initialFrom?: string;
  initialTo?: string;
  initialQuantity?: number;
}

const STEPS = ["Choose dates", "Review & confirm", "Provider confirms", "Pay"];

export function CheckoutView({
  gear,
  categoryName,
  initialFrom,
  initialTo,
  initialQuantity,
}: CheckoutViewProps) {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const createRental = useCreateRental();
  const booking = useRentalBooking(gear, {
    from: initialFrom,
    to: initialTo,
    quantity: initialQuantity,
  });
  const { user, range, days, quantity, total, isAvailable } = booking;

  const canSubmit =
    isAvailable && days > 0 && agreed && !createRental.isPending;

  const handleSubmit = () => {
    if (!range?.from || !range?.to || !canSubmit) return;

    createRental.mutate(
      {
        startDate: toUtcDateString(range.from),
        endDate: toUtcDateString(range.to),
        items: [{ gearItemId: gear.id, quantity }],
      },
      {
        onSuccess: (order) =>
          router.push(`/dashboard/customer/orders/${order.id}?placed=1`),
      },
    );
  };

  return (
    <main className="px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-4">
          <Link
            href={`/gear/${gear.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to {gear.name}
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Checkout
          </h1>

          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {STEPS.map((step, index) => {
              const state = index < 1 ? "done" : index === 1 ? "current" : "next";
              return (
                <li
                  key={step}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium",
                    state === "current" && "border-primary bg-primary/10 text-primary",
                    state === "done" && "border-border bg-card text-foreground",
                    state === "next" && "border-dashed border-border text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                      state === "done" && "bg-primary text-primary-foreground",
                      state === "current" && "bg-primary text-primary-foreground",
                      state === "next" && "bg-muted text-muted-foreground",
                    )}
                  >
                    {state === "done" ? <Check className="size-3" /> : index + 1}
                  </span>
                  {step}
                </li>
              );
            })}
          </ol>
        </div>

        {!isAvailable && (
          <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            This item was just rented out and has no stock left. Please choose
            different gear.
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold text-foreground">Rental period</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Adjust dates or quantity before sending your request.
              </p>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Pick-up → Return
                  </Label>
                  <DateRangePicker
                    value={range}
                    onChange={booking.setRange}
                    disabled={booking.disabledDays}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Quantity (max {booking.maxQuantity})
                  </Label>
                  <QuantityStepper
                    value={quantity}
                    max={booking.maxQuantity}
                    onChange={booking.setQuantity}
                    disabled={!isAvailable}
                  />
                </div>
              </div>

              {days > 0 && range?.from && range.to && (
                <div className="mt-5 grid grid-cols-3 divide-x divide-border rounded-xl bg-muted/50 text-center">
                  <div className="p-3">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Pick-up</p>
                    <p className="text-sm font-semibold text-foreground">{format(range.from, "EEE, MMM d")}</p>
                  </div>
                  <div className="p-3">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Return</p>
                    <p className="text-sm font-semibold text-foreground">{format(range.to, "EEE, MMM d")}</p>
                  </div>
                  <div className="p-3">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Duration</p>
                    <p className="text-sm font-semibold text-foreground">
                      {days} day{days === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold text-foreground">Renter details</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3">
                  <User className="size-4 text-primary" />
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Name</p>
                    <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3">
                  <Mail className="size-4 text-primary" />
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Email</p>
                    <p className="truncate text-sm font-medium text-foreground">{user?.email}</p>
                  </div>
                </div>
              </div>

              <label
                htmlFor="agree"
                className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4"
              >
                <Checkbox
                  id="agree"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked === true)}
                  className="mt-0.5"
                />
                <span className="text-sm text-muted-foreground">
                  I&apos;ll collect and return the gear on the dates above and
                  keep it in the condition I received it. I understand damage or
                  late returns may be charged by the provider.
                </span>
              </label>
            </section>
          </div>

          <aside className="lg:col-span-5">
            <div className="space-y-4 lg:sticky lg:top-28">
              <section className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="flex gap-4 border-b border-border p-5">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <GearImage
                      src={gear.imageUrl}
                      alt={gear.name}
                      category={categoryName}
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {gear.brand || "Independent brand"}
                      {categoryName && ` · ${categoryName}`}
                    </p>
                    <p className="mt-1 line-clamp-2 font-semibold text-foreground">{gear.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatCurrency(gear.pricePerDay)} / day
                    </p>
                  </div>
                </div>

                <dl className="space-y-2.5 p-5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Daily rate</dt>
                    <dd className="text-foreground">{formatCurrency(gear.pricePerDay)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Rental days</dt>
                    <dd className="text-foreground">{days}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Quantity</dt>
                    <dd className="text-foreground">{quantity}</dd>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
                    <dt className="text-foreground">Total</dt>
                    <dd className="text-foreground">{formatCurrency(total)}</dd>
                  </div>
                </dl>

                <div className="space-y-3 border-t border-border bg-muted/30 p-5">
                  <p className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    Nothing is charged now. Once the provider confirms, you&apos;ll
                    see a Pay Now button in your dashboard.
                  </p>
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className="h-12 w-full rounded-xl text-sm"
                  >
                    {createRental.isPending ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Placing your request…
                      </>
                    ) : (
                      <>
                        <Lock />
                        Place rental request
                      </>
                    )}
                  </Button>
                  {!agreed && days > 0 && (
                    <p className="text-center text-xs text-muted-foreground">
                      Accept the rental terms to continue.
                    </p>
                  )}
                </div>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
