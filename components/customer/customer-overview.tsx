"use client";

import { useSession } from "@/components/session-provider";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import {
  PaymentStatusBadge,
  RentalStatusBadge,
} from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { useMyPayments } from "@/hooks/payment/queries";
import { useMyRentals } from "@/hooks/rental/queries";
import { useReviewedGearIds } from "@/hooks/review/queries";
import { getErrorMessage } from "@/lib/api-client";
import { RENTAL_STATUS_META } from "@/lib/constants";
import { formatCurrency, formatDate, formatDay } from "@/lib/format";
import { needsReview } from "@/lib/rental";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  CreditCard,
  Hourglass,
  PackageOpen,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { CustomerOrderActions, OrderGearCell } from "./order-bits";

export function CustomerOverview() {
  const user = useSession();
  const rentals = useMyRentals();
  const payments = useMyPayments();
  const reviewed = useReviewedGearIds();

  const orders = rentals.data ?? [];
  const activeCount = orders.filter((order) =>
    ["PLACED", "PAID", "PICKED_UP"].includes(order.status),
  ).length;
  const awaitingPayment = orders.filter((order) => order.status === "CONFIRMED");
  const completedCount = orders.filter((order) => order.status === "RETURNED").length;
  const totalSpent = (payments.data ?? [])
    .filter((payment) => payment.status === "COMPLETED")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const attention = orders.filter(
    (order) =>
      order.status === "CONFIRMED" || needsReview(order, reviewed.ids),
  );

  const firstName = user?.name.split(" ")[0] ?? "there";

  return (
    <>
      <PageHeader
        title={`Hi ${firstName}, ready for the next trip?`}
        description="Track your rentals, pay for confirmed bookings and review gear you've returned."
        actions={
          <Button asChild size="lg">
            <Link href="/gear">
              <Compass />
              Browse gear
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active rentals"
          value={activeCount}
          icon={PackageOpen}
          tone="emerald"
          hint="Placed, paid or currently with you"
          loading={rentals.isLoading}
        />
        <StatCard
          label="Awaiting payment"
          value={awaitingPayment.length}
          icon={Hourglass}
          tone="blue"
          hint="Confirmed by the provider"
          loading={rentals.isLoading}
        />
        <StatCard
          label="Completed"
          value={completedCount}
          icon={CheckCircle2}
          tone="violet"
          hint="Returned rentals"
          loading={rentals.isLoading}
        />
        <StatCard
          label="Total spent"
          value={formatCurrency(totalSpent)}
          icon={Wallet}
          tone="amber"
          hint="Completed payments"
          loading={payments.isLoading}
        />
      </div>

      {attention.length > 0 && (
        <section className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
          <h2 className="text-sm font-semibold text-foreground">
            Needs your attention
          </h2>
          <ul className="mt-3 divide-y divide-primary/15">
            {attention.slice(0, 4).map((order) => (
              <li
                key={order.id}
                className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <OrderGearCell order={order} />
                  <p className="text-xs text-muted-foreground sm:pl-14">
                    {order.status === "CONFIRMED"
                      ? `Confirmed · pay ${formatCurrency(order.totalAmount)} to lock in your booking`
                      : "Returned · tell others how it went"}
                  </p>
                </div>
                <CustomerOrderActions
                  order={order}
                  reviewedGearIds={reviewed.ids}
                  showDetails={false}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="space-y-3 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Recent rentals
            </h2>
            <Link
              href="/dashboard/customer/orders"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all <ArrowRight className="size-4" />
            </Link>
          </div>

          {rentals.isLoading ? (
            <TableSkeleton rows={4} />
          ) : rentals.isError ? (
            <ErrorState
              message={getErrorMessage(rentals.error)}
              onRetry={() => rentals.refetch()}
            />
          ) : orders.length === 0 ? (
            <EmptyState
              icon={PackageOpen}
              title="No rentals yet"
              description="Find something for your next adventure and your bookings will show up here."
              action={
                <Button asChild size="lg">
                  <Link href="/gear">Explore gear</Link>
                </Button>
              }
            />
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {orders.slice(0, 5).map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/dashboard/customer/orders/${order.id}`}
                    className="flex flex-col gap-3 px-4 py-3.5 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <OrderGearCell order={order} />
                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <span className="text-xs text-muted-foreground">
                        {formatDay(order.startDate, "MMM d")} –{" "}
                        {formatDay(order.endDate, "MMM d")}
                      </span>
                      <span className="w-20 text-right text-sm font-semibold text-foreground">
                        {formatCurrency(order.totalAmount)}
                      </span>
                      <RentalStatusBadge status={order.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Payments</h2>
            <Link
              href="/dashboard/customer/payments"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              History <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-card">
            {payments.isLoading ? (
              <div className="p-4">
                <TableSkeleton rows={3} />
              </div>
            ) : (payments.data ?? []).length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
                <CreditCard className="size-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No payments yet. Pay Now appears once a provider confirms.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {(payments.data ?? []).slice(0, 5).map((payment) => (
                  <li
                    key={payment.id}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {formatCurrency(payment.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(payment.paidAt ?? payment.createdAt)}
                      </p>
                    </div>
                    <PaymentStatusBadge status={payment.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {awaitingPayment[0] && (
            <p className="rounded-xl bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
              {RENTAL_STATUS_META.CONFIRMED.hint}
            </p>
          )}
        </section>
      </div>
    </>
  );
}
