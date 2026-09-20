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

const UNIT_LABELS_AR: Record<string, string> = {
  piece: "قطعة",
  pieces: "قطعة",
  pcs: "قطعة",
  pc: "قطعة",
  unit: "وحدة",
  units: "وحدة",
  box: "علبة",
  carton: "كرتونة",
  pack: "علبة",
  packet: "باكيت",
  bag: "كيس",
  bottle: "زجاجة",
  can: "علبة",
  jar: "برطمان",
  dozen: "دزينة",
  pair: "زوج",
  set: "طقم",
  roll: "رول",
  sack: "شوال",
  gallon: "غالون",
  liter: "لتر",
  litre: "لتر",
  l: "لتر",
  milliliter: "مل",
  ml: "مل",
  kilogram: "كغ",
  kg: "كغ",
  gram: "غ",
  g: "غ",
  ton: "طن",
  meter: "متر",
  metre: "متر",
  m: "متر",
  centimeter: "سم",
  cm: "سم",
};

/** Translates a unit name/code (e.g. "Liter", "kg") to Arabic; unknown units are returned unchanged. */
export function formatUnit(value: string | null | undefined, code?: string | null) {
  const candidates = [value, code];
  for (const candidate of candidates) {
    const label = candidate ? UNIT_LABELS_AR[candidate.trim().toLowerCase()] : undefined;
    if (label) return label;
  }
  return value ?? code ?? "";
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
