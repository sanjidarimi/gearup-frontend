import { api } from "@/lib/api-client";
import type { Gear, GearPayload } from "@/types/gear";
import type { RentalOrder, RentalStatus } from "@/types/rental";

// The backend accepts multipart data with the gear fields as a JSON string
// under "data", so numbers and booleans keep their types.
function toGearFormData(payload: Partial<GearPayload>, file?: File | null) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  if (file) formData.append("file", file);
  return formData;
}

export const providerApi = {
  getGear: async () => {
    const response = await api<Gear[]>("/provider/gear");
    return response.data ?? [];
  },

  createGear: async (payload: GearPayload, file?: File | null) => {
    const response = await api<Gear>("/provider/gear", {
      method: "POST",
      body: toGearFormData(payload, file),
    });
    return response.data;
  },

  updateGear: async (
    id: string,
    payload: Partial<GearPayload>,
    file?: File | null,
  ) => {
    const response = await api<Gear>(`/provider/gear/${id}`, {
      method: "PUT",
      body: toGearFormData(payload, file),
    });
    return response.data;
  },

  deleteGear: async (id: string) => {
    await api<null>(`/provider/gear/${id}`, { method: "DELETE" });
  },

  getOrders: async () => {
    const response = await api<RentalOrder[]>("/provider/orders");
    return response.data ?? [];
  },

  updateOrderStatus: async (id: string, status: RentalStatus) => {
    const response = await api<RentalOrder>(`/provider/orders/${id}`, {
      method: "PATCH",
      body: { status },
    });
    return response.data;
  },
};
