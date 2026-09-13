"use client";

import { OrderGearCell } from "@/components/customer/order-bits";
import { TableSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { PaginationControls } from "@/components/shared/pagination-controls";
import {
  PaymentStatusBadge,
  RentalStatusBadge,
} from "@/components/shared/status-badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useProviderOrders,
  useUpdateOrderStatus,
} from "@/hooks/provider/queries";
import { getErrorMessage } from "@/lib/api-client";
import {
  formatCurrency,
  formatDate,
  formatDay,
  rentalDays,
  shortId,
} from "@/lib/format";
import type { RentalOrder, RentalStatus } from "@/types/rental";
import { ClipboardList, Search } from "lucide-react";
import { useState } from "react";
import { OrderStatusActions } from "./order-status-actions";

type TabValue = "ALL" | RentalStatus;

const TABS: { value: TabValue; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PLACED", label: "New requests" },
  { value: "CONFIRMED", label: "Awaiting payment" },
  { value: "PAID", label: "Ready for pickup" },
  { value: "PICKED_UP", label: "Out on rent" },
  { value: "RETURNED", label: "Returned" },
  { value: "CANCELLED", label: "Cancelled" },
];

const PAGE_SIZE = 10;

function matchesSearch(order: RentalOrder, term: string) {
  if (!term) return true;
  return [
    order.id,
    order.customer?.name,
    order.customer?.email,
    ...order.items.map((item) => item.gearItem?.name),
  ].some((value) => value?.toLowerCase().includes(term));
}

export function ProviderOrders() {
  const { data, isLoading, isError, error, refetch } = useProviderOrders();
  const updateStatus = useUpdateOrderStatus();
  const [tab, setTab] = useState<TabValue>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const orders = data ?? [];
  const term = search.trim().toLowerCase();
  const filtered = orders.filter(
    (order) => (tab === "ALL" || order.status === tab) && matchesSearch(order, term),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const updatingId = updateStatus.isPending ? updateStatus.variables?.id : undefined;
  const handleUpdate = (order: RentalOrder) => (status: RentalStatus) =>
    updateStatus.mutateAsync({ id: order.id, status }).catch(() => undefined);

  return (
    <>
      <PageHeader
        title="Incoming orders"
        description="Confirm requests, hand gear over and mark it returned. The table updates instantly."
      />

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <Tabs
          value={tab}
          onValueChange={(value) => {
            setTab(value as TabValue);
            setPage(1);
          }}
        >
          <TabsList className="h-auto flex-wrap">
            {TABS.map((item) => {
              const count =
                item.value === "ALL"
                  ? orders.length
                  : orders.filter((order) => order.status === item.value).length;
              return (
                <TabsTrigger key={item.value} value={item.value} className="gap-1.5 px-3 text-xs">
                  {item.label}
                  <span className="rounded-full bg-muted px-1.5 text-[10px] text-muted-foreground">
                    {count}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        <div className="relative xl:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search customer, gear or order ID"
            aria-label="Search orders"
            className="h-10 pl-9 text-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={orders.length === 0 ? "No orders yet" : "No orders match"}
          description={
            orders.length === 0
              ? "When customers book your gear, their requests show up here for you to confirm."
              : "Try another status tab or search term."
          }
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-border bg-card lg:block">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="px-4">Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Gear</TableHead>
                  <TableHead>Rental dates</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="px-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((order) => {
                  const days = rentalDays(order.startDate, order.endDate);
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="px-4 py-3">
                        <p className="font-mono text-xs font-semibold text-foreground">
                          {shortId(order.id)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(order.createdAt, "MMM d, h:mm a")}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium text-foreground">
                          {order.customer?.name ?? "Customer"}
                        </p>
                        <p className="text-xs text-muted-foreground">{order.customer?.email}</p>
                      </TableCell>
                      <TableCell className="max-w-56">
                        <OrderGearCell order={order} />
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-foreground">
                          {formatDay(order.startDate, "MMM d")} – {formatDay(order.endDate, "MMM d")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {days} day{days === 1 ? "" : "s"}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <p className="text-sm font-semibold text-foreground">
                          {formatCurrency(order.totalAmount)}
                        </p>
                        {order.payment && (
                          <PaymentStatusBadge status={order.payment.status} className="mt-1" />
                        )}
                      </TableCell>
                      <TableCell>
                        <RentalStatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="px-4">
                        <OrderStatusActions
                          order={order}
                          isUpdating={updatingId === order.id}
                          onUpdate={handleUpdate(order)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div className="px-4 pb-4">
              <PaginationControls
                page={currentPage}
                totalPages={totalPages}
                totalItems={filtered.length}
                itemLabel="orders"
                onPageChange={setPage}
              />
            </div>
          </div>

          <div className="space-y-3 lg:hidden">
            {visible.map((order) => (
              <article key={order.id} className="space-y-3 rounded-2xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs font-semibold text-foreground">{shortId(order.id)}</p>
                    <p className="text-sm font-medium text-foreground">{order.customer?.name}</p>
                  </div>
                  <RentalStatusBadge status={order.status} />
                </div>
                <OrderGearCell order={order} />
                <div className="flex justify-between rounded-xl bg-muted/40 p-3 text-xs">
                  <span className="text-muted-foreground">
                    {formatDay(order.startDate, "MMM d")} – {formatDay(order.endDate, "MMM d")}
                  </span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
                <OrderStatusActions
                  order={order}
                  isUpdating={updatingId === order.id}
                  onUpdate={handleUpdate(order)}
                />
              </article>
            ))}
            <PaginationControls
              page={currentPage}
              totalPages={totalPages}
              totalItems={filtered.length}
              itemLabel="orders"
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </>
  );
}
