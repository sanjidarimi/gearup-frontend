"use client";

import { gearApi } from "@/services/gear-api";
import type { GearFilterParams } from "@/types/gear";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const gearKeys = {
  all: ["gear"] as const,
  list: (params: GearFilterParams) => ["gear", "list", params] as const,
  detail: (id: string) => ["gear", "detail", id] as const,
  reviews: (id: string) => ["gear", "reviews", id] as const,
};

export function useGears(params: GearFilterParams) {
  return useQuery({
    queryKey: gearKeys.list(params),
    queryFn: () => gearApi.getAll(params),
    placeholderData: keepPreviousData,
  });
}

// The API has no brands endpoint, so collect them from a wide catalog page.
export function useGearBrands() {
  return useQuery({
    queryKey: ["gear", "brands"],
    queryFn: () => gearApi.getAll({ limit: 200 }),
    select: (result) =>
      Array.from(
        new Set(
          result.data
            .map((item) => item.brand?.trim())
            .filter((brand): brand is string => Boolean(brand)),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    staleTime: 5 * 60_000,
  });
}

export function useGear(id: string) {
  return useQuery({
    queryKey: gearKeys.detail(id),
    queryFn: () => gearApi.getById(id),
    enabled: Boolean(id),
  });
}

// The reviews route sits behind customer auth on the backend, so guests get
// a 401 here. Keep it silent instead of bouncing them to the login page.
export function useGearReviews(id: string) {
  return useQuery({
    queryKey: gearKeys.reviews(id),
    queryFn: () => gearApi.getReviews(id),
    enabled: Boolean(id),
    retry: false,
    meta: { silent: true },
  });
}
