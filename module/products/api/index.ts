import api from "@/lib/axios";
import {
  ProductsListParams,
  ProductsListResponse,
  ProductDetailResponse,
} from "../types";

export async function getProductsByCompany(
  companyId: number,
  params: ProductsListParams = {},
): Promise<ProductsListResponse> {
  const { data } = await api.get<ProductsListResponse>(
    `/customers/companies/${companyId}/products/`,
    { params },
  );
  return data;
}

export async function getProductById(
  companyId: number,
  productId: number,
): Promise<ProductDetailResponse> {
  const { data } = await api.get<ProductDetailResponse>(
    `/customers/companies/${companyId}/products/${productId}/`,
  );
  return data;
}
