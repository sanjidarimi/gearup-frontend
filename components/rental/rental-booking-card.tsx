"use client";

import { DateRangePicker } from "@/components/shared/date-range-picker";
import { AvailabilityBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRentalBooking } from "@/hooks/rental/use-rental-booking";
import { formatCurrency, toDateParam } from "@/lib/format";
import type { Gear } from "@/types/gear";
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Info,
  LogIn,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { QuantityStepper } from "./quantity-stepper";

interface RentalBookingCardProps {
  gear: Gear;
  initialFrom?: string;
  initialTo?: string;
}

export function RentalBookingCard({
  gear,
  initialFrom,
  initialTo,
}: RentalBookingCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const booking = useRentalBooking(gear, { from: initialFrom, to: initialTo });
  const { user, isCustomer, isAvailable, range, days, quantity } = booking;

  const dateQuery =
    range?.from && range?.to
      ? `from=${toDateParam(range.from)}&to=${toDateParam(range.to)}`
      : "";
  const loginHref = `/auth/login?redirect=${encodeURIComponent(
    dateQuery ? `${pathname}?${dateQuery}` : pathname,
  )}`;

  const handleContinue = () => {
    if (!range?.from || !range?.to || days < 1) {
      toast.error("Choose your rental dates", {
        description: "Pick a pick-up day and a return day to continue.",
      });
      return;
    }
    router.push(`/checkout/${gear.id}?${dateQuery}&qty=${quantity}`);
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-black/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-3xl font-extrabold text-foreground">
            {formatCurrency(gear.pricePerDay)}
            <span className="text-sm font-medium text-muted-foreground">
              {" "}
              / day
            </span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {isAvailable
              ? `${gear.stock} unit${gear.stock === 1 ? "" : "s"} ready to rent`
              : "All units are currently rented out"}
          </p>
        </div>
        <AvailabilityBadge available={isAvailable} />
      </div>

      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Rental dates
          </Label>
          <DateRangePicker
            value={range}
            onChange={booking.setRange}
            disabled={booking.disabledDays}
            placeholder="Pick-up → Return"
          />
          {booking.hasBookedDates && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Info className="size-3.5" />
              Dates you already have booked for this item are blocked.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Quantity
          </Label>
          <QuantityStepper
            value={quantity}
            max={booking.maxQuantity}
            onChange={booking.setQuantity}
            disabled={!isAvailable}
          />
        </div>
      </div>

      <dl className="mt-6 space-y-2 rounded-2xl bg-muted/50 p-4 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <dt>
            {formatCurrency(gear.pricePerDay)} × {days} day{days === 1 ? "" : "s"}
            {quantity > 1 && ` × ${quantity}`}
          </dt>
          <dd>{formatCurrency(booking.total)}</dd>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <dt>Service fee</dt>
          <dd>{formatCurrency(0)}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-2 text-base font-bold text-foreground">
          <dt>Total</dt>
          <dd>{formatCurrency(booking.total)}</dd>
        </div>
      </dl>

      <div className="mt-6">
        {!isAvailable ? (
          <Button disabled className="h-12 w-full rounded-xl text-sm">
            Currently unavailable
          </Button>
        ) : !user ? (
          <Button asChild className="h-12 w-full rounded-xl text-sm">
            <Link href={loginHref}>
              <LogIn />
              Sign in to rent
            </Link>
          </Button>
        ) : !isCustomer ? (
          <div className="rounded-xl border border-border bg-muted/40 p-4 text-center text-sm text-muted-foreground">
            You&apos;re signed in as a {user.role.toLowerCase()}. Use a customer
            account to rent gear.
          </div>
        ) : (
          <Button
            onClick={handleContinue}
            className="h-12 w-full rounded-xl text-sm shadow-lg shadow-primary/20"
          >
            {days > 0 ? "Rent now" : "Choose dates to continue"}
            <ArrowRight />
          </Button>
        )}
      </div>

      <ul className="mt-6 space-y-2.5 text-xs text-muted-foreground">
        <li className="flex items-center gap-2">
          <BadgeCheck className="size-4 text-primary" />
          You won&apos;t be charged until the provider confirms
        </li>
        <li className="flex items-center gap-2">
          <CreditCard className="size-4 text-primary" />
          Secure card payment through Stripe Checkout
        </li>
        <li className="flex items-center gap-2">
          <MapPin className="size-4 text-primary" />
          Pick up and return at the provider&apos;s shop
        </li>
      </ul>
    </div>
  );
}
