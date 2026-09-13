"use client";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { PROVIDER_ACTIONS } from "@/lib/constants";
import type { RentalOrder, RentalStatus } from "@/types/rental";
import { CheckCheck, Loader2, PackageCheck, Undo2 } from "lucide-react";

const ACTION_ICONS: Partial<Record<RentalStatus, typeof CheckCheck>> = {
  PLACED: CheckCheck,
  PAID: PackageCheck,
  PICKED_UP: Undo2,
};

interface OrderStatusActionsProps {
  order: RentalOrder;
  isUpdating: boolean;
  onUpdate: (status: RentalStatus) => Promise<unknown>;
}

export function OrderStatusActions({
  order,
  isUpdating,
  onUpdate,
}: OrderStatusActionsProps) {
  const action = PROVIDER_ACTIONS[order.status];
  const canCancel = order.status === "PLACED" || order.status === "CONFIRMED";
  const Icon = ACTION_ICONS[order.status] ?? CheckCheck;

  if (!action && !canCancel) {
    return (
      <span className="block text-right text-xs text-muted-foreground">
        {order.status === "RETURNED" ? "Completed" : "No actions"}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {action ? (
        <Button
          size="lg"
          disabled={isUpdating}
          onClick={() => onUpdate(action.next)}
        >
          {isUpdating ? <Loader2 className="animate-spin" /> : <Icon />}
          {action.label}
        </Button>
      ) : (
        <span className="text-xs text-muted-foreground">Waiting for payment</span>
      )}

      {canCancel && (
        <ConfirmDialog
          title="Cancel this rental?"
          description="The customer will see this order as cancelled. This can't be undone."
          confirmLabel="Cancel rental"
          destructive
          onConfirm={() => onUpdate("CANCELLED")}
          trigger={
            <Button size="lg" variant="ghost" disabled={isUpdating}>
              Cancel
            </Button>
          }
        />
      )}
    </div>
  );
}
