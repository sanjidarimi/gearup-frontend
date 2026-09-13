import { PaymentInitiation } from "@/components/customer/payment-initiation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pay for rental",
};

export default async function PayForOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PaymentInitiation orderId={id} />;
}
