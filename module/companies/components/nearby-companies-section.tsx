"use client";

import { useRouter } from "next/navigation";
import { SkeletonCard } from "@/components/ui/skeleton";
import { useCompaniesQuery } from "../hooks";
import { CompanyCard } from "./company-card";

export function NearbyCompaniesSection() {
  const router = useRouter();
  const { data: companies = [], isLoading } = useCompaniesQuery();

  const nearby = [...companies]
    .filter((c) => c.distance_km !== null)
    .sort((a, b) => (a.distance_km ?? 0) - (b.distance_km ?? 0))
    .slice(0, 5);

  if (!isLoading && nearby.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-extrabold">قريب منك</h2>
        <button
          type="button"
          onClick={() => router.push("/companies")}
          className="text-xs font-bold text-primary"
        >
          عرض الكل
        </button>
      </div>
      <div className="mt-2 flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {isLoading
          ? [1, 2, 3].map((i) => (
              <div key={i} className="w-64 shrink-0">
                <SkeletonCard />
              </div>
            ))
          : nearby.map((company) => (
              <div key={company.id} className="w-64 shrink-0">
                <CompanyCard
                  company={company}
                  onSelect={() => router.push(`/companies/detail?id=${company.id}`)}
                />
              </div>
            ))}
      </div>
    </section>
  );
}
