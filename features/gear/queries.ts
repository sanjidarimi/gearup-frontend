"use client";
import { getGear, getGearById } from "@/services/gear-api";
import { SingleGearResponse } from "@/types/gear";
import { useQuery } from "@tanstack/react-query";

export const useGears = () => {
  const allGear = useQuery({ queryKey: ["gears"], queryFn: getGear });
  return allGear;
};

export const useSingleGear = (id: string) => {
  const singleGear = useQuery<SingleGearResponse, Error>({
    queryKey: ["gear", id],
    queryFn: () => getGearById(id),
    enabled: Boolean(id),
  });
  return singleGear;
};
