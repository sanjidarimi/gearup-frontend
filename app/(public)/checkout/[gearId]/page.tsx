import { CheckoutView } from "@/components/rental/checkout-view";
import { fetchCategories, fetchGearById } from "@/services/gear-server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Checkout",
};

interface CheckoutPageProps {
  params: Promise<{ gearId: string }>;
  searchParams: Promise<{ from?: string; to?: string; qty?: string }>;
}

export default async function CheckoutPage({
  params,
  searchParams,
}: CheckoutPageProps) {
  const [{ gearId }, query] = await Promise.all([params, searchParams]);
  const [gear, categories] = await Promise.all([
    fetchGearById(gearId),
    fetchCategories(),
  ]);

  if (!gear) notFound();

  const categoryName =
    gear.category?.name ??
    categories.find((category) => category.id === gear.categoryId)?.name ??
    null;

  return (
    <CheckoutView
      gear={gear}
      categoryName={categoryName}
      initialFrom={query.from}
      initialTo={query.to}
      initialQuantity={Number(query.qty) || 1}
    />
  );
}
