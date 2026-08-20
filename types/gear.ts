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
  data: Gear[];
}
export interface SingleGearResponse {
  data: Gear;
}
