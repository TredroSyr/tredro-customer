import { Company } from "../../types";

export function CompanyStatsBar({ company }: { company: Company }) {
  return (
    <div className="mt-10 space-y-2">
      <h1 className="text-lg font-extrabold">{company.name}</h1>
      {(company.governorate || company.region) && (
        <p className="text-xs text-muted-foreground">
          {[company.governorate, company.region].filter(Boolean).join(" - ")}
        </p>
      )}
      {company.description && (
        <p className="text-xs leading-5 text-muted-foreground">{company.description}</p>
      )}
    </div>
  );
}
