"use client";

import { useSession } from "@/components/session-provider";
import { PageHeader } from "@/components/shared/page-header";
import { UserStatusBadge } from "@/components/shared/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ROLE_HOME, ROLE_LABEL } from "@/lib/constants";
import { formatDate, initials, shortId } from "@/lib/format";
import { logout } from "@/services/logout";
import type { UserRole } from "@/types/auth";
import {
  CalendarDays,
  Fingerprint,
  Loader2,
  LogOut,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

const ROLE_LINKS: Record<UserRole, { label: string; href: string }[]> = {
  CUSTOMER: [
    { label: "My rentals", href: "/dashboard/customer/orders" },
    { label: "Payment history", href: "/dashboard/customer/payments" },
    { label: "My reviews", href: "/dashboard/customer/reviews" },
  ],
  PROVIDER: [
    { label: "My gear", href: "/dashboard/provider/gear" },
    { label: "Add new gear", href: "/dashboard/provider/gear/new" },
    { label: "Incoming orders", href: "/dashboard/provider/orders" },
  ],
  ADMIN: [
    { label: "Manage users", href: "/dashboard/admin/users" },
    { label: "Gear moderation", href: "/dashboard/admin/gear" },
    { label: "Rental orders", href: "/dashboard/admin/orders" },
  ],
};

export function ProfileView() {
  const user = useSession();
  const router = useRouter();
  const [isSigningOut, startTransition] = useTransition();

  if (!user) return null;

  const handleLogout = () =>
    startTransition(async () => {
      await logout();
      toast.success("Signed out");
      router.replace("/");
      router.refresh();
    });

  const details = [
    { icon: Mail, label: "Email", value: user.email },
    { icon: ShieldCheck, label: "Account type", value: ROLE_LABEL[user.role] },
    { icon: CalendarDays, label: "Member since", value: formatDate(user.createdAt, "MMMM d, yyyy") },
    { icon: Fingerprint, label: "Account ID", value: shortId(user.id) },
  ];

  return (
    <>
      <PageHeader title="Profile" description="Your account details on GearUp." />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="overflow-hidden rounded-2xl border border-border bg-card lg:col-span-2">
          <div className="h-28 bg-linear-to-r from-primary/80 via-primary/50 to-chart-1/40" />
          <div className="-mt-12 space-y-6 px-6 pb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <Avatar className="size-24 rounded-2xl border-4 border-card shadow-lg">
                  <AvatarImage src={user.profile?.profilePhoto ?? undefined} alt={user.name} />
                  <AvatarFallback className="rounded-2xl bg-primary/15 text-2xl font-bold text-primary">
                    {initials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="pb-1">
                  <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{ROLE_LABEL[user.role]} account</p>
                </div>
              </div>
              <UserStatusBadge status={user.status} className="w-fit" />
            </div>

            {user.profile?.bio && (
              <p className="text-sm leading-relaxed text-muted-foreground">{user.profile.bio}</p>
            )}

            <dl className="grid gap-3 sm:grid-cols-2">
              {details.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-3">
                  <Icon className="size-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</dt>
                    <dd className="truncate text-sm font-medium text-foreground">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold text-foreground">Shortcuts</h2>
            <ul className="mt-3 space-y-1">
              <li>
                <Link
                  href={ROLE_HOME[user.role]}
                  className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  Dashboard overview
                </Link>
              </li>
              {ROLE_LINKS[user.role].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold text-foreground">Session</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign out of GearUp on this device.
            </p>
            <Button
              variant="destructive"
              size="lg"
              className="mt-4 h-10 w-full"
              disabled={isSigningOut}
              onClick={handleLogout}
            >
              {isSigningOut ? <Loader2 className="animate-spin" /> : <LogOut />}
              Sign out
            </Button>
          </section>
        </aside>
      </div>
    </>
  );
}
