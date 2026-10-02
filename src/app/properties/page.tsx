import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getPublishedProperties } from "@/lib/queries/properties";
import { getCurrentUser } from "@/lib/auth/session";
import { isPropertySavedByUser } from "@/lib/queries/properties";
import { PropertyCard } from "@/components/ui/property-card";
import { PropertyCardSkeleton } from "@/components/ui/skeleton";
import { PropertyFilters } from "@/components/properties/property-filters";
import { SavePropertyButton } from "@/components/properties/save-property-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { propertyFilterSchema } from "@/lib/validators/property";
import { Building2, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Browse Properties",
  description:
    "Find verified apartments, villas, plots and commercial properties in Guntur, Vijayawada and the AP Capital Region.",
};

interface PropertiesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function PropertyGrid({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const user = await getCurrentUser();

  // Parse and validate search params
  const raw = {
    query: typeof searchParams.query === "string" ? searchParams.query : undefined,
    city: typeof searchParams.city === "string" ? searchParams.city : undefined,
    locality: typeof searchParams.locality === "string" ? searchParams.locality : undefined,
    propertyType:
      typeof searchParams.propertyType === "string" ? searchParams.propertyType : undefined,
    listingCategory:
      typeof searchParams.listingCategory === "string"
        ? searchParams.listingCategory
        : undefined,
    minPrice: typeof searchParams.minPrice === "string" ? searchParams.minPrice : undefined,
    maxPrice: typeof searchParams.maxPrice === "string" ? searchParams.maxPrice : undefined,
    bedrooms: typeof searchParams.bedrooms === "string" ? searchParams.bedrooms : undefined,
    page: typeof searchParams.page === "string" ? searchParams.page : "1",
    sortBy: typeof searchParams.sortBy === "string" ? searchParams.sortBy : "newest",
    limit: "12",
  };

  const filters = propertyFilterSchema.parse(raw);
  const { properties, total, totalPages, page } = await getPublishedProperties(filters);

  // Check saved status for authenticated users
  const savedIds = new Set<string>();
  if (user) {
    await Promise.all(
      properties.map(async (p) => {
        const saved = await isPropertySavedByUser(user.id, p.id);
        if (saved) savedIds.add(p.id);
      })
    );
  }

  if (properties.length === 0) {
    return (
      <EmptyState
        icon={<Building2 className="h-10 w-10 text-slate-300" />}
        title="No properties found"
        description="Try adjusting your search or filter criteria to see more results."
        action={
          <Link href="/properties">
            <Button variant="outline" size="md">
              <ArrowLeft className="h-4 w-4" />
              Clear Filters
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <>
      <p className="text-sm text-slate-500 mb-4 font-medium">
        Showing <span className="font-bold text-slate-900">{total}</span> propert{total === 1 ? "y" : "ies"}
        {filters.city ? ` in ${filters.city}` : ""}
        {filters.query ? ` matching "${filters.query}"` : ""}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="relative group">
            <PropertyCard
              property={{
                id: property.id,
                title: property.title,
                slug: property.slug,
                tagline: property.tagline,
                propertyType: property.propertyType,
                price: property.price,
                priceOnRequest: property.priceOnRequest,
                city: property.city,
                locality: property.locality,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                builtUpAreaSqFt: property.builtUpAreaSqFt,
                plotAreaSqYards: property.plotAreaSqYards,
                plotAreaCents: property.plotAreaCents,
                isFeatured: property.isFeatured,
                isVerified: property.isVerified,
                imageUrl: property.images[0]?.url ?? null,
              }}
            />
            {/* Save button overlay */}
            <div className="absolute top-3 right-12 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <SavePropertyButton
                propertyId={property.id}
                initialSaved={savedIds.has(property.id)}
                isAuthenticated={!!user}
                size="sm"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/properties?${(() => {
                const p = new URLSearchParams();
                Object.entries(raw).forEach(([k, v]) => {
                  if (v !== undefined && v !== "") p.set(k, v);
                });
                p.set("page", String(page - 1));
                return p.toString();
              })()}`}
            >
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            </Link>
          )}

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Link
                  key={pageNum}
                  href={`/properties?${(() => {
                    const p = new URLSearchParams();
                    Object.entries(raw).forEach(([k, v]) => {
                      if (v !== undefined && v !== "") p.set(k, v);
                    });
                    p.set("page", String(pageNum));
                    return p.toString();
                  })()}`}
                >
                  <button
                    className={`h-9 w-9 rounded-lg text-sm font-semibold transition-colors ${
                      pageNum === page
                        ? "bg-emerald-900 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                </Link>
              );
            })}
          </div>

          {page < totalPages && (
            <Link
              href={`/properties?${(() => {
                const p = new URLSearchParams();
                Object.entries(raw).forEach(([k, v]) => {
                  if (v !== undefined && v !== "") p.set(k, v);
                });
                p.set("page", String(page + 1));
                return p.toString();
              })()}`}
            >
              <Button variant="outline" size="sm">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      )}
    </>
  );
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const resolvedParams = await searchParams;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2">
            Available Listings
          </p>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Properties in Guntur, Vijayawada &amp; AP Capital Region
          </h1>
          <p className="mt-1 text-slate-500 text-sm">
            Browse verified properties across Andhra Pradesh&apos;s prime locations.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-8 shadow-sm">
          <Suspense fallback={null}>
            <PropertyFilters />
          </Suspense>
        </div>

        {/* Property Grid */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <PropertyGrid searchParams={resolvedParams} />
        </Suspense>
      </div>
    </div>
  );
}
