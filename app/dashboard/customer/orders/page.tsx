import { CustomerOrders } from "@/components/customer/customer-orders";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My rentals",
};

export default function CustomerOrdersPage() {
  return <CustomerOrders />;
}
