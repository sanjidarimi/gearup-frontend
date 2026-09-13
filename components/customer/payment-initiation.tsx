"use client";

import { GearImage } from "@/components/gears/gear-image";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateCheckout } from "@/hooks/payment/queries";
import { useRental } from "@/hooks/rental/queries";
import { getErrorMessage } from "@/lib/api-client";
import { formatCurrency, formatDay, rentalDays, shortId } from "@/lib/format";
import { orderTitle } from "@/lib/rental";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Hourglass,
  Loader2,
  Lock,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import Link from "next/link";

const METHODS = [
  {
    id: "stripe",
    name: "Stripe Checkout",
    description: "Visa, Mastercard, Amex and more. Opens Stripe's secure page.",
    available: true,
  },
  {
    id: "sslcommerz",
    name: "SSLCommerz",
    description: "bKash, Nagad and local cards. Coming soon.",
    available: false,
  },
];

export function PaymentInitiation({ orderId }: { orderId: string }) {
  const { data: order, isLoading, isError, error, refetch } = useRental(orderId);
  const checkout = useCreateCheckout();
  const backHref = `/dashboard/customer/orders/${orderId}`;

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-5">
        <Skeleton className="h-80 rounded-2xl lg:col-span-3" />
        <Skeleton className="h-80 rounded-2xl lg:col-span-2" />
      </div>
    );
  }

  if (isError || !order) {
    return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;
  }

  if (order.status !== "CONFIRMED") {
    const state =
      order.status === "PLACED"
        ? {
            icon: Hourglass,
            title: "Waiting for the provider",
            description:
              "You can pay as soon as the provider confirms this booking. We'll show the Pay Now button on your order.",
          }
        : order.status === "CANCELLED"
          ? {
              icon: XCircle,
              title: "This order was cancelled",
              description: "There's nothing to pay for this rental.",
            }
          : {
              icon: CheckCircle2,
              title: "This order is already paid",
              description: "Thanks! You can track pickup and return from your order page.",
            };

    return (
      <EmptyState
        icon={state.icon}
        title={state.title}
        description={state.description}
        action={
          <Button asChild size="lg">
            <Link href={backHref}>View order</Link>
          </Button>
        }
      />
    );
  }

  const days = rentalDays(order.startDate, order.endDate);
  const firstGear = order.items[0]?.gearItem;
  const isRedirecting = checkout.isPending || checkout.isSuccess;

  return (
    <div className="space-y-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to order
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Complete your payment
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Order {shortId(order.id)} was confirmed by the provider. Pay now to
          secure your gear.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="space-y-4 rounded-2xl border border-border bg-card p-6 lg:col-span-3">
          <h2 className="font-semibold text-foreground">Payment method</h2>
          <div className="space-y-3">
            {METHODS.map((method) => (
              <div
                key={method.id}
                aria-disabled={!method.available}
                className={cn(
                  "flex items-start gap-4 rounded-xl border p-4",
                  method.available
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border opacity-60",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-5 items-center justify-center rounded-full border-2",
                    method.available ? "border-primary" : "border-muted-foreground/40",
                  )}
                >
                  {method.available && <span className="size-2.5 rounded-full bg-primary" />}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{method.name}</p>
                  <p className="text-xs text-muted-foreground">{method.description}</p>
                </div>
                <CreditCard className="size-5 text-muted-foreground" />
              </div>
            ))}
          </div>

          <ul className="space-y-2 rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Lock className="size-4 text-primary" />
              Card details are entered on Stripe, never on GearUp.
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              You&apos;ll come straight back here once payment is done.
            </li>
          </ul>
        </section>

        <aside className="lg:col-span-2">
          <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex gap-4 border-b border-border p-5">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                <GearImage
                  src={firstGear?.imageUrl}
                  alt={firstGear?.name ?? "Gear"}
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="line-clamp-2 font-semibold text-foreground">
                  {orderTitle(order)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDay(order.startDate, "MMM d")} –{" "}
                  {formatDay(order.endDate, "MMM d, yyyy")} · {days} day
                  {days === 1 ? "" : "s"}
                </p>
              </div>
            </div>
            <dl className="space-y-2.5 p-5 text-sm">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between gap-3">
                  <dt className="truncate text-muted-foreground">
                    {item.gearItem?.name ?? "Gear"} × {item.quantity}
                  </dt>
                  <dd className="text-foreground">
                    {formatCurrency(item.price * item.quantity * days)}
                  </dd>
                </div>
              ))}
              <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
                <dt className="text-foreground">Amount due</dt>
                <dd className="text-foreground">{formatCurrency(order.totalAmount)}</dd>
              </div>
            </dl>
            <div className="border-t border-border p-5">
              <Button
                className="h-12 w-full rounded-xl text-sm"
                disabled={isRedirecting}
                onClick={() => checkout.mutate(order.id)}
              >
                {isRedirecting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Redirecting to Stripe…
                  </>
                ) : (
                  <>
                    <Lock />
                    Pay {formatCurrency(order.totalAmount)} with Stripe
                  </>
                )}
              </Button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
