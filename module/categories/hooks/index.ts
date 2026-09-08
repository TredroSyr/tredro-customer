"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api";

export function useCategoriesQuery(companyId: number | null) {
  return useQuery({
    queryKey: ["categories", companyId],
    queryFn: () => getCategories(companyId as number),
    select: (res) => res.data.categories,
    enabled: companyId !== null,
  });
}
