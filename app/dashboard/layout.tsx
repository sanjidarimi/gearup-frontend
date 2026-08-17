import { getMe } from "@/services/get-me";
import { DashboardGuard } from "@/components/dashboard-guard";
import { DashboardShell } from "@/components/dashboard/shell";
import { customerNavigation } from "@/config/navigation.config";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMe();

  return (
    <DashboardGuard user={user}>
      <DashboardShell config={customerNavigation} title="Customer Portal">
        {children}
      </DashboardShell>
    </DashboardGuard>
  );
}
