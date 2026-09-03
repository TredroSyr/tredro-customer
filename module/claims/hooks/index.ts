"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClaim, getClaimsByCompany } from "../api";
import { CreateClaimPayload } from "../types";

export function useClaimsByCompanyQuery(companyId: number | null) {
  return useQuery({
    queryKey: ["claims", companyId],
    queryFn: () => getClaimsByCompany(companyId as number),
    select: (res) => res.data.claims,
    enabled: companyId !== null,
  });
}

export function useCreateClaimMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateClaimPayload) => createClaim(payload),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["claims", variables.company_id] });
    },
  });
}
