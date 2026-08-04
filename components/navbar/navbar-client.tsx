"use client";

import { User, UserRole } from "@/types/auth";
import {
  Activity,
  ChevronDown,
  Compass,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import Logo from "../shared/Logo";
import { ModeToggle } from "../shared/ModeToggle";

interface NavbarClientProps {
  user: User | null;
  onLogout?: () => Promise<void>;
}

interface NavLink {
  label: string;
  href: string;
  icon: React.ElementType;
}

export function NavbarClient({ user, onLogout }: NavbarClientProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const getRoleLinks = (role: UserRole): NavLink[] => {
    switch (role) {
      case "CUSTOMER":
        return [
          {
            label: "My Rentals",
            href: "/dashboard/customer",
            icon: ShoppingBag,
          },
        ];
      case "PROVIDER":
        return [
          {
            label: "Provider Hub",
            href: "/dashboard/provider",
            icon: LayoutDashboard,
          },
          {
            label: "Add Gear",
            href: "/dashboard/provider/gear/new",
            icon: PlusCircle,
          },
          { label: "Orders", href: "/dashboard/provider/orders", icon: Layers },
        ];
      case "ADMIN":
        return [
          {
            label: "Admin Hub",
            href: "/dashboard/admin",
            icon: LayoutDashboard,
          },
          {
            label: "Manage Users",
            href: "/dashboard/admin/users",
            icon: Users,
          },
        ];
      default:
        return [];
    }
  };

  const roleLinks = user ? getRoleLinks(user.role) : [];

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false;
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-4 z-50 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <nav className="relative rounded-2xl border border-border/80 bg-background/80 shadow-lg shadow-black/5 backdrop-blur-md transition-all duration-200 dark:shadow-black/20">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <Logo />

   
          <div className="hidden md:flex md:items-center md:gap-1">
            <Link
              href="/gear"
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                isActive("/gear")
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Compass className="h-4 w-4" />
              <span>Explore Gear</span>
            </Link>

            {roleLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Action Area */}
          <div className="hidden md:flex md:items-center md:gap-3">
            <ModeToggle/>
            {user ? (
              <div className="relative">
                
                <button
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/40 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:border-border"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary font-bold text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold leading-none text-foreground">
                      {user.name}
                    </span>
                    <span className="mt-0.5 text-[10px] font-medium leading-none text-muted-foreground uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-border bg-popover p-1.5 shadow-xl transition-all">
                    <div className="px-3 py-2 border-b border-border/50">
                      <p className="text-xs font-medium text-muted-foreground">
                        Signed in as
                      </p>
                      <p className="text-sm font-semibold truncate text-popover-foreground">
                        {user.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        href={
                          user.role === "CUSTOMER"
                            ? "/dashboard/customer"
                            : user.role === "PROVIDER"
                              ? "/dashboard/provider"
                              : "/dashboard/admin"
                        }
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                      >
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span>Dashboard</span>
                      </Link>
                    </div>

                    <div className="border-t border-border/50 pt-1">
                      <button
                        onClick={async () => {
                          setIsProfileOpen(false);
                          if (onLogout) await onLogout();
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Navigation Menu"
              className="inline-flex items-center justify-center rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="border-t border-border px-4 pt-3 pb-4 md:hidden">
            <div className="space-y-1">
              <Link
                href="/gear"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-base font-medium transition-colors ${
                  isActive("/gear")
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Compass className="h-5 w-5" />
                <span>Explore Gear</span>
              </Link>

              {roleLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-base font-medium transition-colors ${
                      isActive(link.href)
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 border-t border-border pt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">
                        {user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      if (onLogout) await onLogout();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-base font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
