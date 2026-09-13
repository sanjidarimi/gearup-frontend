import { api } from "@/lib/api-client";
import type { AdminUser } from "@/types/admin";
import type { UserStatus } from "@/types/auth";
import type { RentalOrder } from "@/types/rental";

export const adminApi = {
  getUsers: async () => {
    const response = await api<AdminUser[]>("/admin/users");
    return response.data ?? [];
  },

  updateUserStatus: async (id: string, status: UserStatus) => {
    const response = await api<AdminUser>(`/admin/users/${id}`, {
      method: "PATCH",
      body: { status },
    });
    return response.data;
  },

  getRentals: async () => {
    const response = await api<RentalOrder[]>("/admin/rentals");
    return response.data ?? [];
  },
};
