"use client";

import { getErrorMessage } from "@/lib/api-client";
import { adminApi } from "@/services/admin-api";
import type { AdminUser } from "@/types/admin";
import type { UserStatus } from "@/types/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const adminKeys = {
  users: ["admin", "users"] as const,
  rentals: ["admin", "rentals"] as const,
};

export function useAdminUsers() {
  return useQuery({
    queryKey: adminKeys.users,
    queryFn: adminApi.getUsers,
    retry: false,
  });
}

export function useAdminRentals() {
  return useQuery({
    queryKey: adminKeys.rentals,
    queryFn: adminApi.getRentals,
    retry: false,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      adminApi.updateUserStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: adminKeys.users });
      const previous = queryClient.getQueryData<AdminUser[]>(adminKeys.users);
      queryClient.setQueryData<AdminUser[]>(adminKeys.users, (users) =>
        users?.map((user) => (user.id === id ? { ...user, status } : user)),
      );
      return { previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(adminKeys.users, context.previous);
      }
      toast.error(getErrorMessage(error, "Could not update this account"));
    },
    onSuccess: (_user, { status }) => {
      toast.success(
        status === "SUSPENDED" ? "Account suspended" : "Account activated",
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users });
    },
  });
}
