import { PAYMENT_STATUS_META, RENTAL_STATUS_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { UserStatus } from "@/types/auth";
import type { PaymentStatus } from "@/types/payment";
import type { RentalStatus } from "@/types/rental";

const baseClass =
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold";

export function RentalStatusBadge({
  status,
  className,
}: {
  status: RentalStatus;
  className?: string;
}) {
  const meta = RENTAL_STATUS_META[status] ?? RENTAL_STATUS_META.PLACED;

  return (
    <span className={cn(baseClass, meta.className, className)}>
      <span className={cn("size-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}

export function PaymentStatusBadge({
  status,
  className,
}: {
  status: PaymentStatus;
  className?: string;
}) {
  const meta = PAYMENT_STATUS_META[status] ?? PAYMENT_STATUS_META.PENDING;

  return <span className={cn(baseClass, meta.className, className)}>{meta.label}</span>;
}

export function UserStatusBadge({
  status,
  className,
}: {
  status: UserStatus;
  className?: string;
}) {
  const isActive = status === "ACTIVE";

  return (
    <span
      className={cn(
        baseClass,
        isActive
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          : "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          isActive ? "bg-emerald-500" : "bg-red-500",
        )}
      />
      {isActive ? "Active" : "Suspended"}
    </span>
  );
}

export function AvailabilityBadge({
  available,
  className,
}: {
  available: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        baseClass,
        available
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          : "border-zinc-500/30 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          available ? "bg-emerald-500" : "bg-zinc-400",
        )}
      />
      {available ? "Available" : "Unavailable"}
    </span>
  );
}
