"use client";

import { useState } from "react";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/tredro/empty-state";
import { ClaimCard } from "@/module/claims/components/claim-card";
import { ClaimFormDrawer } from "@/module/claims/components/claim-form-drawer";
import { useClaimsByCompanyQuery } from "@/module/claims/hooks";
import { Company } from "../../types";

export function CompanyClaimsTab({ company }: { company: Company }) {
  const { data: claims = [], isLoading } = useClaimsByCompanyQuery(company.id);
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="space-y-3 pb-6">
      <Button type="button" variant="outline" className="w-full" onClick={() => setFormOpen(true)}>
        <IconRenderer name="warning_outlined" className="size-4" />
        مطالبة جديدة
      </Button>

      {isLoading ? (
        <div className="space-y-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : claims.length === 0 ? (
        <EmptyState variant="claims" size="sm" />
      ) : (
        <div className="space-y-2">
          {[...claims].reverse().map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      )}

      <ClaimFormDrawer companyId={company.id} open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}
