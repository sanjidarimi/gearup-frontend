"use client";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminRentals } from "@/hooks/admin/queries";
import { ApiError, getErrorMessage } from "@/lib/api-client";
import { RENTAL_STATUS_META } from "@/lib/constants";
import {
  formatCurrency,
  formatDate,
  formatDay,
  rentalDays,
  shortId,
} from "@/lib/format";
import { orderQuantity, orderTitle } from "@/lib/rental";
import type { RentalStatus } from "@/types/rental";
import { Receipt, Search } from "lucide-react";
import { useState } from "react";
import { EndpointUnavailable } from "./endpoint-unavailable";

const PAGE_SIZE = 10;

export function AdminOrders() {
  const { data, isLoading, isError, error, refetch } = useAdminRentals();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | RentalStatus>("all");
  const [page, setPage] = useState(1);

  if (isError && error instanceof ApiError && error.status === 404) {
    return (
      <>
        <PageHeader title="Rental orders" description="Every rental across the platform." />
        <EndpointUnavailable endpoint="GET /api/admin/rentals" />
      </>
    );
  }

  const orders = data ?? [];
  const term = search.trim().toLowerCase();
  const filtered = orders.filter(
    (order) =>
      (status === "all" || order.status === status) &&
      (!term ||
        order.id.toLowerCase().includes(term) ||
        order.customer?.name.toLowerCase().includes(term)),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const gmv = filtered.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <>
      <PageHeader
        title="Rental orders"
        description="Inspect every rental across the platform, from request to return."
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search order ID or customer"
            aria-label="Search rentals"
            className="h-10 pl-9 text-sm"
          />
        </div>
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value as "all" | RentalStatus);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-10! w-full text-sm md:w-48" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {(Object.keys(RENTAL_STATUS_META) as RentalStatus[]).map((key) => (
              <SelectItem key={key} value={key}>
                {RENTAL_STATUS_META[key].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!isLoading && !isError && (
          <p className="text-sm text-muted-foreground md:ml-2">
            {filtered.length} orders · {formatCurrency(gmv)}
          </p>
        )}
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Receipt} title="No rentals found" description="Nothing matches these filters yet." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="px-4">Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Rental dates</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="px-4">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((order) => {
                const days = rentalDays(order.startDate, order.endDate);
                return (
                  <TableRow key={order.id}>
                    <TableCell className="px-4 py-3">
                      <p className="font-mono text-xs font-semibold text-foreground">{shortId(order.id)}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium text-foreground">{order.customer?.name ?? "—"}</p>
                      {order.customer?.email && (
                        <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                      )}
                    </TableCell>
                    <TableCell className="max-w-56">
                      <p className="truncate text-sm text-foreground">{orderTitle(order)}</p>
                      <p className="text-xs text-muted-foreground">{orderQuantity(order)} units</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-foreground">
                        {formatDay(order.startDate, "MMM d")} – {formatDay(order.endDate, "MMM d, yyyy")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {days} day{days === 1 ? "" : "s"}
                      </p>
                    </TableCell>
                    <TableCell className="text-right text-sm font-semibold text-foreground">
                      {formatCurrency(order.totalAmount)}
                    </TableCell>
                    <TableCell>
                      {order.payment ? (
                        <PaymentStatusBadge status={order.payment.status} />
                      ) : (
                        <span className="text-xs text-muted-foreground">Not started</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4">
                      <RentalStatusBadge status={order.status} />
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
      )}
    </>
  );
}
