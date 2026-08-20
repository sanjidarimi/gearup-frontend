// app/gear/page.tsx
"use client";

import { GearCard } from "@/components/gears/gear-card";
import { useGears } from "@/features/gear/queries";
import { AlertCircle, Loader2, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

const GearPage = () => {
  const { data, isLoading, isError, error } = useGears();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const gearsList = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : data.data || [];
  }, [data]);

  const categories = useMemo(() => {
    if (!gearsList.length) return ["All"];
    const unique = Array.from(
      new Set(
        gearsList
          .map((item) => item.category?.name)
          .filter((name): name is string => Boolean(name)),
      ),
    );
    return ["All", ...unique];
  }, [gearsList]);

  const filteredGear = useMemo(() => {
    return gearsList.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category?.name === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [gearsList, selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
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

        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search gear by name or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-input bg-card py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mr-1">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Category:</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-card text-foreground hover:bg-accent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {isLoading && (
          <div className="flex min-h-75 flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Loading rental catalog...
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

        {!isLoading && !isError && filteredGear.length === 0 && (
          <div className="flex min-h-75 flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="text-base font-medium text-foreground">
              No gear found
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try clearing filters or search queries.
            </p>
          </div>
        )}

        {!isLoading && !isError && filteredGear.length > 0 && (
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredGear.map((gear) => (
              <GearCard key={gear.id} gear={gear} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
};

export default GearPage;
