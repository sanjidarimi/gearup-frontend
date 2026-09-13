"use client";

import Logo from "@/components/shared/Logo";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShoppingBag,
  Store,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { registerUserAction } from "../_actions/auth";
import { AuthInput } from "./auth-input";

const ROLE_OPTIONS = [
  {
    value: "CUSTOMER" as const,
    title: "Rent gear",
    subtitle: "I'm planning a trip",
    icon: ShoppingBag,
  },
  {
    value: "PROVIDER" as const,
    title: "List gear",
    subtitle: "I run a rental shop",
    icon: Store,
  },
];

function passwordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score++;
  return score;
}

const STRENGTH_LABELS = ["Too short", "Weak", "Okay", "Good", "Strong"];
const STRENGTH_COLORS = [
  "bg-destructive",
  "bg-destructive",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-emerald-600",
];

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const initialRole =
    searchParams.get("role")?.toUpperCase() === "PROVIDER"
      ? "PROVIDER"
      : "CUSTOMER";

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: initialRole,
      terms: false,
    },
  });

  const role = useWatch({ control, name: "role" });
  const password = useWatch({ control, name: "password" });
  const strength = passwordStrength(password ?? "");

  const onSubmit = handleSubmit((values) => {
    setFormError(null);

    startTransition(async () => {
      const result = await registerUserAction(values);

      if (!result.success) {
        setFormError(result.message);
        toast.error("Registration failed", { description: result.message });
        return;
      }

      toast.success(result.message);
      router.push("/auth/login?registered=true");
    });
  });

  return (
    <div className="mx-auto w-full max-w-md px-4 py-8 sm:px-6">
      <div className="mb-8">
        <div className="mb-8">
          <Logo />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Rent premium outdoor gear or start earning as a provider.
        </p>
      </div>

      {formError && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <fieldset className="space-y-2">
              <legend className="text-xs font-semibold uppercase tracking-wider text-foreground">
                I want to
              </legend>
              <div role="radiogroup" className="grid grid-cols-2 gap-3">
                {ROLE_OPTIONS.map(({ value, title, subtitle, icon: Icon }) => {
                  const selected = field.value === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => field.onChange(value)}
                      className={cn(
                        "flex flex-col items-start rounded-xl border p-3.5 text-left transition-all",
                        selected
                          ? "border-primary bg-primary/10 ring-1 ring-primary"
                          : "border-border bg-card hover:bg-muted/50",
                      )}
                    >
                      <span className="mb-1 flex w-full items-center justify-between">
                        <Icon
                          className={cn(
                            "h-4 w-4",
                            selected ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                        {selected && (
                          <span className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </span>
                      <span className="text-sm font-bold text-foreground">
                        {title}
                      </span>
                      <span className="mt-0.5 text-[11px] text-muted-foreground">
                        {subtitle}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}
        />

        <AuthInput
          id="name"
          label="Full name"
          icon={UserIcon}
          autoComplete="name"
          placeholder="Alex Morgan"
          error={errors.name?.message}
          {...register("name")}
        />

        <AuthInput
          id="email"
          type="email"
          label="Email address"
          icon={Mail}
          autoComplete="email"
          placeholder="alex@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="space-y-2">
          <AuthInput
            id="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            icon={Lock}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            error={errors.password?.message}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
            {...register("password")}
          />
          {password && (
            <div className="flex items-center gap-3" aria-live="polite">
              <div className="grid flex-1 grid-cols-4 gap-1">
                {Array.from({ length: 4 }).map((_, index) => (
                  <span
                    key={index}
                    className={cn(
                      "h-1 rounded-full",
                      index < strength ? STRENGTH_COLORS[strength] : "bg-muted",
                    )}
                  />
                ))}
              </div>
              <span className="w-16 text-right text-[11px] font-medium text-muted-foreground">
                {STRENGTH_LABELS[strength]}
              </span>
            </div>
          )}
        </div>

        <AuthInput
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          label="Confirm password"
          icon={Lock}
          autoComplete="new-password"
          placeholder="Repeat your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Controller
          control={control}
          name="terms"
          render={({ field }) => (
            <div className="space-y-1.5">
              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="terms"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  aria-invalid={Boolean(errors.terms)}
                  className="mt-0.5"
                />
                <label
                  htmlFor="terms"
                  className="text-xs leading-snug text-muted-foreground"
                >
                  I agree to GearUp&apos;s Terms of Service and Privacy Policy,
                  including returning rented gear on time and in good condition.
                </label>
              </div>
              {errors.terms && (
                <p className="text-xs font-medium text-destructive">
                  {errors.terms.message}
                </p>
              )}
            </div>
          )}
        />

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account…
            </>
          ) : (
            <>
              Get started as a {role === "PROVIDER" ? "provider" : "customer"}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
