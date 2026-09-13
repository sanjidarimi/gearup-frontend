"use client";

import { DateRangePicker } from "@/components/shared/date-range-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/category/queries";
import { useGearBrands } from "@/hooks/gear/queries";
import { cn } from "@/lib/utils";
import { startOfToday } from "date-fns";
import type { DateRange } from "react-day-picker";

const ALL = "all";

export interface GearFilterValues {
  category: string;
  brand: string;
  availability: string;
  minPrice: string;
  maxPrice: string;
  dates: DateRange | undefined;
}

interface GearFiltersProps {
  values: GearFilterValues;
  onCategoryChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onAvailabilityChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onDatesChange: (range: DateRange | undefined) => void;
}

export function GearFilters({
  values,
  onCategoryChange,
  onBrandChange,
  onAvailabilityChange,
  onMinPriceChange,
  onMaxPriceChange,
  onDatesChange,
}: GearFiltersProps) {
  const { data: categories = [], isLoading: loadingCategories } =
    useCategories();
  const { data: brands = [], isLoading: loadingBrands } = useGearBrands();
  const hasDates = Boolean(values.dates?.from && values.dates?.to);

  return (
    <div className="space-y-6">
      <FilterField label="Rental dates">
        <DateRangePicker
          value={values.dates}
          onChange={onDatesChange}
          disabled={{ before: startOfToday() }}
          placeholder="Any dates"
          clearable
        />
        {hasDates && (
          <p className="text-xs text-muted-foreground">
            Showing gear in stock for your trip. Dates carry over to checkout.
          </p>
        )}
      </FilterField>

      <FilterField label="Category">
        <Select
          value={values.category || ALL}
          onValueChange={(value) => onCategoryChange(value === ALL ? "" : value)}
          disabled={loadingCategories}
        >
          <SelectTrigger className="h-10 w-full">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Brand">
        <Select
          value={values.brand || ALL}
          onValueChange={(value) => onBrandChange(value === ALL ? "" : value)}
          disabled={loadingBrands}
        >
          <SelectTrigger className="h-10 w-full">
            <SelectValue placeholder="All brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All brands</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Availability">
        <div
          className={cn(
            "grid grid-cols-3 gap-1 rounded-xl border border-border bg-muted/40 p-1",
            hasDates && "pointer-events-none opacity-60",
          )}
        >
          {[
            { value: "", label: "All" },
            { value: "true", label: "In stock" },
            { value: "false", label: "Rented" },
          ].map((option) => {
            const selected = hasDates
              ? option.value === "true"
              : values.availability === option.value;
            return (
              <button
                key={option.label}
                type="button"
                onClick={() => onAvailabilityChange(option.value)}
                className={cn(
                  "rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors",
                  selected
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </FilterField>

      <FilterField label="Price per day ($)">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            placeholder="Min"
            aria-label="Minimum price per day"
            value={values.minPrice}
            onChange={(event) => onMinPriceChange(event.target.value)}
            className="h-10"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            placeholder="Max"
            aria-label="Maximum price per day"
            value={values.maxPrice}
            onChange={(event) => onMaxPriceChange(event.target.value)}
            className="h-10"
          />
        </div>
      </FilterField>
    </div>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}
