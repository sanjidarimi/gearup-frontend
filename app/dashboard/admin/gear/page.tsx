import { AdminGear } from "@/components/admin/admin-gear";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gear moderation",
};

export default function AdminGearPage() {
  return <AdminGear />;
}
