export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export type CategoryApiResponse = ApiResponse<Category[]>;
