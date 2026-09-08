"use client";

import Image from "next/image";
import { IconRenderer } from "@/assets/icons/iconRenderer";
import { Company } from "../types";

export function CompanyCard({
  company,
  onSelect,
}: {
  company: Company;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="w-full shrink-0 rounded-2xl border border-border bg-background/60 p-3.5 text-start transition-all hover:border-primary/50"
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-primary/12 text-primary">
          {company.logo ? (
            <Image
              src={company.logo}
              alt={company.name}
              width={44}
              height={44}
              className="size-full object-cover"
            />
          ) : (
            <IconRenderer name="store_filled" className="size-5" />
          )}
        </span>
        <div className="min-w-0">
          <h4 className="truncate text-sm font-bold">{company.name}</h4>
          {(company.governorate || company.region) && (
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
              {[company.governorate, company.region].filter(Boolean).join(" - ")}
            </p>
          )}
          {company.description && (
            <p className="mt-1.5 line-clamp-1 text-[11px] text-muted-foreground">
              {company.description}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
