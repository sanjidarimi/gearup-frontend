"use client";

import { GearCard, GearCardSkeleton } from "@/components/gears/gear-card";
import {
  GearFilters,
  type GearFilterValues,
} from "@/components/gears/gear-filters";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGears } from "@/hooks/gear/queries";
import { getErrorMessage } from "@/lib/api-client";
import { parseDateParam, toDateParam } from "@/lib/format";
import type { GearFilterParams } from "@/types/gear";
import { format } from "date-fns";
import {
  Loader2,
  PackageSearch,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";

const PAGE_SIZE = 12;

type SortOption = "recommended" | "price-asc" | "price-desc";

export function GearPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const brand = searchParams.get("brand") ?? "";
  const availability = searchParams.get("isAvailable") ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const from = parseDateParam(searchParams.get("from"));
  const to = parseDateParam(searchParams.get("to"));
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const hasDates = Boolean(from && to);

  const [searchInput, setSearchInput] = useState(search);
  const [minInput, setMinInput] = useState(minPrice);
  const [maxInput, setMaxInput] = useState(maxPrice);
  const [sort, setSort] = useState<SortOption>("recommended");
  const typingTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Reads the live URL so a debounced update never overwrites a filter that
  // changed while the user was still typing.
  const updateParams = (
    updates: Record<string, string | null>,
    { resetPage = true, push = false } = {},
  ) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    if (resetPage) params.delete("page");

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    if (push) router.push(url);
    else router.replace(url, { scroll: false });
  };

  const updateParamsLater = (updates: Record<string, string | null>) => {
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => updateParams(updates), 450);
  };

  const queryParams = useMemo<GearFilterParams>(
    () => ({
      search: search || undefined,
      category: category || undefined,
      brand: brand || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      isAvailable: hasDates ? "true" : availability || undefined,
      page,
      limit: PAGE_SIZE,
    }),
    [search, category, brand, minPrice, maxPrice, availability, hasDates, page],
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGears(queryParams);

  const gear = useMemo(() => {
    const items = [...(data?.data ?? [])];
    if (sort === "price-asc") items.sort((a, b) => a.pricePerDay - b.pricePerDay);
    if (sort === "price-desc") items.sort((a, b) => b.pricePerDay - a.pricePerDay);
    return items;
  }, [data, sort]);

  const totalPages = data?.meta?.totalPages ?? 1;
  const total = data?.meta?.total ?? 0;
  const linkQuery =
    from && to ? `from=${toDateParam(from)}&to=${toDateParam(to)}` : undefined;

  const filterValues: GearFilterValues = {
    category,
    brand,
    availability,
    minPrice: minInput,
    maxPrice: maxInput,
    dates: from ? { from, to } : undefined,
  };

  const handleDatesChange = (range: DateRange | undefined) => {
    if (!range?.from) {
      updateParams({ from: null, to: null });
      return;
    }
    if (range.to) {
      updateParams({ from: toDateParam(range.from), to: toDateParam(range.to) });
    }
  };

  const resetFilters = () => {
    clearTimeout(typingTimer.current);
    setSearchInput("");
    setMinInput("");
    setMaxInput("");
    router.replace(pathname, { scroll: false });
  };

  const activeFilters = [
    search && { key: "search", label: `“${search}”`, clear: () => { setSearchInput(""); updateParams({ search: null }); } },
    category && { key: "category", label: category, clear: () => updateParams({ category: null }) },
    brand && { key: "brand", label: brand, clear: () => updateParams({ brand: null }) },
    !hasDates && availability && {
      key: "availability",
      label: availability === "true" ? "In stock" : "Rented out",
      clear: () => updateParams({ isAvailable: null }),
    },
    (minPrice || maxPrice) && {
      key: "price",
      label: `$${minPrice || "0"} – ${maxPrice ? `$${maxPrice}` : "any"}`,
      clear: () => { setMinInput(""); setMaxInput(""); updateParams({ minPrice: null, maxPrice: null }); },
    },
    from && to && {
      key: "dates",
      label: `${format(from, "MMM d")} – ${format(to, "MMM d")}`,
      clear: () => updateParams({ from: null, to: null }),
    },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  const filters = (
    <GearFilters
      values={filterValues}
      onCategoryChange={(value) => updateParams({ category: value || null })}
      onBrandChange={(value) => updateParams({ brand: value || null })}
      onAvailabilityChange={(value) => updateParams({ isAvailable: value || null })}
      onMinPriceChange={(value) => {
        setMinInput(value);
        updateParamsLater({ minPrice: value || null });
      }}
      onMaxPriceChange={(value) => {
        setMaxInput(value);
        updateParamsLater({ maxPrice: value || null });
      }}
      onDatesChange={handleDatesChange}
    />
  );

  return (
    <main className="px-4 pb-8 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-border bg-[url('/images/categories/default.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/55 to-black/10" />
          <div className="relative max-w-2xl space-y-3 p-8 text-white sm:p-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
              Pro-grade rentals
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Browse sports & outdoor gear
            </h1>
            <p className="text-sm text-white/80 sm:text-base">
              Filter by category, brand, price and your trip dates to find
              equipment that&apos;s ready when you are.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="hidden h-fit rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-28 lg:block">
            <div className="mb-5 flex items-center justify-between border-b border-border pb-3">
              <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </span>
              {activeFilters.length > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Reset all
                </button>
              )}
            </div>
            {filters}
          </aside>

          <div className="space-y-5 lg:col-span-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  aria-label="Search gear"
                  placeholder="Search by gear name or brand…"
                  value={searchInput}
                  onChange={(event) => {
                    setSearchInput(event.target.value);
                    updateParamsLater({ search: event.target.value.trim() || null });
                  }}
                  className="h-11 w-full rounded-xl border border-input bg-card pl-10 pr-10 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                {isFetching && !isLoading && (
                  <Loader2 className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                )}
              </div>

              <div className="flex gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="h-11 flex-1 gap-2 px-4 text-sm lg:hidden">
                      <SlidersHorizontal className="size-4" />
                      Filters
                      {activeFilters.length > 0 && (
                        <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">
                          {activeFilters.length}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto p-5">
                    <SheetHeader className="p-0 pb-4">
                      <SheetTitle>Filter gear</SheetTitle>
                    </SheetHeader>
                    {filters}
                    {activeFilters.length > 0 && (
                      <Button variant="ghost" className="mt-6 h-10 w-full text-sm" onClick={resetFilters}>
                        Reset all filters
                      </Button>
                    )}
                  </SheetContent>
                </Sheet>

                <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
                  <SelectTrigger className="h-11! w-44 text-sm" aria-label="Sort gear">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="price-asc">Price: low to high</SelectItem>
                    <SelectItem value="price-desc">Price: high to low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex min-h-7 flex-wrap items-center gap-2">
              <p className="mr-2 text-sm text-muted-foreground">
                {isLoading ? (
                  "Loading gear…"
                ) : (
                  <>
                    <span className="font-semibold text-foreground">{total}</span>{" "}
                    {total === 1 ? "item" : "items"} found
                  </>
                )}
              </p>
              {activeFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={filter.clear}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/40"
                >
                  {filter.label}
                  <X className="h-3 w-3" />
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <GearCardSkeleton key={index} />
                ))}
              </div>
            ) : isError ? (
              <ErrorState
                title="Failed to load equipment"
                message={getErrorMessage(error)}
                onRetry={() => refetch()}
              />
            ) : gear.length === 0 ? (
              <EmptyState
                icon={PackageSearch}
                title="No gear matches those filters"
                description="Try a different search term, widen the price range or clear a few filters."
                action={
                  <Button size="lg" onClick={resetFilters}>
                    Clear all filters
                  </Button>
                }
              />
            ) : (
              <section
                aria-label="Gear results"
                className="grid grid-cols-1 gap-6 transition-opacity sm:grid-cols-2 xl:grid-cols-3 data-[fetching=true]:opacity-60"
                data-fetching={isFetching}
              >
                {gear.map((item, index) => (
                  <GearCard
                    key={item.id}
                    gear={item}
                    priority={index < 3}
                    linkQuery={linkQuery}
                  />
                ))}
              </section>
            )}

            {!isLoading && !isError && total > 0 && (
              <PaginationControls
                page={page}
                totalPages={totalPages}
                totalItems={total}
                itemLabel="items"
                onPageChange={(nextPage) =>
                  updateParams(
                    { page: nextPage > 1 ? String(nextPage) : null },
                    { resetPage: false, push: true },
                  )
                }
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
