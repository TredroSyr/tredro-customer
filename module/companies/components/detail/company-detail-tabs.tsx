"use client";

export type CompanyDetailTab = "products" | "invoices" | "orders" | "account" | "balance";

const TABS: { key: CompanyDetailTab; label: string }[] = [
  { key: "products", label: "المنتجات" },
  { key: "orders", label: "طلباتي" },
  { key: "invoices", label: "الفواتير" },
  { key: "balance", label: "الرصيد" },
  { key: "account", label: "حسابي" },
];

export function CompanyDetailTabs({
  value,
  onChange,
}: {
  value: CompanyDetailTab;
  onChange: (tab: CompanyDetailTab) => void;
}) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`shrink-0 rounded-2xl px-3.5 py-2 text-xs font-bold transition-colors ${
            value === tab.key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
