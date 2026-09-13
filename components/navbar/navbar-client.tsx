"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_HOME, ROLE_LABEL } from "@/lib/constants";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import { logout } from "@/services/logout";
import type { IUserProfile, UserRole } from "@/types/auth";
import {
  ChevronDown,
  Compass,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  UserCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import Logo from "../shared/Logo";
import { ModeToggle } from "../shared/ModeToggle";

interface NavbarClientProps {
  user: IUserProfile | null;
}

interface NavLink {
  label: string;
  href: string;
  icon: React.ElementType;
}

const PUBLIC_LINKS: NavLink[] = [
  { label: "Explore Gear", href: "/gear", icon: Compass },
  { label: "How it works", href: "/#how-it-works", icon: Sparkles },
];

const ROLE_LINKS: Record<UserRole, NavLink[]> = {
  CUSTOMER: [
    { label: "My Rentals", href: "/dashboard/customer/orders", icon: ShoppingBag },
  ],
  PROVIDER: [
    { label: "Provider Hub", href: "/dashboard/provider", icon: LayoutDashboard },
    { label: "My Gear", href: "/dashboard/provider/gear", icon: Package },
  ],
  ADMIN: [{ label: "Admin Console", href: "/dashboard/admin", icon: ShieldCheck }],
};

export function NavbarClient({ user }: NavbarClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSigningOut, startTransition] = useTransition();

  const links = [...PUBLIC_LINKS, ...(user ? ROLE_LINKS[user.role] : [])];

  const isActive = (href: string) => {
    if (href.includes("#")) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    startTransition(async () => {
      await logout();
      toast.success("Signed out", {
        description: "See you on the next adventure.",
      });
      router.push("/");
      router.refresh();
    });
  };

  const linkClass = (href: string, mobile = false) =>
    cn(
      "flex items-center gap-2 rounded-lg font-medium transition-colors",
      mobile ? "px-3.5 py-2.5 text-base" : "px-3.5 py-2 text-sm",
      isActive(href)
        ? "bg-primary/10 font-semibold text-primary"
        : "text-muted-foreground hover:bg-muted hover:text-foreground",
    );

  return (
    <header className="sticky top-4 z-50 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <nav className="relative rounded-2xl border border-border/80 bg-background/80 shadow-lg shadow-black/5 backdrop-blur-md dark:shadow-black/20">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <Logo />

          <div className="hidden md:flex md:items-center md:gap-1">
            {links.map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href} className={linkClass(href)}>
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:gap-3">
            <ModeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/40 px-3 py-1.5 text-sm font-medium transition-colors hover:border-border hover:bg-muted">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                      {initials(user.name)}
                    </span>
                    <span className="flex flex-col text-left">
                      <span className="text-xs font-semibold leading-none text-foreground">
                        {user.name}
                      </span>
                      <span className="mt-0.5 text-[10px] font-medium uppercase leading-none tracking-wider text-muted-foreground">
                        {ROLE_LABEL[user.role]}
                      </span>
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <p className="text-xs text-muted-foreground">Signed in as</p>
                    <p className="truncate text-sm font-semibold">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={ROLE_HOME[user.role]}>
                      <LayoutDashboard />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`${ROLE_HOME[user.role]}/profile`}>
                      <UserCircle />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={isSigningOut}
                    onSelect={handleLogout}
                  >
                    <LogOut />
                    {isSigningOut ? "Signing out…" : "Sign out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ModeToggle />
            <button
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="inline-flex items-center justify-center rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-border px-4 pb-4 pt-3 md:hidden">
            <div className="space-y-1">
              {links.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={linkClass(href, true)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>

            <div className="mt-4 border-t border-border pt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 font-bold text-primary">
                      {initials(user.name)}
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">
                        {user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={isSigningOut}
                    className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-base font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>{isSigningOut ? "Signing out…" : "Sign Out"}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
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
