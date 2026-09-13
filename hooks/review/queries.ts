"use client";

import { getErrorMessage } from "@/lib/api-client";
import { reviewApi } from "@/services/review-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";
import { gearKeys } from "../gear/queries";

export const reviewKeys = {
  mine: ["reviews", "mine"] as const,
};

export function useMyReviews(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: reviewKeys.mine,
    queryFn: reviewApi.getMine,
    enabled: options.enabled ?? true,
  });
}

export function useReviewedGearIds(options: { enabled?: boolean } = {}) {
  const query = useMyReviews(options);
  const ids = useMemo(
    () => new Set((query.data ?? []).map((review) => review.gearItemId)),
    [query.data],
  );
  return { ...query, ids };
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewApi.create,
    onSuccess: (review) => {
      toast.success("Thanks for the review!", {
        description: "Your feedback helps other renters choose well.",
      });
      queryClient.invalidateQueries({ queryKey: reviewKeys.mine });
      queryClient.invalidateQueries({
        queryKey: gearKeys.reviews(review.gearItemId),
      });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewApi.remove,
    onSuccess: () => {
      toast.success("Review deleted");
      queryClient.invalidateQueries({ queryKey: reviewKeys.mine });
      queryClient.invalidateQueries({ queryKey: gearKeys.all });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
