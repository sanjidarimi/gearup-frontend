"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarDays, X } from "lucide-react";
import { useState } from "react";
import type { DateRange, Matcher } from "react-day-picker";

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  disabled?: Matcher | Matcher[];
  placeholder?: string;
  className?: string;
  clearable?: boolean;
}

export function DateRangePicker({
  value,
  onChange,
  disabled,
  placeholder = "Pick rental dates",
  className,
  clearable,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const label = value?.from
    ? value.to
      ? `${format(value.from, "MMM d")} – ${format(value.to, "MMM d, yyyy")}`
      : `${format(value.from, "MMM d, yyyy")} – pick return`
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={cn("relative", className)}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-10 w-full justify-start gap-2 px-3 text-left text-sm font-normal",
              !value?.from && "text-muted-foreground",
              clearable && value?.from && "pr-9",
            )}
          >
            <CalendarDays className="size-4 text-primary" />
            <span className="truncate">{label}</span>
          </Button>
        </PopoverTrigger>
        {clearable && value?.from && (
          <button
            type="button"
            aria-label="Clear dates"
            onClick={() => onChange(undefined)}
            className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          numberOfMonths={2}
          selected={value}
          defaultMonth={value?.from}
          disabled={disabled}
          excludeDisabled
          min={1}
          onSelect={(range) => {
            onChange(range);
            if (range?.from && range.to && range.from < range.to) {
              setOpen(false);
            }
          }}
          className="[--cell-size:--spacing(8)]"
        />
        <p className="border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
          Choose a pick-up day, then a return day. Greyed-out dates
          can&apos;t be booked.
        </p>
      </PopoverContent>
    </Popover>
  );
}
