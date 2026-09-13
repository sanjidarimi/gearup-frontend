"use client";

import { getErrorMessage } from "@/lib/api-client";
import { categoryApi } from "@/services/category-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const categoryKeys = {
  all: ["categories"] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: categoryApi.getAll,
    staleTime: 5 * 60_000,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.create,
    onSuccess: (category) => {
      toast.success("Category created", {
        description: `"${category.name}" is now available to providers.`,
      });
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
