import { OrderDetails } from "@/components/customer/order-details";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Rental details",
};

export default async function CustomerOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense>
      <OrderDetails orderId={id} />
    </Suspense>
  );
}
