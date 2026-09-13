"use client";

import { GearImage } from "@/components/gears/gear-image";
import { TableSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { AvailabilityBadge } from "@/components/shared/status-badge";
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
import { useCategories } from "@/hooks/category/queries";
import { useGears } from "@/hooks/gear/queries";
import { useDebounce } from "@/hooks/use-debounce";
import { getErrorMessage } from "@/lib/api-client";
import { formatCurrency, shortId } from "@/lib/format";
import { Boxes, ExternalLink, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const PAGE_SIZE = 10;

export function AdminGear() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search.trim(), 400);
  const { data: categories = [] } = useCategories();

  const { data, isLoading, isFetching, isError, error, refetch } = useGears({
    search: debouncedSearch || undefined,
    category: category === "all" ? undefined : category,
    isAvailable: availability === "all" ? undefined : availability,
    page,
    limit: PAGE_SIZE,
  });

  const gear = data?.data ?? [];
  const meta = data?.meta;

  return (
    <>
      <PageHeader
        title="Gear moderation"
        description="Inspect every listing on the platform, across all providers."
      />

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
            placeholder="Search gear name or brand"
            aria-label="Search gear"
            className="h-10 pl-9 text-sm"
          />
        </div>
        <Select
          value={category}
          onValueChange={(value) => {
            setCategory(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-10! w-full text-sm md:w-48" aria-label="Filter by category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((item) => (
              <SelectItem key={item.id} value={item.name}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={availability}
          onValueChange={(value) => {
            setAvailability(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-10! w-full text-sm md:w-40" aria-label="Filter by availability">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any availability</SelectItem>
            <SelectItem value="true">Available</SelectItem>
            <SelectItem value="false">Unavailable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      ) : gear.length === 0 ? (
        <EmptyState icon={Boxes} title="No gear found" description="Nothing matches these filters." />
      ) : (
        <div
          className="overflow-hidden rounded-2xl border border-border bg-card transition-opacity data-[fetching=true]:opacity-60"
          data-fetching={isFetching}
        >
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="px-4">Gear</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price / day</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead className="px-4 text-right">Listing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gear.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <GearImage
                          src={item.imageUrl}
                          alt={item.name}
                          category={item.category?.name}
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 max-w-64">
                        <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {item.brand || "Independent brand"} · {shortId(item.id)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.category?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-right text-sm font-semibold text-foreground">
                    {formatCurrency(item.pricePerDay)}
                  </TableCell>
                  <TableCell className="text-center text-sm text-foreground">{item.stock}</TableCell>
                  <TableCell>
                    <AvailabilityBadge available={item.isAvailable && item.stock > 0} />
                  </TableCell>
                  <TableCell className="px-4 text-right">
                    <Button asChild size="lg" variant="ghost">
                      <Link href={`/gear/${item.id}`} target="_blank">
                        <ExternalLink />
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="px-4 pb-4">
            <PaginationControls
              page={page}
              totalPages={meta?.totalPages ?? 1}
              totalItems={meta?.total}
              itemLabel="listings"
              onPageChange={setPage}
            />
          </div>
        </div>
      )}
    </>
  );
}
