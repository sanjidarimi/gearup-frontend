import { InventoryTable } from "@/components/provider/inventory-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My gear",
};

export default function ProviderGearPage() {
  return <InventoryTable />;
}
