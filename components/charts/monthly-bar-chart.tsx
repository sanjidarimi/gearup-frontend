"use client";

import type { MonthlyPoint } from "@/lib/chart-data";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MonthlyBarChartProps {
  data: MonthlyPoint[];
  valueLabel: string;
  formatValue: (value: number) => string;
  formatTick?: (value: number) => string;
}

const AXIS_TICK = { fill: "var(--muted-foreground)", fontSize: 12 };

// Single-series column chart: one hue, thin capped bars, hairline grid,
// a per-bar tooltip, and a table view so no value is hover-only.
export function MonthlyBarChart({
  data,
  valueLabel,
  formatValue,
  formatTick = formatValue,
}: MonthlyBarChartProps) {
  return (
    <div className="space-y-3">
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
            barCategoryGap="30%"
          >
            <CartesianGrid vertical={false} stroke="var(--viz-grid)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: "var(--viz-axis)" }}
              tick={AXIS_TICK}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={52}
              allowDecimals={false}
              tick={AXIS_TICK}
              tickFormatter={formatTick}
            />
            <Tooltip
              cursor={{ fill: "var(--viz-hover)" }}
              content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-md">
                    <p className="text-sm font-semibold text-popover-foreground">
                      {formatValue(Number(payload[0].value))}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="h-0.5 w-3 rounded-full bg-(--viz-series)" />
                      {valueLabel} · {label}
                    </p>
                  </div>
                ) : null
              }
            />
            <Bar
              dataKey="value"
              name={valueLabel}
              fill="var(--viz-series)"
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <details className="text-sm">
        <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
          View as table
        </summary>
        <table className="mt-2 w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="py-1.5 text-left font-medium">Month</th>
              <th className="py-1.5 text-right font-medium">{valueLabel}</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {data.map((point) => (
              <tr key={point.key} className="border-b border-border/60 last:border-0">
                <td className="py-1.5 text-foreground">{point.label}</td>
                <td className="py-1.5 text-right text-foreground">
                  {formatValue(point.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
