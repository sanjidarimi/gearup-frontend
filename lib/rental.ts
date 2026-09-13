import type { RentalOrder } from "@/types/rental";

export function orderTitle(order: RentalOrder) {
  const [first, ...rest] = order.items;
  if (!first) return "Rental order";
  const name = first.gearItem?.name ?? "Gear item";
  return rest.length > 0 ? `${name} + ${rest.length} more` : name;
}

export function orderQuantity(order: RentalOrder) {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function needsReview(order: RentalOrder, reviewedGearIds: Set<string>) {
  return (
    order.status === "RETURNED" &&
    order.items.some((item) => !reviewedGearIds.has(item.gearItemId))
  );
}
