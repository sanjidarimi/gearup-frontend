import { gearApi } from "@/services/gear-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const GEAR_KEYS = {
  all: ["provider-gear"] as const,
};

export function useProviderGears() {
  return useQuery({
    queryKey: GEAR_KEYS.all,
    queryFn: () => gearApi.getProviderGears(),
    select: (response) => response.data,
  });
}

export function useCreateGear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => gearApi.createGear(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GEAR_KEYS.all });
    },
  });
}

export function useDeleteGear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => gearApi.deleteGear(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GEAR_KEYS.all });
    },
  });
}
