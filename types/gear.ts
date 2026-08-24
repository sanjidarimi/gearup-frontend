export interface GearCategory {
  id: string;
  name: string;
}
export interface Gear {
  id: string;
  name: string;
  price: string;
  brand: string;
  pricePerDay: number;
  stock: number;
  imageUrl: string;
  isAvailable: boolean;
  category: GearCategory;
}

export interface GearResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: Gear[];
    meta?: GearMeta;
  };
}
export interface SingleGearResponse {
  data: Gear;
}
export interface GearMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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
