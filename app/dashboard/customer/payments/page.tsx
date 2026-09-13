import { PaymentHistory } from "@/components/customer/payment-history";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payments",
};

export default function CustomerPaymentsPage() {
  return <PaymentHistory />;
}
