"use client";

import { GearImage } from "@/components/gears/gear-image";
import { Button } from "@/components/ui/button";
import { needsReview, orderQuantity, orderTitle } from "@/lib/rental";
import type { RentalOrder } from "@/types/rental";
import { CreditCard, Eye, Star } from "lucide-react";
import Link from "next/link";
import { ReviewDialog } from "./review-dialog";

export function OrderGearCell({ order }: { order: RentalOrder }) {
  const first = order.items[0]?.gearItem;
  const quantity = orderQuantity(order);

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-muted">
        <GearImage
          src={first?.imageUrl}
          alt={first?.name ?? "Gear"}
          sizes="44px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">
          {orderTitle(order)}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {first?.brand ? `${first.brand} · ` : ""}
          {quantity} unit{quantity === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}

interface CustomerOrderActionsProps {
  order: RentalOrder;
  reviewedGearIds: Set<string>;
  showDetails?: boolean;
}

export function CustomerOrderActions({
  order,
  reviewedGearIds,
  showDetails = true,
}: CustomerOrderActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {order.status === "CONFIRMED" && (
        <Button asChild size="lg">
          <Link href={`/dashboard/customer/orders/${order.id}/pay`}>
            <CreditCard />
            Pay now
          </Link>
        </Button>
      )}

      {needsReview(order, reviewedGearIds) && (
        <ReviewDialog
          order={order}
          reviewedGearIds={reviewedGearIds}
          trigger={
            <Button size="lg" variant="secondary">
              <Star />
              Leave review
            </Button>
          }
        />
      )}

      {showDetails && (
        <Button asChild size="lg" variant="ghost">
          <Link href={`/dashboard/customer/orders/${order.id}`}>
            <Eye />
            Details
          </Link>
        </Button>
      )}
    </div>
  );
}
