"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { PropertyType } from "@prisma/client";
import { Search, SlidersHorizontal, X } from "lucide-react";

const PROPERTY_TYPE_OPTIONS: { value: PropertyType | ""; label: string }[] = [
  { value: "", label: "All Types" },
  { value: "APARTMENT", label: "Apartment" },
  { value: "VILLA", label: "Villa" },
  { value: "INDEPENDENT_HOUSE", label: "Independent House" },
  { value: "OPEN_PLOT", label: "Open Plot" },
  { value: "RESIDENTIAL_PLOT", label: "Residential Plot" },
  { value: "COMMERCIAL_SPACE", label: "Commercial Space" },
  { value: "COMMERCIAL_BUILDING", label: "Commercial Building" },
  { value: "COMMERCIAL_PLOT", label: "Commercial Plot" },
  { value: "AGRICULTURAL_LAND", label: "Agricultural Land" },
  { value: "FARM_HOUSE", label: "Farm House" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "featured", label: "Featured First" },
];

const CITY_OPTIONS = ["Guntur", "Vijayawada", "Mangalagiri", "Tadepalli"];

export function PropertyFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const createQueryString = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      // Reset page when filters change
      if (!("page" in updates)) {
        params.delete("page");
      }
      return params.toString();
    },
    [searchParams]
  );

  const updateFilter = (key: string, value: string | undefined) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString({ [key]: value })}`, {
        scroll: false,
      });
    });
  };

  const clearAllFilters = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const hasActiveFilters =
    searchParams.has("query") ||
    searchParams.has("city") ||
    searchParams.has("propertyType") ||
    searchParams.has("minPrice") ||
    searchParams.has("maxPrice");

  return (
    <div className={`transition-opacity ${isPending ? "opacity-60" : "opacity-100"}`}>
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by title, location, area…"
          defaultValue={searchParams.get("query") || ""}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateFilter("query", (e.target as HTMLInputElement).value || undefined);
            }
          }}
          onBlur={(e) => {
            const val = e.target.value;
            const current = searchParams.get("query") || "";
            if (val !== current) {
              updateFilter("query", val || undefined);
            }
          }}
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters:</span>
        </div>

        {/* City */}
        <select
          value={searchParams.get("city") || ""}
          onChange={(e) => updateFilter("city", e.target.value || undefined)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
        >
          <option value="">All Cities</option>
          {CITY_OPTIONS.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        {/* Property Type */}
        <select
          value={searchParams.get("propertyType") || ""}
          onChange={(e) => updateFilter("propertyType", e.target.value || undefined)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
        >
          {PROPERTY_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Min Price */}
        <input
          type="number"
          placeholder="Min Price (₹)"
          defaultValue={searchParams.get("minPrice") || ""}
          className="w-36 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          onBlur={(e) => updateFilter("minPrice", e.target.value || undefined)}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateFilter("minPrice", (e.target as HTMLInputElement).value || undefined);
          }}
          min={0}
        />

        {/* Max Price */}
        <input
          type="number"
          placeholder="Max Price (₹)"
          defaultValue={searchParams.get("maxPrice") || ""}
          className="w-36 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          onBlur={(e) => updateFilter("maxPrice", e.target.value || undefined)}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateFilter("maxPrice", (e.target as HTMLInputElement).value || undefined);
          }}
          min={0}
        />

        {/* Sort */}
        <select
          value={searchParams.get("sortBy") || "newest"}
          onChange={(e) => updateFilter("sortBy", e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer ml-auto"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-slate-500 hover:text-rose-600"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
