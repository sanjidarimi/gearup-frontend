import { ProviderOrders } from "@/components/provider/provider-orders";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders",
};

export default function ProviderOrdersPage() {
  return <ProviderOrders />;
}
