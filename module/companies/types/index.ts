import { Pagination } from "@/lib/api-types";

export interface Company {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  cover: string | null;
  category_id: number;
  rating: number;
  distance_km: number | null;
  is_open: boolean;
  description: string | null;
  governorate: string | null;
  region: string | null;
  delivery_fee: string;
  min_order: string;
}

export interface CompaniesListParams {
  category_id?: number;
  q?: string;
}

export interface CompaniesListResponse {
  success: boolean;
  message: string;
  data: { companies: Company[]; pagination: Pagination };
}

export interface CompanyDetailResponse {
  success: boolean;
  message: string;
  data: { company: Company };
}
