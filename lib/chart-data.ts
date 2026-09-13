import { format, startOfMonth, subMonths } from "date-fns";
import { toDate } from "./format";

export interface MonthlyPoint {
  key: string;
  label: string;
  value: number;
}

// Buckets items into the last `months` calendar months (oldest first), so a
// quiet month still shows up as a zero instead of disappearing from the axis.
export function monthlyTotals<T>(
  items: T[],
  getDate: (item: T) => string | null | undefined,
  getValue: (item: T) => number = () => 1,
  months = 6,
): MonthlyPoint[] {
  const currentMonth = startOfMonth(new Date());
  const buckets = Array.from({ length: months }, (_, index) => {
    const month = subMonths(currentMonth, months - 1 - index);
    return { key: format(month, "yyyy-MM"), label: format(month, "MMM"), value: 0 };
  });
  const byKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  for (const item of items) {
    const date = toDate(getDate(item));
    if (!date) continue;
    const bucket = byKey.get(format(date, "yyyy-MM"));
    if (bucket) bucket.value += getValue(item);
  }

  return buckets;
}

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function compactCurrency(value: number) {
  return compactCurrencyFormatter.format(value);
}
