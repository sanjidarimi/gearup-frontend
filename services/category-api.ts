import { api } from "@/lib/api-client";
import type { Category } from "@/types/category";

export const categoryApi = {
  getAll: async () => {
    const response = await api<Category[]>("/categories");
    return response.data ?? [];
  },

  create: async (payload: { name: string }) => {
    const response = await api<Category>("/categories", {
      method: "POST",
      body: payload,
    });
    return response.data;
  },
};
