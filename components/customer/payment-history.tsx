"use client";

import { TableSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { StatCard } from "@/components/shared/stat-card";
import {
  PaymentStatusBadge,
  RentalStatusBadge,
} from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMyPayments } from "@/hooks/payment/queries";
import { getErrorMessage } from "@/lib/api-client";
import { formatCurrency, formatDate, formatDay, shortId } from "@/lib/format";
import { CheckCircle2, Clock, CreditCard, Receipt } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const PAGE_SIZE = 10;

export function PaymentHistory() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useMyPayments();
  const payments = data ?? [];

  const completed = payments.filter((payment) => payment.status === "COMPLETED");
  const pending = payments.filter((payment) => payment.status === "PENDING");
  const totalPaid = completed.reduce((sum, payment) => sum + payment.amount, 0);
  const totalPages = Math.max(1, Math.ceil(payments.length / PAGE_SIZE));
  const visible = payments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <PageHeader
        title="Payment history"
        description="Every Stripe checkout you've started, and whether it went through."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total paid"
          value={formatCurrency(totalPaid)}
          icon={CreditCard}
          tone="emerald"
          loading={isLoading}
        />
        <StatCard
          label="Completed"
          value={completed.length}
          icon={CheckCircle2}
          tone="violet"
          loading={isLoading}
        />
        <StatCard
          label="Pending"
          value={pending.length}
          icon={Clock}
          tone="amber"
          hint="Checkout started but not finished"
          loading={isLoading}
        />
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      ) : payments.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No payments yet"
          description="When a provider confirms one of your rentals, pay for it and the receipt will appear here."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="px-4">Payment</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Rental dates</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Payment status</TableHead>
                <TableHead className="px-4">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="px-4 py-3">
                    <p className="font-mono text-xs font-semibold text-foreground">
                      {shortId(payment.id)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {payment.provider ?? "STRIPE"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/customer/orders/${payment.rentalOrderId}`}
                      className="font-mono text-xs font-semibold text-primary hover:underline"
                    >
                      {shortId(payment.rentalOrderId)}
                    </Link>
                    {payment.rentalOrder && (
                      <div className="mt-1">
                        <RentalStatusBadge status={payment.rentalOrder.status} />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {payment.rentalOrder
                      ? `${formatDay(payment.rentalOrder.startDate, "MMM d")} – ${formatDay(payment.rentalOrder.endDate, "MMM d, yyyy")}`
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right text-sm font-semibold text-foreground">
                    {formatCurrency(payment.amount)}
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={payment.status} />
                  </TableCell>
                  <TableCell className="px-4 text-sm text-muted-foreground">
                    {formatDate(payment.paidAt ?? payment.createdAt, "MMM d, yyyy h:mm a")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="px-4 pb-4">
            <PaginationControls
              page={page}
              totalPages={totalPages}
              totalItems={payments.length}
              itemLabel="payments"
              onPageChange={setPage}
            />
          </div>
        </div>
      )}
    </>
  );
}
