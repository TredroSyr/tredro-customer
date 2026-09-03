import { IconRenderer } from "@/assets/icons/iconRenderer";
import { formatCurrency } from "@/lib/format";
import { Company } from "../../types";

export function CompanyStatsBar({ company }: { company: Company }) {
  return (
    <div className="mt-10 space-y-2">
      <h1 className="text-lg font-extrabold">{company.name}</h1>
      <p className="text-xs text-muted-foreground">
        {[company.governorate, company.region].filter(Boolean).join(" - ")}
      </p>

      <div className="grid grid-cols-3 gap-2 pt-1 text-center">
        <div className="rounded-xl bg-secondary py-2.5">
          <p className="flex items-center justify-center gap-1 text-sm font-extrabold">
            <IconRenderer name="star_filled" className="size-3.5 text-warning" />
            {company.rating.toFixed(1)}
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">التقييم</p>
        </div>
        <div className="rounded-xl bg-secondary py-2.5">
          <p className="text-sm font-extrabold">{formatCurrency(company.delivery_fee)}</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">التوصيل</p>
        </div>
        <div className="rounded-xl bg-secondary py-2.5">
          <p className="text-sm font-extrabold">{formatCurrency(company.min_order)}</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">أدنى طلب</p>
        </div>
      </div>
    </div>
  );
}
