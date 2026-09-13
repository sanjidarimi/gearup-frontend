"use client";

import { getErrorMessage } from "@/lib/api-client";
import { rentalApi } from "@/services/rental-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { gearKeys } from "../gear/queries";

export const rentalKeys = {
  mine: ["rentals", "mine"] as const,
  detail: (id: string) => ["rentals", "detail", id] as const,
};

export function useMyRentals(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: rentalKeys.mine,
    queryFn: rentalApi.getMine,
    enabled: options.enabled ?? true,
  });
}

export function useRental(id: string) {
  return useQuery({
    queryKey: rentalKeys.detail(id),
    queryFn: () => rentalApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateRental() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rentalApi.create,
    onSuccess: () => {
      toast.success("Rental request placed", {
        description:
          "We've notified the provider. You can pay once they confirm.",
      });
      queryClient.invalidateQueries({ queryKey: rentalKeys.mine });
      queryClient.invalidateQueries({ queryKey: gearKeys.all });
    },
    onError: (error) =>
      toast.error("Could not place your order", {
        description: getErrorMessage(error),
      }),
  });
}
