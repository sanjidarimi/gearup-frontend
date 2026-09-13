import { api } from "@/lib/api-client";
import type { Paginated } from "@/types/api";
import type { Gear, GearFilterParams } from "@/types/gear";
import type { GearReviews } from "@/types/review";

export const gearApi = {
  getAll: async (params: GearFilterParams = {}) => {
    const response = await api<Paginated<Gear>>("/gear", { query: params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api<Gear>(`/gear/${id}`);
    return response.data;
  },

  getReviews: async (gearId: string) => {
    const response = await api<GearReviews>(`/review/gear/${gearId}`);
    return response.data;
  },
};
