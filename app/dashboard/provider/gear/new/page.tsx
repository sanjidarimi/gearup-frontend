import { GearForm } from "@/components/provider/gear-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add gear",
};

export default function NewGearPage() {
  return <GearForm mode="create" />;
}
