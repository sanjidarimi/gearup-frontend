"use client";

import { GearImage } from "@/components/gears/gear-image";
import { TableSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCategories } from "@/hooks/category/queries";
import {
  useDeleteGear,
  useProviderGear,
  useToggleGearAvailability,
} from "@/hooks/provider/queries";
import { getErrorMessage } from "@/lib/api-client";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  Boxes,
  CheckCircle2,
  ExternalLink,
  Package,
  PackagePlus,
  Pencil,
  Plus,
  Search,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const PAGE_SIZE = 8;

export function InventoryTable() {
  const { data, isLoading, isError, error, refetch } = useProviderGear();
  const { data: categories = [] } = useCategories();
  const toggleAvailability = useToggleGearAvailability();
  const deleteGear = useDeleteGear();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const categoryNames = useMemo(
    () => new Map(categories.map((item) => [item.id, item.name])),
    [categories],
  );

  const gear = data ?? [];
  const term = search.trim().toLowerCase();
  const filtered = gear.filter((item) => {
    const matchesSearch =
      !term ||
      item.name.toLowerCase().includes(term) ||
      item.brand?.toLowerCase().includes(term);
    const matchesCategory = category === "all" || item.categoryId === category;
    const bookable = item.isAvailable && item.stock > 0;
    const matchesStatus =
      status === "all" ||
      (status === "live" && bookable) ||
      (status === "paused" && !bookable);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const liveCount = gear.filter((item) => item.isAvailable && item.stock > 0).length;
  const totalUnits = gear.reduce((sum, item) => sum + item.stock, 0);
  const lowStock = gear.filter((item) => item.stock <= 1).length;

  const resetPage = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  return (
    <>
      <PageHeader
        title="My gear"
        description="Manage listings, prices and availability for everything in your shop."
        actions={
          <Button asChild size="lg" className="h-10 px-4">
            <Link href="/dashboard/provider/gear/new">
              <Plus />
              Add gear
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Listings" value={gear.length} icon={Boxes} loading={isLoading} />
        <StatCard label="Live" value={liveCount} icon={CheckCircle2} tone="emerald" loading={isLoading} hint="Available and in stock" />
        <StatCard label="Units in stock" value={totalUnits} icon={Package} tone="blue" loading={isLoading} />
        <StatCard label="Low stock" value={lowStock} icon={TriangleAlert} tone="amber" loading={isLoading} hint="One unit or fewer left" />
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(event) => resetPage(setSearch)(event.target.value)}
            placeholder="Search by name or brand"
            aria-label="Search inventory"
            className="h-10 pl-9 text-sm"
          />
        </div>
        <Select value={category} onValueChange={resetPage(setCategory)}>
          <SelectTrigger className="h-10! w-full text-sm md:w-48" aria-label="Filter by category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={resetPage(setStatus)}>
          <SelectTrigger className="h-10! w-full text-sm md:w-40" aria-label="Filter by availability">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any status</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="paused">Paused / out of stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      ) : gear.length === 0 ? (
        <EmptyState
          icon={PackagePlus}
          title="Your shop is empty"
          description="List your first piece of gear and it will appear in the public catalog right away."
          action={
            <Button asChild size="lg">
              <Link href="/dashboard/provider/gear/new">
                <Plus />
                Add your first gear
              </Link>
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No listings match"
          description="Try a different search or clear the filters."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="px-4">Gear</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price / day</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="px-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((item) => {
                const categoryName = categoryNames.get(item.categoryId ?? "") ?? "—";
                const isToggling =
                  toggleAvailability.isPending &&
                  toggleAvailability.variables?.id === item.id;

                return (
                  <TableRow key={item.id}>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                          <GearImage
                            src={item.imageUrl}
                            alt={item.name}
                            category={categoryName}
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 max-w-56">
                          <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {item.brand || "Independent brand"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{categoryName}</TableCell>
                    <TableCell className="text-right text-sm font-semibold text-foreground">
                      {formatCurrency(item.pricePerDay)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={
                          item.stock <= 1
                            ? "rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400"
                            : "text-sm text-foreground"
                        }
                      >
                        {item.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={item.isAvailable && item.stock > 0}
                          disabled={item.stock === 0 || isToggling}
                          onCheckedChange={(checked) =>
                            toggleAvailability.mutate({ id: item.id, isAvailable: checked })
                          }
                          aria-label={`Toggle availability for ${item.name}`}
                        />
                        <span className="text-xs text-muted-foreground">
                          {item.stock === 0 ? "No stock" : item.isAvailable ? "Live" : "Paused"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(item.updatedAt)}
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon-lg" aria-label={`View ${item.name}`}>
                          <Link href={`/gear/${item.id}`} target="_blank">
                            <ExternalLink />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="icon-lg" aria-label={`Edit ${item.name}`}>
                          <Link href={`/dashboard/provider/gear/${item.id}/edit`}>
                            <Pencil />
                          </Link>
                        </Button>
                        <ConfirmDialog
                          title={`Delete ${item.name}?`}
                          description="The listing will be removed from the catalog. Gear with existing rental orders may not be deletable."
                          confirmLabel="Delete gear"
                          destructive
                          onConfirm={() =>
                            deleteGear.mutateAsync(item.id).catch(() => undefined)
                          }
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon-lg"
                              aria-label={`Delete ${item.name}`}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 />
                            </Button>
                          }
                        />
                      </div>
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
              itemLabel="listings"
              onPageChange={setPage}
            />
          </div>
        </div>
      )}
    </>
  );
}
