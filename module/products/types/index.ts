import { Pagination } from "@/lib/api-types";

export interface ProductCategory {
  id: number;
  name: string;
}

export interface ProductUnit {
  id: number;
  name: string;
  code: string;
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
}

export interface ProductPrice {
  amount: string;
  currency: string;
  is_category_specific: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  sku: string;
  brand: string | null;
  category: ProductCategory | null;
  unit: ProductUnit;
  primary_image: ProductImage | null;
  price: ProductPrice | null;
  is_taxable: boolean;
  tax_rate: string;
}

export interface ProductDetailImage extends ProductImage {
  sort_order: number;
}

export interface ProductCustomField {
  key: string;
  label: string;
  value: string;
}

export interface ProductDetail extends Product {
  barcode: string | null;
  weight: string | null;
  weight_unit: string | null;
  length: string | null;
  width: string | null;
  height: string | null;
  dimension_unit: string | null;
  images: ProductDetailImage[];
  custom_fields: ProductCustomField[];
}

export interface ProductsListParams {
  page?: number;
  category?: number;
  search?: string;
  brand?: string;
  ordering?: "name" | "-name" | "created_at" | "-created_at";
}

export interface ProductsListResponse {
  success: boolean;
  message: string;
  data: { products: Product[]; pagination: Pagination };
}

export interface ProductDetailResponse {
  success: boolean;
  message: string;
  data: { product: ProductDetail };
}
