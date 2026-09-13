import { AdminOrders } from "@/components/admin/admin-orders";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rental orders",
};

export default function AdminOrdersPage() {
  return <AdminOrders />;
}
