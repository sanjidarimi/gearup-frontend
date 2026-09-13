import { GearForm } from "@/components/provider/gear-form";
import { requireRole } from "@/lib/auth-guard";
import { fetchGearById } from "@/services/gear-server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit gear",
};

export default async function EditGearPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, user] = await Promise.all([params, requireRole("PROVIDER")]);
  const gear = await fetchGearById(id);

  // Providers can only edit their own listings.
  if (!gear || (gear.providerId && gear.providerId !== user.id)) notFound();

  return <GearForm mode="edit" gear={gear} />;
}
