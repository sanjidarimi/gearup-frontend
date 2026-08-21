import { getCategory } from "@/services/category-api";
import { Category } from "@/types/category";
import { useQuery } from "@tanstack/react-query";

export const useCategory = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategory,
  });
};
