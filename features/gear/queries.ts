"use client";
import { getGear, getGearById } from "@/services/gear-api";
import { GearFilterParams, SingleGearResponse } from "@/types/gear";
import { useQuery } from "@tanstack/react-query";

export const useGears = (params: GearFilterParams) => {
  return useQuery({
    queryKey: ["gears", params],
    queryFn: () => getGear(params),
    select: (response) => response?.data ?? [],
  });
};
export const useSingleGear = (id: string) => {
  const singleGear = useQuery<SingleGearResponse, Error>({
    queryKey: ["gear", id],
    queryFn: () => getGearById(id),
    enabled: Boolean(id),
  });
  return singleGear;
};
