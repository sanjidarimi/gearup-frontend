import { MyReviews } from "@/components/customer/my-reviews";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews",
};

export default function CustomerReviewsPage() {
  return <MyReviews />;
}
