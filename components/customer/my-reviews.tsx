"use client";

import { GearImage } from "@/components/gears/gear-image";
import { TableSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { StarRating } from "@/components/shared/star-rating";
import { Button } from "@/components/ui/button";
import { useMyRentals } from "@/hooks/rental/queries";
import { useDeleteReview, useReviewedGearIds } from "@/hooks/review/queries";
import { getErrorMessage } from "@/lib/api-client";
import { formatDate, formatDay } from "@/lib/format";
import { needsReview } from "@/lib/rental";
import { MessageSquareText, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { OrderGearCell } from "./order-bits";
import { ReviewDialog } from "./review-dialog";

export function MyReviews() {
  const reviews = useReviewedGearIds();
  const rentals = useMyRentals();
  const deleteReview = useDeleteReview();

  const awaiting = (rentals.data ?? []).filter((order) =>
    needsReview(order, reviews.ids),
  );

  return (
    <>
      <PageHeader
        title="Reviews"
        description="Share how returned gear performed and manage the reviews you've written."
      />

      {awaiting.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Waiting for your review
          </h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {awaiting.map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <div className="min-w-0 space-y-1">
                  <OrderGearCell order={order} />
                  <p className="pl-14 text-xs text-muted-foreground">
                    Returned · {formatDay(order.endDate)}
                  </p>
                </div>
                <ReviewDialog
                  order={order}
                  reviewedGearIds={reviews.ids}
                  trigger={
                    <Button size="lg">
                      <Star />
                      Review
                    </Button>
                  }
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Your reviews</h2>

        {reviews.isLoading ? (
          <TableSkeleton rows={3} />
        ) : reviews.isError ? (
          <ErrorState
            message={getErrorMessage(reviews.error)}
            onRetry={() => reviews.refetch()}
          />
        ) : (reviews.data ?? []).length === 0 ? (
          <EmptyState
            icon={MessageSquareText}
            title="No reviews yet"
            description="Once gear is marked as returned, you can rate it here or from your rentals list."
          />
        ) : (
          <ul className="space-y-3">
            {(reviews.data ?? []).map((review) => (
              <li
                key={review.id}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row"
              >
                <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <GearImage
                    src={review.gearItem?.imageUrl}
                    alt={review.gearItem?.name ?? "Gear"}
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/gear/${review.gearItemId}`}
                        className="font-semibold text-foreground hover:text-primary"
                      >
                        {review.gearItem?.name ?? "Gear item"}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {review.gearItem?.brand ?? "Independent brand"} ·{" "}
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                    <StarRating value={review.rating} />
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {review.comment || "No written comment."}
                  </p>
                </div>
                <ConfirmDialog
                  title="Delete this review?"
                  description="It will be removed from the gear page. You can write a new one afterwards."
                  confirmLabel="Delete review"
                  destructive
                  onConfirm={() =>
                    deleteReview.mutateAsync(review.id).catch(() => undefined)
                  }
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon-lg"
                      aria-label="Delete review"
                      className="self-start text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 />
                    </Button>
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
