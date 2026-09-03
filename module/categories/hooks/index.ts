"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api";

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    select: (res) => res.data.categories,
  });
}
