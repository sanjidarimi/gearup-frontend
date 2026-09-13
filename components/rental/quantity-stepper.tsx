"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function QuantityStepper({
  value,
  max,
  onChange,
  disabled,
}: QuantityStepperProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-background p-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-lg"
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= 1}
        aria-label="Decrease quantity"
      >
        <Minus />
      </Button>
      <span className="min-w-12 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-lg"
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <Plus />
      </Button>
    </div>
  );
}
