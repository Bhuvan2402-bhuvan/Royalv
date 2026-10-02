import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPriceINR, formatArea } from "@/lib/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { MapPin, BedDouble, Bath, Maximize2, ShieldCheck, ArrowUpRight } from "lucide-react";
import { PropertyType } from "@prisma/client";

export interface PropertyCardData {
  id: string;
  title: string;
  slug: string;
  tagline?: string | null;
  propertyType: PropertyType;
  price: number | string | { toNumber?: () => number } | null;
  priceOnRequest?: boolean;
  city: string;
  locality: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  builtUpAreaSqFt?: number | string | { toNumber?: () => number } | null;
  plotAreaSqYards?: number | string | { toNumber?: () => number } | null;
  plotAreaCents?: number | string | { toNumber?: () => number } | null;
  isFeatured?: boolean;
  isVerified?: boolean;
  imageUrl?: string | null;
}

interface PropertyCardProps {
  property: PropertyCardData;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const displayImage =
    property.imageUrl ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

  const typeLabel = property.propertyType.replace(/_/g, " ");

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-300">
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <Image
          src={displayImage}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <Badge variant="slate" className="bg-slate-900/80 backdrop-blur-sm border-white/20 text-[11px] font-semibold">
            {typeLabel}
          </Badge>
          <div className="flex items-center gap-1.5">
            {property.isVerified && (
              <Badge variant="success" className="bg-emerald-900/90 text-emerald-100 backdrop-blur-sm border-emerald-400/30 gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified
              </Badge>
            )}
            {property.isFeatured && (
              <Badge variant="gold" className="bg-amber-500 text-slate-950 font-bold border-amber-300 text-[11px]">
                Featured
              </Badge>
            )}
          </div>
        </div>

        {/* Bottom Image Overlay: Price */}
        <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between text-white">
          <div>
            <span className="text-xs uppercase font-medium tracking-wider text-amber-300/90">Starting at</span>
            <p className="text-xl font-extrabold text-white drop-shadow-sm">
              {formatPriceINR(property.price, { priceOnRequest: property.priceOnRequest })}
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-200 bg-slate-900/70 px-2 py-0.5 rounded backdrop-blur-sm">
            {property.city}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Location */}
        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-800">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-700" />
          <span className="truncate">{property.locality}, {property.city}</span>
        </div>

        {/* Title */}
        <h3 className="mt-2 text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-800 transition-colors">
          {property.title}
        </h3>

        {property.tagline && (
          <p className="mt-1 text-xs text-slate-500 line-clamp-1">{property.tagline}</p>
        )}

        {/* Key Specifications Grid */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
          {property.bedrooms ? (
            <div className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="font-medium truncate">{property.bedrooms} BHK</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Maximize2 className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="font-medium truncate">{typeLabel}</span>
            </div>
          )}

          {property.bathrooms ? (
            <div className="flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="font-medium truncate">{property.bathrooms} Baths</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="font-medium truncate">Clear Title</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <Maximize2 className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="font-medium truncate">
              {formatArea(property.builtUpAreaSqFt, property.plotAreaSqYards, property.plotAreaCents)}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">ID: {property.id.slice(-6).toUpperCase()}</span>
          <Link
            href={`/properties/${property.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 group-hover:translate-x-0.5 transition-transform"
          >
            View Details
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
