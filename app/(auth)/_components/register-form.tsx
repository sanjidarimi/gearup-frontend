"use client";

import {
  AlertCircle,
  ArrowRight,
  Dumbbell,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShoppingBag,
  Store,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";

import { UserRole } from "@/types/auth";
import { registerUserAction } from "../_actions/authAction";

export function RegisterForm() {
  const searchParams = useSearchParams();
  const defaultRole =
    (searchParams.get("role")?.toUpperCase() as UserRole) || "CUSTOMER";

  const [role, setRole] = React.useState<UserRole>(
    ["CUSTOMER", "PROVIDER"].includes(defaultRole) ? defaultRole : "CUSTOMER",
  );
  const [showPassword, setShowPassword] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    formData.set("role", role);

    const result = await registerUserAction({}, formData);
    setPending(false);

    if (result.error) {
      setErrorMessage(result.error);
    } else if (result.success) {
      window.location.href = `/auth/login?registered=true`;
    }
  }

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
          Create an account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Join GearUp to rent premium outdoor gear or start earning as a
          provider.
        </p>
      </div>


      {errorMessage && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}


      <form onSubmit={handleSubmit} className="space-y-5">
   
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            I want to
          </label>
          <div className="grid grid-cols-2 gap-3">
         
            <button
              type="button"
              onClick={() => setRole("CUSTOMER")}
              className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
                role === "CUSTOMER"
                  ? "border-primary bg-primary/10 ring-1 ring-primary"
                  : "border-border bg-card hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <ShoppingBag
                  className={`h-4 w-4 ${role === "CUSTOMER" ? "text-primary" : "text-muted-foreground"}`}
                />
                {role === "CUSTOMER" && (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
              <span className="text-xs font-bold text-foreground">
                Rent Gear
              </span>
              <span className="text-[11px] text-muted-foreground mt-0.5">
                As a Customer
              </span>
            </button>

  
            <button
              type="button"
              onClick={() => setRole("PROVIDER")}
              className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
                role === "PROVIDER"
                  ? "border-primary bg-primary/10 ring-1 ring-primary"
                  : "border-border bg-card hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <Store
                  className={`h-4 w-4 ${role === "PROVIDER" ? "text-primary" : "text-muted-foreground"}`}
                />
                {role === "PROVIDER" && (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
              <span className="text-xs font-bold text-foreground">
                List Gear
              </span>
              <span className="text-[11px] text-muted-foreground mt-0.5">
                As a Provider
              </span>
            </button>
          </div>
        </div>

    
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs font-medium text-foreground">
            Full Name
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Alex Morgan"
              className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
        </div>


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
          <label
            htmlFor="password"
            className="text-xs font-medium text-foreground"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              placeholder="Minimum 8 characters"
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

 
        <div className="flex items-start gap-2 pt-1">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 rounded border-input text-primary focus:ring-primary"
          />
          <label
            htmlFor="terms"
            className="text-xs text-muted-foreground leading-snug"
          >
            I agree to GearUp&apos;s{" "}
            <Link
              href="#"
              className="font-semibold text-foreground underline underline-offset-2"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="font-semibold text-foreground underline underline-offset-2"
            >
              Privacy Policy
            </Link>
            .
          </label>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
        >
          {pending ? (
            <span>Creating account...</span>
          ) : (
            <>
              <span>
                Get Started as {role === "CUSTOMER" ? "Customer" : "Provider"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

   
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
