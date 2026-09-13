"use client";

import { StarRatingInput } from "@/components/shared/star-rating";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReview } from "@/hooks/review/queries";
import { reviewSchema } from "@/lib/validations/review";
import type { RentalOrder } from "@/types/rental";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface ReviewDialogProps {
  order: RentalOrder;
  reviewedGearIds: Set<string>;
  trigger: React.ReactNode;
}

export function ReviewDialog({
  order,
  reviewedGearIds,
  trigger,
}: ReviewDialogProps) {
  const pendingItems = order.items.filter(
    (item) => !reviewedGearIds.has(item.gearItemId),
  );

  const [open, setOpen] = useState(false);
  const [gearItemId, setGearItemId] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createReview = useCreateReview();

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setGearItemId(pendingItems[0]?.gearItemId ?? "");
      setRating(0);
      setComment("");
      setError(null);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = reviewSchema.safeParse({
      gearItemId,
      rating,
      comment: comment || undefined,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your review");
      return;
    }

    setError(null);
    createReview.mutate(
      {
        gearItemId: parsed.data.gearItemId,
        rating: parsed.data.rating,
        comment: parsed.data.comment || undefined,
      },
      { onSuccess: () => setOpen(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              How was your rental?
            </DialogTitle>
            <DialogDescription className="text-sm">
              Your review helps other renters and gives the provider useful
              feedback.
            </DialogDescription>
          </DialogHeader>

          {pendingItems.length > 1 && (
            <div className="space-y-2">
              <Label className="text-sm">Item</Label>
              <Select value={gearItemId} onValueChange={setGearItemId}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Choose an item" />
                </SelectTrigger>
                <SelectContent>
                  {pendingItems.map((item) => (
                    <SelectItem key={item.gearItemId} value={item.gearItemId}>
                      {item.gearItem?.name ?? "Gear item"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {pendingItems.length === 1 && (
            <p className="rounded-xl bg-muted/50 px-4 py-3 text-sm font-medium text-foreground">
              {pendingItems[0].gearItem?.name ?? "Gear item"}
            </p>
          )}

          <div className="space-y-2">
            <Label className="text-sm">Rating</Label>
            <StarRatingInput
              value={rating}
              onChange={setRating}
              disabled={createReview.isPending}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="review-comment" className="text-sm">
                Comment <span className="text-muted-foreground">(optional)</span>
              </Label>
              <span className="text-xs text-muted-foreground">
                {comment.length}/500
              </span>
            </div>
            <Textarea
              id="review-comment"
              value={comment}
              maxLength={500}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Condition of the gear, how it performed, pickup experience…"
              className="min-h-28 text-sm"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" disabled={createReview.isPending}>
              {createReview.isPending && <Loader2 className="animate-spin" />}
              Submit review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
