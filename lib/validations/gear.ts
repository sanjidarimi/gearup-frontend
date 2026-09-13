import { z } from "zod";

export const gearFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Keep the name under 100 characters"),
  brand: z
    .string()
    .trim()
    .min(1, "Brand is required")
    .max(50, "Keep the brand under 50 characters"),
  categoryId: z.string().min(1, "Choose a category"),
  description: z
    .string()
    .trim()
    .min(20, "Describe the gear in at least 20 characters")
    .max(2000, "Keep the description under 2000 characters"),
  pricePerDay: z
    .number({ error: "Enter a daily price" })
    .positive("Price must be greater than 0")
    .max(10000, "That price looks too high"),
  stock: z
    .number({ error: "Enter how many units you have" })
    .int("Stock must be a whole number")
    .min(0, "Stock can't be negative")
    .max(1000, "Stock can't exceed 1000"),
  isAvailable: z.boolean(),
  imageUrl: z.union([
    z.literal(""),
    z.url("Enter a valid image URL starting with https://"),
  ]),
});

export type GearFormValues = z.infer<typeof gearFormSchema>;

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
