import { api } from "@/lib/api-client";
import type { CreateReviewPayload, Review } from "@/types/review";

export const reviewApi = {
  create: async (payload: CreateReviewPayload) => {
    const response = await api<Review>("/review", {
      method: "POST",
      body: payload,
    });
    return response.data;
  },

  getMine: async () => {
    const response = await api<Review[]>("/review/my-reviews");
    return response.data ?? [];
  },

  remove: async (id: string) => {
    await api<null>(`/review/${id}`, { method: "DELETE" });
  },
};
