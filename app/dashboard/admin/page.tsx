import { AdminOverview } from "@/components/admin/admin-overview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin console",
};

export default function AdminDashboardPage() {
  return <AdminOverview />;
}
