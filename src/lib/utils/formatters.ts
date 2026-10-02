/**
 * Utility formatters for Indian Real Estate (INR Lakhs/Crores, Sq Ft, Sq Yards)
 */

/**
 * Formats a numeric price into standard Indian Rupee notation (e.g. ₹95 Lakhs, ₹2.65 Cr).
 */
export function formatPriceINR(
  price: number | string | { toNumber?: () => number; toString?: () => string } | null | undefined,
  options?: { priceOnRequest?: boolean; compact?: boolean }
): string {
  if (options?.priceOnRequest) {
    return "Price on Request";
  }

  if (price === null || price === undefined) {
    return "Price on Request";
  }

  const numeric =
    typeof price === "number"
      ? price
      : typeof price === "string"
      ? parseFloat(price)
      : typeof price === "object" && "toNumber" in price && typeof price.toNumber === "function"
      ? price.toNumber()
      : Number(price);

  if (isNaN(numeric) || numeric <= 0) {
    return "Price on Request";
  }

  if (numeric >= 10000000) {
    const crores = numeric / 10000000;
    return `₹${crores.toLocaleString("en-IN", { minimumFractionDigits: crores % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })} Cr`;
  }

  if (numeric >= 100000) {
    const lakhs = numeric / 100000;
    return `₹${lakhs.toLocaleString("en-IN", { minimumFractionDigits: lakhs % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })} Lakhs`;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numeric);
}

/**
 * Formats area values with appropriate units.
 */
export function formatArea(
  builtUpSqFt?: number | string | { toNumber?: () => number; toString?: () => string } | null,
  plotAreaSqYards?: number | string | { toNumber?: () => number; toString?: () => string } | null,
  plotAreaCents?: number | string | { toNumber?: () => number; toString?: () => string } | null
): string {
  const parseVal = (v: unknown): number | null => {
    if (v === null || v === undefined) return null;
    if (typeof v === "number") return v;
    if (typeof v === "string") {
      const n = parseFloat(v);
      return isNaN(n) ? null : n;
    }
    if (typeof v === "object" && v !== null && "toNumber" in v && typeof (v as { toNumber: () => number }).toNumber === "function") {
      return (v as { toNumber: () => number }).toNumber();
    }
    const n = Number(v);
    return isNaN(n) ? null : n;
  };

  const builtUp = parseVal(builtUpSqFt);
  if (builtUp) {
    return `${builtUp.toLocaleString("en-IN")} sq.ft`;
  }
  const plotYards = parseVal(plotAreaSqYards);
  if (plotYards) {
    return `${plotYards.toLocaleString("en-IN")} sq.yds`;
  }
  const plotCentsVal = parseVal(plotAreaCents);
  if (plotCentsVal) {
    return `${plotCentsVal.toLocaleString("en-IN")} Cents`;
  }
  return "Area On Request";
}

/**
 * Formats a date into a clean, human-readable string.
 */
export function formatDate(date: Date | string | number | null | undefined): string {
  if (!date) return "—";
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}
