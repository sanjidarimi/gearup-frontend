import { DashboardShell } from "@/components/dashboard/shell";
import { adminNavigation } from "@/config/navigation.config";
import { requireRole } from "@/lib/auth-guard";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("ADMIN");

  return (
    <DashboardShell config={adminNavigation} user={user}>
      {children}
    </DashboardShell>
  );
}
