"use client";

import { OrderGearCell } from "@/components/customer/order-bits";
import { TableSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { GearImage } from "@/components/gears/gear-image";
import { useSession } from "@/components/session-provider";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import {
  useProviderGear,
  useProviderOrders,
  useUpdateOrderStatus,
} from "@/hooks/provider/queries";
import { getErrorMessage } from "@/lib/api-client";
import { formatCurrency, formatDay, formatRelative } from "@/lib/format";
import {
  ArrowRight,
  Boxes,
  ClipboardList,
  DollarSign,
  Inbox,
  PackageCheck,
  Plus,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { OrderStatusActions } from "./order-status-actions";

export function ProviderOverview() {
  const user = useSession();
  const gear = useProviderGear();
  const orders = useProviderOrders();
  const updateStatus = useUpdateOrderStatus();

  const items = gear.data ?? [];
  const list = orders.data ?? [];
  const pending = list.filter((order) => order.status === "PLACED");
  const active = list.filter((order) =>
    ["CONFIRMED", "PAID", "PICKED_UP"].includes(order.status),
  );
  const revenue = list
    .filter((order) => ["PAID", "PICKED_UP", "RETURNED"].includes(order.status))
    .reduce((sum, order) => sum + order.totalAmount, 0);
  const attentionGear = items
    .filter((item) => item.stock <= 1 || !item.isAvailable)
    .slice(0, 5);

  const updatingId = updateStatus.isPending ? updateStatus.variables?.id : undefined;
  const firstName = user?.name.split(" ")[0] ?? "there";

  return (
    <>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Here's what's happening in your rental shop today."
        actions={
          <>
            <Button asChild variant="outline" size="lg" className="h-10 px-4">
              <Link href="/dashboard/provider/orders">
                <ClipboardList />
                Manage orders
              </Link>
            </Button>
            <Button asChild size="lg" className="h-10 px-4">
              <Link href="/dashboard/provider/gear/new">
                <Plus />
                Add gear
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total gear listed"
          value={items.length}
          icon={Boxes}
          hint={`${items.filter((item) => item.isAvailable && item.stock > 0).length} live right now`}
          loading={gear.isLoading}
        />
        <StatCard
          label="Active rentals"
          value={active.length}
          icon={PackageCheck}
          tone="emerald"
          hint="Confirmed, paid or picked up"
          loading={orders.isLoading}
        />
        <StatCard
          label="Pending orders"
          value={pending.length}
          icon={Inbox}
          tone="amber"
          hint="Waiting for your confirmation"
          loading={orders.isLoading}
        />
        <StatCard
          label="Revenue"
          value={formatCurrency(revenue)}
          icon={DollarSign}
          tone="violet"
          hint="From paid and completed rentals"
          loading={orders.isLoading}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="space-y-3 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">New requests</h2>
            <Link
              href="/dashboard/provider/orders"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              All orders <ArrowRight className="size-4" />
            </Link>
          </div>

          {orders.isLoading ? (
            <TableSkeleton rows={3} />
          ) : orders.isError ? (
            <ErrorState message={getErrorMessage(orders.error)} onRetry={() => orders.refetch()} />
          ) : pending.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="You're all caught up"
              description="New rental requests will appear here so you can confirm them quickly."
              className="py-10"
            />
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {pending.slice(0, 5).map((order) => (
                <li
                  key={order.id}
                  className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0 space-y-1">
                    <OrderGearCell order={order} />
                    <p className="text-xs text-muted-foreground md:pl-14">
                      {order.customer?.name} · {formatDay(order.startDate, "MMM d")} –{" "}
                      {formatDay(order.endDate, "MMM d")} · {formatCurrency(order.totalAmount)} ·{" "}
                      {formatRelative(order.createdAt)}
                    </p>
                  </div>
                  <OrderStatusActions
                    order={order}
                    isUpdating={updatingId === order.id}
                    onUpdate={(status) =>
                      updateStatus
                        .mutateAsync({ id: order.id, status })
                        .catch(() => undefined)
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Needs restocking</h2>
            <Link
              href="/dashboard/provider/gear"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Inventory <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="rounded-2xl border border-border bg-card">
            {gear.isLoading ? (
              <div className="p-4">
                <TableSkeleton rows={3} />
              </div>
            ) : attentionGear.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
                <PackageCheck className="size-6 text-emerald-500" />
                <p className="text-sm text-muted-foreground">
                  {items.length === 0
                    ? "No gear listed yet."
                    : "Every listing is live and well stocked."}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {attentionGear.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/dashboard/provider/gear/${item.id}/edit`}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
                    >
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <GearImage src={item.imageUrl} alt={item.name} sizes="40px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                        <p className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                          <TriangleAlert className="size-3" />
                          {item.stock === 0
                            ? "Out of stock"
                            : !item.isAvailable
                              ? "Paused"
                              : `${item.stock} unit left`}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
