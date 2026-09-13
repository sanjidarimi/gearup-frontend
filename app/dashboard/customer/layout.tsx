import { DashboardShell } from "@/components/dashboard/shell";
import { customerNavigation } from "@/config/navigation.config";
import { requireRole } from "@/lib/auth-guard";

export default async function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("CUSTOMER");

  return (
    <DashboardShell config={customerNavigation} user={user}>
      {children}
    </DashboardShell>
  );
}
