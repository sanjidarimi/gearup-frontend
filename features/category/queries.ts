import { getCategory } from "@/services/category-api";
import { useQuery } from "@tanstack/react-query";

export const useCategory = () => {
  const allCategory = useQuery({
    queryKey: ["category"],
    queryFn: getCategory,
  });
  return allCategory;
};
