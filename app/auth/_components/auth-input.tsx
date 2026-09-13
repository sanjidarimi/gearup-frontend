import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface AuthInputProps extends React.ComponentProps<"input"> {
  id: string;
  label: string;
  icon: LucideIcon;
  error?: string;
  trailing?: React.ReactNode;
  labelAction?: React.ReactNode;
}

export function AuthInput({
  id,
  label,
  icon: Icon,
  error,
  trailing,
  labelAction,
  className,
  ...props
}: AuthInputProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-medium text-foreground">
          {label}
        </label>
        {labelAction}
      </div>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/15",
            trailing && "pr-11",
            className,
          )}
          {...props}
        />
        {trailing && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {trailing}
          </div>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
