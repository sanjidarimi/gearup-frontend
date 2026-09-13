import { DashboardShell } from "@/components/dashboard/shell";
import { providerNavigation } from "@/config/navigation.config";
import { requireRole } from "@/lib/auth-guard";

export default async function ProviderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("PROVIDER");

  return (
    <DashboardShell config={providerNavigation} user={user}>
      {children}
    </DashboardShell>
  );
}
