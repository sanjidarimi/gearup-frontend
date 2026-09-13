import { PaymentSuccess } from "@/components/customer/payment-success";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Payment successful",
};

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentSuccess />
    </Suspense>
  );
}
