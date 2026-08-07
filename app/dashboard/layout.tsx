import { getMe } from "@/services/get-me";
import { DashboardGuard } from "@/components/dashboard-guard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMe();

  return (
    <DashboardGuard user={user}>
      {children}
    </DashboardGuard>
  );
}
