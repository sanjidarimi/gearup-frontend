"use client";

import { getErrorMessage } from "@/lib/api-client";
import { paymentApi } from "@/services/payment-api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const paymentKeys = {
  mine: ["payments", "mine"] as const,
  confirmation: (sessionId: string) =>
    ["payments", "confirmation", sessionId] as const,
};

export function useMyPayments() {
  return useQuery({
    queryKey: paymentKeys.mine,
    queryFn: paymentApi.getMine,
  });
}

export function usePaymentConfirmation(sessionId: string | null) {
  return useQuery({
    queryKey: paymentKeys.confirmation(sessionId ?? ""),
    queryFn: () => paymentApi.confirm(sessionId ?? ""),
    enabled: Boolean(sessionId),
    retry: 1,
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: paymentApi.createCheckout,
    onSuccess: (session) => {
      if (!session.checkoutUrl) {
        toast.error("Stripe did not return a checkout link. Please try again.");
        return;
      }
      toast.loading("Redirecting to secure checkout…");
      window.location.assign(session.checkoutUrl);
    },
    onError: (error) =>
      toast.error("Payment could not be started", {
        description: getErrorMessage(error),
      }),
  });
}
