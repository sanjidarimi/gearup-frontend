import { api } from "@/lib/api-client";
import type {
  CheckoutSession,
  Payment,
  PaymentConfirmation,
} from "@/types/payment";

export const paymentApi = {
  createCheckout: async (rentalOrderId: string) => {
    const response = await api<CheckoutSession>("/payment/create", {
      method: "POST",
      body: { rentalOrderId },
    });
    return response.data;
  },

  confirm: async (sessionId: string) => {
    const response = await api<PaymentConfirmation>("/payment/confirm", {
      query: { session_id: sessionId },
    });
    return response.data;
  },

  getMine: async () => {
    const response = await api<Payment[]>("/payment");
    return response.data ?? [];
  },
};
