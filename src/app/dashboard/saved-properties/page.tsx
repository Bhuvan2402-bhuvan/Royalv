import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getCustomerSavedProperties } from "@/lib/queries/customer";
import { SavePropertyButton } from "@/components/properties/save-property-button";
import { formatPriceINR } from "@/lib/utils/formatters";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, ArrowRight, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Saved Properties",
  description: "Your saved and favourite properties on Royal V Properties.",
  robots: { index: false, follow: false },
};

export default async function SavedPropertiesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/dashboard/saved-properties");
  }
  const savedItems = await getCustomerSavedProperties(user.id);

  if (savedItems.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-16 shadow-sm">
        <EmptyState
          icon={<Heart className="h-10 w-10 text-slate-300" />}
          title="No saved properties yet"
          description="Browse our properties and click the heart icon to save the ones you like."
          action={
            <Link href="/properties">
              <Button variant="primary" size="md">
                <Building2 className="h-4 w-4" />
                Browse Properties
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h1 className="text-lg font-extrabold text-slate-900">Saved Properties</h1>
        <p className="text-sm text-slate-500 mt-1">
          {savedItems.length} saved propert{savedItems.length === 1 ? "y" : "ies"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {savedItems.map(({ id: savedId, property, createdAt }) => (
          <div
            key={savedId}
            className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative h-44 w-full bg-slate-100">
              {property.images[0]?.url ? (
                <Image
                  src={property.images[0].url}
                  alt={property.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Building2 className="h-10 w-10 text-slate-300" />
                </div>
              )}
              <div className="absolute top-3 right-3">
                <SavePropertyButton
                  propertyId={property.id}
                  initialSaved={true}
                  isAuthenticated={true}
                  size="sm"
                />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-800 mb-1">
                <MapPin className="h-3.5 w-3.5" />
                {property.locality}, {property.city}
              </div>
              <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mb-2">
                {property.title}
              </h3>
              <p className="text-base font-extrabold text-emerald-900 mb-3">
                {formatPriceINR(property.price, { priceOnRequest: property.priceOnRequest })}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Saved {new Date(createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </span>
                <Link href={`/properties/${property.slug}`}>
                  <Button variant="outline" size="sm" className="text-xs">
                    View Property
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
