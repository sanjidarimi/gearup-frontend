import { api } from "@/lib/api-client";
import type { CreateRentalPayload, RentalOrder } from "@/types/rental";

export const rentalApi = {
  create: async (payload: CreateRentalPayload) => {
    const response = await api<RentalOrder>("/rentals", {
      method: "POST",
      body: payload,
    });
    return response.data;
  },

  getMine: async () => {
    const response = await api<RentalOrder[]>("/my-rentals");
    return response.data ?? [];
  },

  getById: async (id: string) => {
    const response = await api<RentalOrder>(`/rentals/${id}`);
    return response.data;
  },
};
