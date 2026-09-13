import type { RentalStatus } from "./rental";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface Payment {
  id: string;
  amount: number;
  transactionId: string | null;
  status: PaymentStatus;
  provider?: "STRIPE" | "SSLCOMMERZ";
  method?: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  rentalOrderId: string;
  rentalOrder?: {
    id: string;
    startDate: string;
    endDate: string;
    status: RentalStatus;
  };
}

export interface CheckoutSession {
  checkoutUrl: string;
  paymentId: string;
}

export interface PaymentConfirmation {
  status: "paid" | "unpaid" | "no_payment_required" | string;
  customerEmail?: string | null;
}
