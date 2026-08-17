import { adminNavigation } from "@/config/navigation.config";
import { DashboardShell } from "@/components/dashboard/shell";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell config={adminNavigation} title="System Administration">
      {children}
    </DashboardShell>
  );
}
