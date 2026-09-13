import { ProviderOverview } from "@/components/provider/provider-overview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Provider hub",
};

export default function ProviderDashboardPage() {
  return <ProviderOverview />;
}
