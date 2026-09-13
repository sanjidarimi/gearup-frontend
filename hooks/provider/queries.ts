"use client";

import { getErrorMessage } from "@/lib/api-client";
import { RENTAL_STATUS_META } from "@/lib/constants";
import { providerApi } from "@/services/provider-api";
import type { Gear, GearPayload } from "@/types/gear";
import type { RentalOrder, RentalStatus } from "@/types/rental";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { gearKeys } from "../gear/queries";

export const providerKeys = {
  gear: ["provider", "gear"] as const,
  orders: ["provider", "orders"] as const,
};

export function useProviderGear() {
  return useQuery({
    queryKey: providerKeys.gear,
    queryFn: providerApi.getGear,
  });
}

export function useProviderOrders() {
  return useQuery({
    queryKey: providerKeys.orders,
    queryFn: providerApi.getOrders,
  });
}

interface SaveGearInput {
  payload: GearPayload;
  file?: File | null;
}

export function useCreateGear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, file }: SaveGearInput) =>
      providerApi.createGear(payload, file),
    onSuccess: (gear) => {
      toast.success("Gear listed", {
        description: `${gear.name} is now visible in the catalog.`,
      });
      queryClient.invalidateQueries({ queryKey: providerKeys.gear });
      queryClient.invalidateQueries({ queryKey: gearKeys.all });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdateGear(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, file }: SaveGearInput) =>
      providerApi.updateGear(id, payload, file),
    onSuccess: (gear) => {
      toast.success("Gear updated", {
        description: `Changes to ${gear.name} were saved.`,
      });
      queryClient.invalidateQueries({ queryKey: providerKeys.gear });
      queryClient.invalidateQueries({ queryKey: gearKeys.all });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useToggleGearAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      providerApi.updateGear(id, { isAvailable }),
    onMutate: async ({ id, isAvailable }) => {
      await queryClient.cancelQueries({ queryKey: providerKeys.gear });
      const previous = queryClient.getQueryData<Gear[]>(providerKeys.gear);
      queryClient.setQueryData<Gear[]>(providerKeys.gear, (items) =>
        items?.map((item) => (item.id === id ? { ...item, isAvailable } : item)),
      );
      return { previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(providerKeys.gear, context.previous);
      }
      toast.error(getErrorMessage(error));
    },
    onSuccess: (gear) => {
      toast.success(
        gear.isAvailable ? "Listing is live" : "Listing paused",
        { description: gear.name },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: providerKeys.gear });
      queryClient.invalidateQueries({ queryKey: gearKeys.all });
    },
  });
}

export function useDeleteGear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: providerApi.deleteGear,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: providerKeys.gear });
      const previous = queryClient.getQueryData<Gear[]>(providerKeys.gear);
      queryClient.setQueryData<Gear[]>(providerKeys.gear, (items) =>
        items?.filter((item) => item.id !== id),
      );
      return { previous };
    },
    onError: (error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(providerKeys.gear, context.previous);
      }
      toast.error(getErrorMessage(error, "Could not remove this gear"));
    },
    onSuccess: () => toast.success("Gear removed from your inventory"),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: providerKeys.gear });
      queryClient.invalidateQueries({ queryKey: gearKeys.all });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: RentalStatus }) =>
      providerApi.updateOrderStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: providerKeys.orders });
      const previous = queryClient.getQueryData<RentalOrder[]>(
        providerKeys.orders,
      );
      queryClient.setQueryData<RentalOrder[]>(providerKeys.orders, (orders) =>
        orders?.map((order) => (order.id === id ? { ...order, status } : order)),
      );
      return { previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(providerKeys.orders, context.previous);
      }
      toast.error(getErrorMessage(error, "Could not update the order"));
    },
    onSuccess: (_order, { status }) => {
      toast.success("Order updated", {
        description: `Status changed to ${RENTAL_STATUS_META[status].label}.`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: providerKeys.orders });
      queryClient.invalidateQueries({ queryKey: providerKeys.gear });
    },
  });
}
