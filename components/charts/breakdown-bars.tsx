interface BreakdownItem {
  label: string;
  value: number;
}

interface BreakdownBarsProps {
  items: BreakdownItem[];
  formatValue?: (value: number) => string;
}

// A labelled bar list: every value is printed beside its bar, so it reads
// without hovering and without relying on color.
export function BreakdownBars({
  items,
  formatValue = (value) => value.toLocaleString("en-US"),
}: BreakdownBarsProps) {
  const max = Math.max(0, ...items.map((item) => item.value));

  return (
    <ul className="space-y-3.5">
      {items.map((item) => (
        <li
          key={item.label}
          className="grid grid-cols-[6.5rem_1fr_2.5rem] items-center gap-3 text-sm"
        >
          <span className="truncate text-muted-foreground">{item.label}</span>
          <span className="h-2.5 overflow-hidden rounded-[2px] bg-muted">
            <span
              className="block h-full rounded-r-[4px] bg-(--viz-series) transition-[width] duration-500"
              style={{ width: max ? `${(item.value / max) * 100}%` : "0%" }}
            />
          </span>
          <span className="text-right font-semibold tabular-nums text-foreground">
            {formatValue(item.value)}
          </span>
        </li>
      ))}
    </ul>
  );
}
