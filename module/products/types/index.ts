import { Pagination } from "@/lib/api-types";

export interface Product {
  id: number;
  company_id: number;
  category_id: number;
  name: string;
  sku: string;
  image: string | null;
  unit_name: string;
  price: string;
  description: string | null;
  is_available: boolean;
}

export interface ProductsListParams {
  category_id?: number;
  q?: string;
}

export interface ProductsListResponse {
  success: boolean;
  message: string;
  data: { products: Product[]; pagination: Pagination };
}

export interface ProductDetailResponse {
  success: boolean;
  message: string;
  data: { product: Product };
}
