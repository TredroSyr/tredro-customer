"use client";

import { useQuery } from "@tanstack/react-query";
import { getCompanies, getCompanyById } from "../api";
import { CompaniesListParams } from "../types";

export function useCompaniesQuery(params: CompaniesListParams = {}) {
  return useQuery({
    queryKey: ["companies", params],
    queryFn: () => getCompanies(params),
    select: (res) => res.data.companies,
  });
}

export function useCompanyByIdQuery(id: number | null) {
  return useQuery({
    queryKey: ["company", id],
    queryFn: () => getCompanyById(id as number),
    select: (res) => res.data.company,
    enabled: id !== null,
  });
}
