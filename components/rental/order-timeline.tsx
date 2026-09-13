import { RENTAL_FLOW } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { RentalStatus } from "@/types/rental";
import {
  CalendarCheck,
  Check,
  CreditCard,
  PackageCheck,
  Send,
  Undo2,
  XCircle,
  type LucideIcon,
} from "lucide-react";

const STEPS: Record<
  Exclude<RentalStatus, "CANCELLED">,
  { title: string; icon: LucideIcon }
> = {
  PLACED: { title: "Request placed", icon: Send },
  CONFIRMED: { title: "Provider confirmed", icon: CalendarCheck },
  PAID: { title: "Payment received", icon: CreditCard },
  PICKED_UP: { title: "Gear picked up", icon: PackageCheck },
  RETURNED: { title: "Returned", icon: Undo2 },
};

export function OrderTimeline({ status }: { status: RentalStatus }) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-400">
        <XCircle className="size-5 shrink-0" />
        This rental was cancelled. Any reserved stock has been released.
      </div>
    );
  }

  const currentIndex = RENTAL_FLOW.indexOf(status);

  return (
    <ol className="grid gap-3 sm:grid-cols-5 sm:gap-0">
      {RENTAL_FLOW.map((step, index) => {
        const { title, icon: Icon } = STEPS[step as keyof typeof STEPS];
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <li
            key={step}
            className="relative flex items-center gap-3 sm:flex-col sm:text-center"
          >
            {index < RENTAL_FLOW.length - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute hidden h-0.5 sm:left-[calc(50%+1.25rem)] sm:right-[calc(-50%+1.25rem)] sm:top-5 sm:block",
                  index < currentIndex ? "bg-primary" : "bg-border",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                isDone && "border-primary bg-primary text-primary-foreground",
                isCurrent &&
                  "border-primary bg-primary/10 text-primary ring-4 ring-primary/15",
                !isDone && !isCurrent && "border-border bg-card text-muted-foreground",
              )}
            >
              {isDone ? <Check className="size-4" /> : <Icon className="size-4" />}
            </span>
            <span
              className={cn(
                "text-xs font-medium sm:mt-2",
                isCurrent
                  ? "text-foreground"
                  : isDone
                    ? "text-foreground/80"
                    : "text-muted-foreground",
              )}
            >
              {title}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
