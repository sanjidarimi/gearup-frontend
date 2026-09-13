"use client";

import { GearImage } from "@/components/gears/gear-image";
import { OrderTimeline } from "@/components/rental/order-timeline";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import {
  PaymentStatusBadge,
  RentalStatusBadge,
} from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRental } from "@/hooks/rental/queries";
import { useReviewedGearIds } from "@/hooks/review/queries";
import { ApiError, getErrorMessage } from "@/lib/api-client";
import { RENTAL_STATUS_META } from "@/lib/constants";
import {
  formatCurrency,
  formatDate,
  formatDay,
  rentalDays,
  shortId,
} from "@/lib/format";
import { needsReview } from "@/lib/rental";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  PackageX,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ReviewDialog } from "./review-dialog";

export function OrderDetails({ orderId }: { orderId: string }) {
  const searchParams = useSearchParams();
  const justPlaced = searchParams.get("placed") === "1";
  const { data: order, isLoading, isError, error, refetch } = useRental(orderId);
  const reviewed = useReviewedGearIds();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    const notFound = error instanceof ApiError && [403, 404].includes(error.status);
    return notFound ? (
      <EmptyState
        icon={PackageX}
        title="Order not found"
        description="This rental doesn't exist or belongs to another account."
        action={
          <Button asChild size="lg">
            <Link href="/dashboard/customer/orders">Back to my rentals</Link>
          </Button>
        }
      />
    ) : (
      <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
    );
  }

  const days = rentalDays(order.startDate, order.endDate);

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/customer/orders"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All rentals
      </Link>

      {justPlaced && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-semibold">Your rental request was sent!</p>
            <p className="mt-0.5">
              The provider will review it shortly. We&apos;ll show a Pay Now
              button here as soon as it&apos;s confirmed.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Order {shortId(order.id)}
            </h1>
            <RentalStatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed {formatDate(order.createdAt, "MMM d, yyyy 'at' h:mm a")} ·
            Last update {formatDate(order.updatedAt, "MMM d, h:mm a")}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {order.status === "CONFIRMED" && (
            <Button asChild size="lg" className="h-10 px-4">
              <Link href={`/dashboard/customer/orders/${order.id}/pay`}>
                <CreditCard />
                Pay {formatCurrency(order.totalAmount)}
              </Link>
            </Button>
          )}
          {needsReview(order, reviewed.ids) && (
            <ReviewDialog
              order={order}
              reviewedGearIds={reviewed.ids}
              trigger={
                <Button size="lg" variant="secondary" className="h-10 px-4">
                  <Star />
                  Leave review
                </Button>
              }
            />
          )}
        </div>
      </div>

      <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <OrderTimeline status={order.status} />
        <p className="text-sm text-muted-foreground">
          {RENTAL_STATUS_META[order.status].hint}
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-card lg:col-span-2">
          <h2 className="border-b border-border px-6 py-4 font-semibold text-foreground">
            Items
          </h2>
          <ul className="divide-y divide-border">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 px-6 py-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <GearImage
                    src={item.gearItem?.imageUrl}
                    alt={item.gearItem?.name ?? "Gear"}
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/gear/${item.gearItemId}`}
                    className="line-clamp-1 font-semibold text-foreground hover:text-primary"
                  >
                    {item.gearItem?.name ?? "Gear item"}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {item.gearItem?.brand ?? "Independent brand"} · Qty{" "}
                    {item.quantity} · {formatCurrency(item.price)}/day
                  </p>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(item.price * item.quantity * days)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold text-foreground">Summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-start justify-between gap-3">
                <dt className="flex items-center gap-1.5 text-muted-foreground">
                  <CalendarDays className="size-4" /> Dates
                </dt>
                <dd className="text-right font-medium text-foreground">
                  {formatDay(order.startDate)}
                  <br />
                  to {formatDay(order.endDate)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Duration</dt>
                <dd className="text-foreground">
                  {days} day{days === 1 ? "" : "s"}
                </dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
                <dt className="text-foreground">Total</dt>
                <dd className="text-foreground">
                  {formatCurrency(order.totalAmount)}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold text-foreground">Payment</h2>
            {order.payment ? (
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd>
                    <PaymentStatusBadge status={order.payment.status} />
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Amount</dt>
                  <dd className="text-foreground">
                    {formatCurrency(order.payment.amount)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Paid</dt>
                  <dd className="text-foreground">
                    {order.payment.paidAt ? formatDate(order.payment.paidAt) : "—"}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                {order.status === "PLACED"
                  ? "Payment opens once the provider confirms your request."
                  : order.status === "CONFIRMED"
                    ? "Ready for payment."
                    : "No payment recorded for this order."}
              </p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
