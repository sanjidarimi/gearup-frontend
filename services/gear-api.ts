import { apiFetch } from "@/lib/api";
import {
  GearFilterParams,
  GearResponse,
  SingleGearResponse,
} from "@/types/gear";

export const getGear = async (
  params: GearFilterParams,
): Promise<GearResponse> => {
  const queryParams = new URLSearchParams();

  if (params.search) queryParams.append("search", params.search);
  if (params.category && params.category !== "All")
    queryParams.append("category", params.category);
  if (params.brand && params.brand !== "All")
    queryParams.append("brand", params.brand);
  if (params.minPrice) queryParams.append("minPrice", params.minPrice);
  if (params.maxPrice) queryParams.append("maxPrice", params.maxPrice);
  if (params.isAvailable && params.isAvailable !== "All")
    queryParams.append("isAvailable", params.isAvailable);
  if (params.page) queryParams.append("page", String(params.page));
  if (params.limit) queryParams.append("limit", String(params.limit));

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/gear?${queryString}` : "/gear";

  return await apiFetch<GearResponse>(endpoint);
};

export const getGearById = async (id: string): Promise<SingleGearResponse> => {
  return await apiFetch<SingleGearResponse>(`/gear/${id}`);
};
