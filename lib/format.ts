/** Latin (Western) digits everywhere, even inside Arabic-locale formatting — keeps numbers consistent instead of mixing Eastern Arabic-Indic and Latin digits. */
const NUMBERING_SYSTEM = { numberingSystem: "latn" } as const;

const CURRENCY_SYMBOLS: Record<string, string> = {
  SYP: "ل.س",
  USD: "$",
};

export function formatCurrency(value: string | number, currency: string = "SYP") {
  const n = typeof value === "string" ? parseFloat(value) : value;
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  return `${(Number.isFinite(n) ? n : 0).toLocaleString("ar-SY", NUMBERING_SYSTEM)} ${symbol}`;
}

export function formatQuantity(value: string) {
  const n = parseFloat(value);
  return (Number.isFinite(n) ? n : 0).toLocaleString("ar-SY", {
    maximumFractionDigits: 2,
    ...NUMBERING_SYSTEM,
  });
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ar-SY", NUMBERING_SYSTEM);
}
