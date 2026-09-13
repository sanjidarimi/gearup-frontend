"use client";

import { useSession } from "@/components/session-provider";
import { EmptyState } from "@/components/shared/empty-state";
import { StarRating } from "@/components/shared/star-rating";
import { Skeleton } from "@/components/ui/skeleton";
import { useGearReviews } from "@/hooks/gear/queries";
import { formatDate, initials } from "@/lib/format";
import { Lock, MessageSquareText } from "lucide-react";
import Link from "next/link";

export function GearReviews({ gearId }: { gearId: string }) {
  const user = useSession();
  const { data, isLoading, isError } = useGearReviews(gearId);

  return (
    <section aria-labelledby="reviews-heading" className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="reviews-heading" className="text-xl font-bold text-foreground">
          Renter reviews
        </h2>
        {data && data.meta.totalReviews > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-3xl font-extrabold text-foreground">
              {data.meta.averageRating.toFixed(1)}
            </span>
            <div>
              <StarRating value={data.meta.averageRating} />
              <p className="text-xs text-muted-foreground">
                {data.meta.totalReviews} review
                {data.meta.totalReviews === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/40 p-5 text-sm text-muted-foreground">
          <Lock className="size-5 shrink-0 text-primary" />
          {user ? (
            <span>Reviews are visible to customer accounts.</span>
          ) : (
            <span>
              <Link
                href={`/auth/login?redirect=/gear/${gearId}`}
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </Link>{" "}
              to read what other renters say about this gear.
            </span>
          )}
        </div>
      ) : !data || data.reviews.length === 0 ? (
        <EmptyState
          icon={MessageSquareText}
          title="No reviews yet"
          description="Rent this gear and be the first to share how it performed."
          className="py-10"
        />
      ) : (
        <ul className="space-y-3">
          {data.reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                    {initials(review.customer?.name)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {review.customer?.name ?? "GearUp renter"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                <StarRating value={review.rating} size="sm" />
              </div>
              {review.comment && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {review.comment}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
