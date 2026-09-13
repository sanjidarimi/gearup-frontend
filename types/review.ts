export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  customerId: string;
  gearItemId: string;
  customer?: { id: string; name: string };
  gearItem?: {
    id: string;
    name: string;
    brand: string | null;
    imageUrl: string | null;
  };
}

export interface GearReviews {
  reviews: Review[];
  meta: {
    averageRating: number;
    totalReviews: number;
  };
}

export interface CreateReviewPayload {
  gearItemId: string;
  rating: number;
  comment?: string;
}
