import { z } from "zod";

export const reviewSchema = z.object({
  gearItemId: z.string().min(1, "Choose which item you're reviewing"),
  rating: z
    .number()
    .int()
    .min(1, "Pick a star rating")
    .max(5, "Ratings go up to 5 stars"),
  comment: z
    .string()
    .trim()
    .max(500, "Keep your review under 500 characters")
    .optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
