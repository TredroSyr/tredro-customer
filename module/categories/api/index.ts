import api from "@/lib/axios";
import { CategoriesListResponse } from "../types";

export async function getCategories(
  companyId: number,
): Promise<CategoriesListResponse> {
  const { data } = await api.get<CategoriesListResponse>(
    `/customers/companies/${companyId}/categories/`,
  );
  return data;
}
