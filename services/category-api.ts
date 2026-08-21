import { apiFetch } from "@/lib/api";
import { Category, CategoryApiResponse } from "@/types/category";

export const getCategory = async (): Promise<Category[]> => {
  const res = await apiFetch<CategoryApiResponse>("/categories");

  return res.data ?? [];
};
