import type { Gear } from "./gear";
import type { Payment } from "./payment";

export type RentalStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PAID"
  | "PICKED_UP"
  | "RETURNED"
  | "CANCELLED";

export interface RentalItem {
  id: string;
  quantity: number;
  price: number;
  rentalOrderId: string;
  gearItemId: string;
  gearItem?: Pick<Gear, "name"> & Partial<Gear>;
}

export interface RentalOrder {
  id: string;
  status: RentalStatus;
  startDate: string;
  endDate: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  customer?: { id: string; name: string; email?: string };
  items: RentalItem[];
  payment?: Payment | null;
}

export interface CreateRentalPayload {
  startDate: string;
  endDate: string;
  items: { gearItemId: string; quantity: number }[];
}
