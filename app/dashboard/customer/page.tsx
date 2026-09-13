import { CustomerOverview } from "@/components/customer/customer-overview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer dashboard",
};

export default function CustomerDashboardPage() {
  return <CustomerOverview />;
}
