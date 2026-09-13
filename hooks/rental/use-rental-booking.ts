"use client";

import { useSession } from "@/components/session-provider";
import { ACTIVE_RENTAL_STATUSES } from "@/lib/constants";
import { parseDateParam, toLocalDay } from "@/lib/format";
import type { Gear } from "@/types/gear";
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  startOfToday,
} from "date-fns";
import { useMemo, useState } from "react";
import type { DateRange, Matcher } from "react-day-picker";
import { useMyRentals } from "./queries";

interface BookingDefaults {
  from?: string;
  to?: string;
  quantity?: number;
}

// Shared by the gear details card and the checkout page so both enforce the
// same rules: no past dates, no overlaps with the customer's own active
// bookings of this item, and quantity capped at available stock.
export function useRentalBooking(gear: Gear, defaults: BookingDefaults = {}) {
  const user = useSession();
  const isCustomer = user?.role === "CUSTOMER";
  const isAvailable = gear.isAvailable && gear.stock > 0;
  const maxQuantity = Math.max(1, gear.stock);

  const [range, setRange] = useState<DateRange | undefined>(() => {
    const today = startOfToday();
    const from = parseDateParam(defaults.from);
    const to = parseDateParam(defaults.to);
    return from && to && from >= today && to > from ? { from, to } : undefined;
  });

  const [quantity, setQuantityState] = useState(() =>
    Math.min(Math.max(1, Math.floor(defaults.quantity ?? 1)), maxQuantity),
  );

  const setQuantity = (value: number) =>
    setQuantityState(Math.min(Math.max(1, value), maxQuantity));

  const { data: myRentals } = useMyRentals({ enabled: isCustomer });

  const bookedRanges = useMemo(
    () =>
      (myRentals ?? [])
        .filter(
          (order) =>
            ACTIVE_RENTAL_STATUSES.includes(order.status) &&
            order.items.some((item) => item.gearItemId === gear.id),
        )
        .flatMap((order) => {
          const from = toLocalDay(order.startDate);
          const to = toLocalDay(order.endDate);
          return from && to ? [{ from, to: addDays(to, -1) }] : [];
        }),
    [myRentals, gear.id],
  );

  const disabledDays = useMemo<Matcher[]>(() => {
    const today = startOfToday();
    return [{ before: today }, { after: addMonths(today, 6) }, ...bookedRanges];
  }, [bookedRanges]);

  const days =
    range?.from && range?.to
      ? Math.max(0, differenceInCalendarDays(range.to, range.from))
      : 0;

  return {
    user,
    isCustomer,
    isAvailable,
    range,
    setRange,
    quantity,
    setQuantity,
    maxQuantity,
    days,
    total: days * quantity * gear.pricePerDay,
    disabledDays,
    hasBookedDates: bookedRanges.length > 0,
  };
}
