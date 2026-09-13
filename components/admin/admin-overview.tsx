"use client";

import { TableSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import {
  RentalStatusBadge,
  UserStatusBadge,
} from "@/components/shared/status-badge";
import { useAdminRentals, useAdminUsers } from "@/hooks/admin/queries";
import { useCategories } from "@/hooks/category/queries";
import { useGears } from "@/hooks/gear/queries";
import { ROLE_LABEL } from "@/lib/constants";
import { formatCurrency, formatRelative, initials, shortId } from "@/lib/format";
import { orderTitle } from "@/lib/rental";
import {
  ArrowRight,
  Boxes,
  DollarSign,
  Info,
  Receipt,
  Tags,
  Users,
} from "lucide-react";
import Link from "next/link";

const COUNT_PARAMS = { limit: 1 };
const AVAILABLE_PARAMS = { limit: 1, isAvailable: "true" };

export function AdminOverview() {
  const users = useAdminUsers();
  const rentals = useAdminRentals();
  const allGear = useGears(COUNT_PARAMS);
  const availableGear = useGears(AVAILABLE_PARAMS);
  const categories = useCategories();

  const userList = users.data ?? [];
  const rentalList = rentals.data ?? [];
  const revenue = rentalList
    .filter((order) => order.payment?.status === "COMPLETED")
    .reduce((sum, order) => sum + (order.payment?.amount ?? 0), 0);
  const activeUsers = userList.filter((user) => user.status === "ACTIVE").length;
  const apiMissing = users.isError || rentals.isError;

  return (
    <>
      <PageHeader
        title="Platform overview"
        description="A quick health check of users, inventory and rentals across GearUp."
      />

      {apiMissing && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-300">
          <Info className="mt-0.5 size-4 shrink-0" />
          <p>
            Some admin endpoints didn&apos;t respond ({users.isError && "users"}
            {users.isError && rentals.isError && ", "}
            {rentals.isError && "rentals"}). Catalog stats below still come from
            the public gear API.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total users"
          value={users.isError ? "—" : userList.length}
          icon={Users}
          hint={users.isError ? "Admin users API unavailable" : `${activeUsers} active accounts`}
          loading={users.isLoading}
        />
        <StatCard
          label="Active gear"
          value={availableGear.data?.meta.total ?? "—"}
          icon={Boxes}
          tone="emerald"
          hint={`${allGear.data?.meta.total ?? 0} listings in total`}
          loading={allGear.isLoading || availableGear.isLoading}
        />
        <StatCard
          label="Total rentals"
          value={rentals.isError ? "—" : rentalList.length}
          icon={Receipt}
          tone="blue"
          hint={`${categories.data?.length ?? 0} categories live`}
          loading={rentals.isLoading}
        />
        <StatCard
          label="Revenue processed"
          value={rentals.isError ? "—" : formatCurrency(revenue)}
          icon={DollarSign}
          tone="violet"
          hint="Completed Stripe payments"
          loading={rentals.isLoading}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Newest users</h2>
            <Link
              href="/dashboard/admin/users"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Manage users <ArrowRight className="size-4" />
            </Link>
          </div>
          {users.isLoading ? (
            <TableSkeleton rows={4} />
          ) : userList.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              {users.isError ? "User data is unavailable." : "No users yet."}
            </p>
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {userList.slice(0, 5).map((user) => (
                <li key={user.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                    {initials(user.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {ROLE_LABEL[user.role]} · joined {formatRelative(user.createdAt)}
                    </p>
                  </div>
                  <UserStatusBadge status={user.status} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Latest rentals</h2>
            <Link
              href="/dashboard/admin/orders"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              All rentals <ArrowRight className="size-4" />
            </Link>
          </div>
          {rentals.isLoading ? (
            <TableSkeleton rows={4} />
          ) : rentalList.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              {rentals.isError ? "Rental data is unavailable." : "No rentals yet."}
            </p>
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {rentalList.slice(0, 5).map((order) => (
                <li key={order.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{orderTitle(order)}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {shortId(order.id)} · {order.customer?.name ?? "Customer"} ·{" "}
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                  <RentalStatusBadge status={order.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Tags className="size-5" />
          </span>
          <div>
            <p className="font-semibold text-foreground">Catalog categories</p>
            <p className="text-sm text-muted-foreground">
              {categories.data?.length ?? 0} categories organise the gear providers can list.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/admin/categories"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          Manage categories <ArrowRight className="size-4" />
        </Link>
      </section>
    </>
  );
}
