"use client";

import { IconRenderer } from "@/assets/icons/iconRenderer";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
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
      className={`w-full shrink-0 rounded-2xl border p-3.5 text-start transition-all hover:border-primary/50 ${
        company.is_open ? "border-border bg-background/60" : "border-border bg-muted/30 opacity-70"
      }`}
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
          <IconRenderer name="store_filled" className="size-5" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-sm font-bold">{company.name}</h4>
            {!company.is_open && <Badge variant="secondary">مغلق</Badge>}
          </div>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            {[company.governorate, company.region].filter(Boolean).join(" - ")}
          </p>
          <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1 font-bold text-foreground">
              <IconRenderer name="star_filled" className="size-3.5 text-warning" />
              {company.rating.toFixed(1)}
            </span>
            {company.distance_km !== null && (
              <span className="flex items-center gap-1">
                <IconRenderer name="location_outlined" className="size-3.5" />
                {company.distance_km} كم
              </span>
            )}
            <span className="flex items-center gap-1">
              <IconRenderer name="receipt_outlined" className="size-3.5" />
              {formatCurrency(company.delivery_fee)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
