"use client"
import { getGear } from "@/services/gear-api";
import { useQuery } from "@tanstack/react-query";

export const useGears = () => {
  const allGear = useQuery({ queryKey: ["gears"], queryFn: getGear });
  return allGear;
};
