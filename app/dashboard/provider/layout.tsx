import { providerNavigation } from "@/config/navigation.config";
import { DashboardShell } from "@/components/dashboard/shell";

export default function ProviderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell config={providerNavigation} title="Provider Hub">
      {children}
    </DashboardShell>
  );
}
