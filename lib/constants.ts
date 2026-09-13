import type { UserRole } from "@/types/auth";
import type { PaymentStatus } from "@/types/payment";
import type { RentalStatus } from "@/types/rental";

export const ROLE_HOME: Record<UserRole, string> = {
  CUSTOMER: "/dashboard/customer",
  PROVIDER: "/dashboard/provider",
  ADMIN: "/dashboard/admin",
};

export const ROLE_LABEL: Record<UserRole, string> = {
  CUSTOMER: "Customer",
  PROVIDER: "Provider",
  ADMIN: "Admin",
};

interface StatusMeta {
  label: string;
  className: string;
  dot: string;
  hint: string;
}

export const RENTAL_STATUS_META: Record<RentalStatus, StatusMeta> = {
  PLACED: {
    label: "Placed",
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
    hint: "Waiting for the provider to confirm your request.",
  },
  CONFIRMED: {
    label: "Confirmed",
    className:
      "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
    hint: "The provider confirmed the booking. Complete payment to lock it in.",
  },
  PAID: {
    label: "Paid",
    className:
      "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-400",
    dot: "bg-violet-500",
    hint: "Payment received. The gear is being prepared for pickup.",
  },
  PICKED_UP: {
    label: "Picked up",
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
    hint: "The gear is out with the customer. Enjoy the adventure!",
  },
  RETURNED: {
    label: "Returned",
    className:
      "border-zinc-500/30 bg-zinc-500/10 text-zinc-700 dark:text-zinc-300",
    dot: "bg-zinc-500",
    hint: "Gear returned and the rental is complete.",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400",
    dot: "bg-red-500",
    hint: "This rental was cancelled.",
  },
};

export const RENTAL_FLOW: RentalStatus[] = [
  "PLACED",
  "CONFIRMED",
  "PAID",
  "PICKED_UP",
  "RETURNED",
];

export const ACTIVE_RENTAL_STATUSES: RentalStatus[] = [
  "PLACED",
  "CONFIRMED",
  "PAID",
  "PICKED_UP",
];

export const PROVIDER_ACTIONS: Partial<
  Record<RentalStatus, { label: string; next: RentalStatus }>
> = {
  PLACED: { label: "Confirm", next: "CONFIRMED" },
  PAID: { label: "Mark Picked Up", next: "PICKED_UP" },
  PICKED_UP: { label: "Mark Returned", next: "RETURNED" },
};

export const PAYMENT_STATUS_META: Record<
  PaymentStatus,
  Pick<StatusMeta, "label" | "className">
> = {
  PENDING: {
    label: "Pending",
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  COMPLETED: {
    label: "Completed",
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  FAILED: {
    label: "Failed",
    className: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400",
  },
};
