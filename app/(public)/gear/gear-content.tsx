"use client";
import { GearCard } from "@/components/gears/gear-card";
import { useGears } from "@/hooks/gear/queries";
import { Gear } from "@/types/gear";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

const CATEGORIES = [
  "All",
  "Camping & Hiking",
  "Cycling",
  "Water Sports",
  "Winter Sports",
];

export function GearPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "All";
  const brand = searchParams.get("brand") ?? "All";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const isAvailable = searchParams.get("isAvailable") ?? "true";
  const page = Number(searchParams.get("page") ?? "1");

  const filterParams = useMemo(
    () => ({
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      isAvailable,
      page,
      limit: 12,
    }),
    [search, category, brand, minPrice, maxPrice, isAvailable, page],
  );

  const { data, isLoading, isError, error } = useGears(filterParams);

  const updateQueryParams = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "All") {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      if (name !== "page") {
        params.set("page", "1");
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  const resetFilters = () => router.push(pathname);

  const gearsList = Array.isArray(data) ? data : (data?.data ?? []);
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-12">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary">
              Pro-Grade Rentals
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Performance Sport Gear
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Rent high-tier outdoor, winter, and water sport equipment ready
              for your next adventure.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <aside className="space-y-6 rounded-2xl border border-border bg-card p-5 h-fit">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </div>
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Availability
              </label>
              <select
                value={isAvailable}
                onChange={(e) =>
                  updateQueryParams("isAvailable", e.target.value)
                }
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="true">Available</option>
                <option value="false">Out Of Stock</option>
                <option value="All">All Items</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => updateQueryParams("category", e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Price Range ($)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) =>
                    updateQueryParams("minPrice", e.target.value)
                  }
                  className="w-full rounded-xl border border-input bg-background p-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
                <span className="text-muted-foreground text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) =>
                    updateQueryParams("maxPrice", e.target.value)
                  }
                  className="w-full rounded-xl border border-input bg-background p-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </aside>

          {/* List Area */}
          <div className="space-y-6 lg:col-span-3">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search gear by name or model..."
                value={search}
                onChange={(e) => updateQueryParams("search", e.target.value)}
                className="w-full rounded-xl border border-input bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {isLoading && (
              <div className="flex min-h-75 flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Fetching gears data...
                </p>
              </div>
            )}

            {isError && (
              <div className="flex min-h-75 flex-col items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <h3 className="text-base font-semibold text-foreground">
                  Failed to load equipment
                </h3>
                <p className="text-sm text-muted-foreground">
                  {error?.message || "Something went wrong"}
                </p>
              </div>
            )}

            {!isLoading && !isError && gearsList.length === 0 && (
              <div className="flex min-h-75 flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
                <p className="text-base font-medium text-foreground">
                  No gear found
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try clearing filters or search queries.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {!isLoading && !isError && gearsList.length > 0 && (
              <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {gearsList.map((gear: Gear) => (
                  <GearCard key={gear.id} gear={gear} />
                ))}
              </section>
            )}

            {!isLoading && !isError && gearsList.length > 0 && (
              <div className="flex items-center justify-between border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => updateQueryParams("page", String(page - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => updateQueryParams("page", String(page + 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
