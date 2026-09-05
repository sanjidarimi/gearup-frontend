import { apiFetch } from "@/lib/api";
import { Category, CategoryApiResponse, ApiResponse } from "@/types/category";

export const getCategory = async (): Promise<Category[]> => {
  const res = await apiFetch<CategoryApiResponse>("/categories");

  return res.data ?? [];
};

export const createCategory = async (
  data: Record<string, string>,
): Promise<ApiResponse<Category>> => {
  return apiFetch<ApiResponse<Category>>("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
