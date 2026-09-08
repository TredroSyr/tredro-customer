import api from "@/lib/axios";
import {
  CompaniesListParams,
  CompaniesListResponse,
  CompanyDetailResponse,
} from "../types";

export async function getCompanies(
  params: CompaniesListParams = {},
): Promise<CompaniesListResponse> {
  const { data } = await api.get<CompaniesListResponse>("/customers/companies/", {
    params,
  });
  return data;
}

export async function getCompanyById(id: number): Promise<CompanyDetailResponse> {
  const { data } = await api.get<CompanyDetailResponse>(
    `/customers/companies/${id}/`,
  );
  return data;
}
