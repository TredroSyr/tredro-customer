import { Pagination } from "@/lib/api-types";

export interface Company {
  id: number;
  name: string;
  slug: string;
  currency: string;
  logo: string | null;
  cover: string | null;
  governorate: string | null;
  region: string | null;
  description: string | null;
  business_type: string | null;
}

export interface CompaniesListParams {
  page?: number;
  search?: string;
  business_type?: string;
  governorate?: string;
  region?: string;
  ordering?: "name" | "-name" | "created_at" | "-created_at";
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
