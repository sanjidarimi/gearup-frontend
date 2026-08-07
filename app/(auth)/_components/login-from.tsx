"use client";

import { initialState } from "@/types/auth";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Dumbbell,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { loginUserAction } from "../_actions/authAction";

export function LoginForm() {
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered") === "true";
  const [showPassword, setShowPassword] = React.useState(false);

  const [state, action, pending] = React.useActionState(
    loginUserAction,
    initialState,
  );

  const router = useRouter();

  React.useEffect(() => {
    if (state?.success && state?.role) {
      const userRole = state.role.toUpperCase();

      switch (userRole) {
        case "ADMIN":
          router.push("/dashboard/admin");
          break;
        case "PROVIDER":
          router.push("/dashboard/provider");
          break;
        case "CUSTOMER":
          router.push("/dashboard/customer");
          break;
        default:
          router.push("/dashboard/customer");
      }
    }
  }, [state?.success, state?.role, router]);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 sm:px-6">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-bold text-lg text-foreground mb-6 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
            <Dumbbell className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-xl">
            Gear<span className="text-primary">Up</span>
          </span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to access your rentals, inventory, and account dashboard.
        </p>
      </div>

      {isRegistered && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-primary/30 bg-primary/10 p-3.5 text-sm text-primary">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Account created successfully! Please sign in.</span>
        </div>
      )}

      {state?.error && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <form action={action} className="space-y-5">
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-xs font-medium text-foreground"
          >
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="alex@example.com"
              className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-medium text-foreground"
            >
              Password
            </label>
            <Link
              href="#"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-input bg-background pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
            />
            <label htmlFor="remember" className="text-xs text-muted-foreground">
              Remember me for 30 days
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
        >
          {pending ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}
