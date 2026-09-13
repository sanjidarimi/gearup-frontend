export interface GearCategory {
  id?: string;
  name: string;
}

export interface Gear {
  id: string;
  name: string;
  description?: string;
  brand: string | null;
  pricePerDay: number;
  stock: number;
  imageUrl: string | null;
  isAvailable: boolean;
  categoryId?: string;
  providerId?: string;
  createdAt?: string;
  updatedAt?: string;
  category?: GearCategory;
  provider?: { id: string; name: string; email?: string };
}

export interface GearFilterParams {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  isAvailable?: string;
  page?: number;
  limit?: number;
}

export interface GearPayload {
  name: string;
  description: string;
  brand: string;
  pricePerDay: number;
  stock: number;
  isAvailable: boolean;
  categoryId: string;
  imageUrl?: string;
}
