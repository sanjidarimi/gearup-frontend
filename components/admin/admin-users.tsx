"use client";

import { TableSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { useSession } from "@/components/session-provider";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { StatCard } from "@/components/shared/stat-card";
import { UserStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
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
import { useAdminUsers, useUpdateUserStatus } from "@/hooks/admin/queries";
import { useDebounce } from "@/hooks/use-debounce";
import { ApiError, getErrorMessage } from "@/lib/api-client";
import { ROLE_LABEL } from "@/lib/constants";
import { formatDate, initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth";
import {
  Ban,
  Loader2,
  Search,
  ShieldCheck,
  Store,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { useState } from "react";
import { EndpointUnavailable } from "./endpoint-unavailable";

const PAGE_SIZE = 10;

const ROLE_STYLES: Record<UserRole, string> = {
  ADMIN: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  PROVIDER: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  CUSTOMER: "bg-muted text-foreground",
};

export function AdminUsers() {
  const currentUser = useSession();
  const { data, isLoading, isError, error, refetch } = useAdminUsers();
  const updateStatus = useUpdateUserStatus();

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const term = useDebounce(search.trim().toLowerCase(), 250);

  const users = data ?? [];
  const filtered = users.filter(
    (user) =>
      (role === "all" || user.role === role) &&
      (status === "all" || user.status === status) &&
      (!term ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const updatingId = updateStatus.isPending ? updateStatus.variables?.id : undefined;

  if (isError && error instanceof ApiError && error.status === 404) {
    return (
      <>
        <PageHeader title="Users" description="Search accounts and suspend or reactivate them." />
        <EndpointUnavailable endpoint="GET /api/admin/users" />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Users"
        description="Search accounts and suspend or reactivate them. Suspended users can't sign in."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="All accounts" value={users.length} icon={Users} loading={isLoading} />
        <StatCard
          label="Customers"
          value={users.filter((user) => user.role === "CUSTOMER").length}
          icon={UserCheck}
          tone="emerald"
          loading={isLoading}
        />
        <StatCard
          label="Providers"
          value={users.filter((user) => user.role === "PROVIDER").length}
          icon={Store}
          tone="blue"
          loading={isLoading}
        />
        <StatCard
          label="Suspended"
          value={users.filter((user) => user.status === "SUSPENDED").length}
          icon={UserX}
          tone="rose"
          loading={isLoading}
        />
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email"
            aria-label="Search users"
            className="h-10 pl-9 text-sm"
          />
        </div>
        <Select
          value={role}
          onValueChange={(value) => {
            setRole(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-10! w-full text-sm md:w-40" aria-label="Filter by role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="CUSTOMER">Customers</SelectItem>
            <SelectItem value="PROVIDER">Providers</SelectItem>
            <SelectItem value="ADMIN">Admins</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-10! w-full text-sm md:w-40" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Users} title="No users found" description="Try a different search or filter." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="px-4">User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="px-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((user) => {
                const isSelf = user.id === currentUser?.id;
                const isProtected = user.role === "ADMIN" || isSelf;
                const isSuspended = user.status === "SUSPENDED";
                const isUpdating = updatingId === user.id;

                return (
                  <TableRow key={user.id}>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                          {initials(user.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {user.name}
                            {isSelf && (
                              <span className="ml-1.5 text-xs font-normal text-muted-foreground">(you)</span>
                            )}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", ROLE_STYLES[user.role])}>
                        {ROLE_LABEL[user.role]}
                      </span>
                    </TableCell>
                    <TableCell>
                      <UserStatusBadge status={user.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="px-4 text-right">
                      {isProtected ? (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <ShieldCheck className="size-3.5" /> Protected
                        </span>
                      ) : isSuspended ? (
                        <Button
                          size="lg"
                          variant="outline"
                          disabled={isUpdating}
                          onClick={() => updateStatus.mutate({ id: user.id, status: "ACTIVE" })}
                        >
                          {isUpdating ? <Loader2 className="animate-spin" /> : <UserCheck />}
                          Activate
                        </Button>
                      ) : (
                        <ConfirmDialog
                          title={`Suspend ${user.name}?`}
                          description="They'll be signed out of protected pages and won't be able to log in until reactivated."
                          confirmLabel="Suspend account"
                          destructive
                          onConfirm={() =>
                            updateStatus
                              .mutateAsync({ id: user.id, status: "SUSPENDED" })
                              .catch(() => undefined)
                          }
                          trigger={
                            <Button size="lg" variant="destructive" disabled={isUpdating}>
                              {isUpdating ? <Loader2 className="animate-spin" /> : <Ban />}
                              Suspend
                            </Button>
                          }
                        />
                      )}
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
              itemLabel="users"
              onPageChange={setPage}
            />
          </div>
        </div>
      )}
    </>
  );
}
