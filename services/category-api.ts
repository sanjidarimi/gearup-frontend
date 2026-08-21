import { apiFetch } from "@/lib/api";

export const getCategory = async () => {
  const res = await apiFetch("/categories");
  return res;
};
