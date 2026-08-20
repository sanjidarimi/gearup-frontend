import { apiFetch } from "@/lib/api";
import { GearResponse, SingleGearResponse } from "@/types/gear";

export const getGear = async () => {
  const res = await apiFetch<GearResponse>("/gear");
  return res;
};

export const getGearById = async (id: string): Promise<SingleGearResponse> => {
  return await apiFetch<SingleGearResponse>(`/gear/${id}`);
};
