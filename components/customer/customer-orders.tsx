"use client";

import { TableSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { RentalStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyRentals } from "@/hooks/rental/queries";
import { useReviewedGearIds } from "@/hooks/review/queries";
import { getErrorMessage } from "@/lib/api-client";
import {
  formatCurrency,
  formatDate,
  formatDay,
  rentalDays,
  shortId,
} from "@/lib/format";
import type { RentalOrder } from "@/types/rental";
import { Compass, PackageOpen } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CustomerOrderActions, OrderGearCell } from "./order-bits";

const FILTERS: {
  value: string;
  label: string;
  match: (order: RentalOrder) => boolean;
}[] = [
  { value: "all", label: "All", match: () => true },
  {
    value: "active",
    label: "Active",
    match: (order) => ["PLACED", "PAID", "PICKED_UP"].includes(order.status),
  },
  {
    value: "payment",
    label: "Awaiting payment",
    match: (order) => order.status === "CONFIRMED",
  },
  {
    value: "completed",
    label: "Completed",
    match: (order) => order.status === "RETURNED",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    match: (order) => order.status === "CANCELLED",
  },
];

export function CustomerOrders() {
  const [filter, setFilter] = useState("all");
  const { data, isLoading, isError, error, refetch } = useMyRentals();
  const reviewed = useReviewedGearIds();

  const orders = data ?? [];
  const activeFilter = FILTERS.find((item) => item.value === filter) ?? FILTERS[0];
  const visible = orders.filter(activeFilter.match);

  return (
    <>
      <PageHeader
        title="My rentals"
        description="Every booking you've made, with live status from the provider."
        actions={
          <Button asChild size="lg">
            <Link href="/gear">
              <Compass />
              Rent more gear
            </Link>
          </Button>
        }
      />

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="h-auto flex-wrap">
          {FILTERS.map((item) => (
            <TabsTrigger key={item.value} value={item.value} className="gap-1.5 px-3 text-xs">
              {item.label}
              <span className="rounded-full bg-muted px-1.5 text-[10px] text-muted-foreground">
                {orders.filter(item.match).length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <TableSkeleton />
      ) : isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title={filter === "all" ? "You haven't rented anything yet" : "Nothing here"}
          description={
            filter === "all"
              ? "Browse the catalog, pick your dates and your rentals will appear here."
              : "No rentals match this status right now."
          }
          action={
            filter === "all" ? (
              <Button asChild size="lg">
                <Link href="/gear">Explore gear</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-border bg-card md:block">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="px-4">Gear</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Rental dates</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="px-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((order) => {
                  const days = rentalDays(order.startDate, order.endDate);
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="max-w-64 px-4 py-3">
                        <OrderGearCell order={order} />
                      </TableCell>
                      <TableCell>
                        <p className="font-mono text-xs font-semibold text-foreground">
                          {shortId(order.id)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-foreground">
                          {formatDay(order.startDate, "MMM d")} –{" "}
                          {formatDay(order.endDate, "MMM d, yyyy")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {days} day{days === 1 ? "" : "s"}
                        </p>
                      </TableCell>
                      <TableCell className="text-right text-sm font-semibold text-foreground">
                        {formatCurrency(order.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <RentalStatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="px-4">
                        <CustomerOrderActions order={order} reviewedGearIds={reviewed.ids} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <ul className="space-y-3 md:hidden">
            {visible.map((order) => (
              <li key={order.id} className="space-y-3 rounded-2xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <OrderGearCell order={order} />
                  <RentalStatusBadge status={order.status} />
                </div>
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted/40 p-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Dates</p>
                    <p className="font-medium text-foreground">
                      {formatDay(order.startDate, "MMM d")} – {formatDay(order.endDate, "MMM d")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">Total</p>
                    <p className="font-semibold text-foreground">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                </div>
                <CustomerOrderActions order={order} reviewedGearIds={reviewed.ids} />
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
