import {
  format,
  formatDistanceToNow,
  isValid,
  parse,
  parseISO,
} from "date-fns";

const DAY_IN_MS = 86_400_000;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatCurrency(value: number | null | undefined) {
  return currencyFormatter.format(Number(value ?? 0));
}

export function toDate(value: string | Date | null | undefined) {
  if (!value) return null;
  const date = typeof value === "string" ? parseISO(value) : value;
  return isValid(date) ? date : null;
}

export function formatDate(
  value: string | Date | null | undefined,
  pattern = "MMM d, yyyy",
) {
  const date = toDate(value);
  return date ? format(date, pattern) : "—";
}

export function formatRelative(value: string | Date | null | undefined) {
  const date = toDate(value);
  return date ? formatDistanceToNow(date, { addSuffix: true }) : "—";
}

// Rental dates are stored as UTC midnight. Reading the UTC parts keeps the
// calendar day stable for people west of UTC too.
export function toLocalDay(value: string | Date | null | undefined) {
  const date = toDate(value);
  if (!date) return null;
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function formatDay(
  value: string | Date | null | undefined,
  pattern = "MMM d, yyyy",
) {
  const day = toLocalDay(value);
  return day ? format(day, pattern) : "—";
}

// Mirrors the backend calculation so the price we show matches the order total.
export function rentalDays(
  start: string | Date | null | undefined,
  end: string | Date | null | undefined,
) {
  const startDate = toDate(start);
  const endDate = toDate(end);
  if (!startDate || !endDate) return 0;
  return Math.max(
    0,
    Math.ceil((endDate.getTime() - startDate.getTime()) / DAY_IN_MS),
  );
}

// Calendar picks are local dates; sending them as UTC midnight avoids DST drift.
export function toUtcDateString(date: Date) {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  ).toISOString();
}

// Dates travel through the URL as yyyy-MM-dd so links stay readable.
export function toDateParam(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function parseDateParam(value?: string | null) {
  if (!value) return undefined;
  const date = parse(value, "yyyy-MM-dd", new Date());
  return isValid(date) ? date : undefined;
}

export function shortId(id: string) {
  return `#${id.slice(0, 8).toUpperCase()}`;
}

export function initials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
