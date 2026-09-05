import { getCategory, createCategory } from "@/services/category-api";
import { Category } from "@/types/category";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const CATEGORY_KEYS = {
  all: ["categories"] as const,
};

export const useCategory = () => {
  return useQuery<Category[]>({
    queryKey: CATEGORY_KEYS.all,
    queryFn: getCategory,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, string>) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
    },
  });
};
