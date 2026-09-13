"use client";

import Logo from "@/components/shared/Logo";
import { ROLE_HOME } from "@/lib/constants";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import type { UserRole } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginUserAction } from "../_actions/auth";
import { AuthInput } from "./auth-input";

function getSafeRedirect(path: string | null, role: UserRole) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return null;
  if (path.startsWith("/auth")) return null;

  const dashboardRole = path.match(/^\/dashboard\/(customer|provider|admin)/)?.[1];
  if (dashboardRole && dashboardRole.toUpperCase() !== role) return null;
  if (/^\/(checkout|payment)/.test(path) && role !== "CUSTOMER") return null;

  return path;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const justRegistered = searchParams.get("registered") === "true";
  const sessionEnded = searchParams.get("reason") === "session";
  const redirectParam = searchParams.get("redirect");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => {
    setFormError(null);

    startTransition(async () => {
      const result = await loginUserAction(values);

      if (!result.success || !result.role) {
        setFormError(result.message);
        toast.error("Sign in failed", { description: result.message });
        return;
      }

      toast.success(result.message);
      router.replace(
        getSafeRedirect(redirectParam, result.role) ?? ROLE_HOME[result.role],
      );
      router.refresh();
    });
  });

  return (
    <div className="mx-auto w-full max-w-md px-4 py-8 sm:px-6">
      <div className="mb-8">
        <div className="mb-8">
          <Logo />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to manage your rentals, inventory or the platform.
        </p>
      </div>

      {justRegistered && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-primary/30 bg-primary/10 p-3.5 text-sm text-primary">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Account created successfully! Please sign in.</span>
        </div>
      )}

      {sessionEnded && !justRegistered && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-border bg-muted/60 p-3.5 text-sm text-foreground">
          <Info className="h-4 w-4 shrink-0 text-primary" />
          <span>Your session ended. Please sign in again.</span>
        </div>
      )}

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

        <AuthInput
          id="password"
          type={showPassword ? "text" : "password"}
          label="Password"
          icon={Lock}
          autoComplete="current-password"
          placeholder="••••••••"
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

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="font-semibold text-primary hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
