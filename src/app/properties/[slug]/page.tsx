import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPropertyBySlug, isPropertySavedByUser } from "@/lib/queries/properties";
import { getCurrentUser } from "@/lib/auth/session";
import { EnquiryForm } from "@/components/properties/enquiry-form";
import { SavePropertyButton } from "@/components/properties/save-property-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPriceINR, formatArea } from "@/lib/utils/formatters";
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  ShieldCheck,
  Phone,
  MessageSquare,
  ArrowLeft,
  Calendar,
  Home,
  Building2,
  CheckCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface PropertyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return { title: "Property Not Found" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://royalvproperties.com";

  return {
    title: `${property.title} | Royal V Properties`,
    description: `${property.propertyType.replace(/_/g, " ")} in ${property.locality}, ${property.city}. ${property.description.slice(0, 150)}`,
    alternates: {
      canonical: `${siteUrl}/properties/${property.slug}`,
    },
    openGraph: {
      title: `${property.title} | Royal V Properties`,
      description: `${property.propertyType.replace(/_/g, " ")} in ${property.locality}, ${property.city}`,
      url: `${siteUrl}/properties/${property.slug}`,
      siteName: "Royal V Properties",
      images: property.images[0]?.url ? [{ url: property.images[0].url, alt: property.title }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: property.title,
      description: `${property.propertyType.replace(/_/g, " ")} in ${property.locality}, ${property.city}`,
      images: property.images[0]?.url ? [property.images[0].url] : [],
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = await params;
  const [property, user] = await Promise.all([
    getPropertyBySlug(slug),
    getCurrentUser(),
  ]);

  if (!property) {
    notFound();
  }

  const isSaved = user ? await isPropertySavedByUser(user.id, property.id) : false;

  const amenities = Array.isArray(property.amenities)
    ? (property.amenities as string[])
    : [];

  const featuredImage =
    property.images.find((img) => img.isFeatured) ||
    property.images[0];
  const galleryImages = property.images.filter(
    (img) => img.id !== featuredImage?.id
  );

  const specs: { icon: React.ReactNode; label: string; value: string }[] = [
    ...(property.bedrooms
      ? [{ icon: <BedDouble className="h-4 w-4" />, label: "Bedrooms", value: `${property.bedrooms} BHK` }]
      : []),
    ...(property.bathrooms
      ? [{ icon: <Bath className="h-4 w-4" />, label: "Bathrooms", value: `${property.bathrooms}` }]
      : []),
    ...(property.builtUpAreaSqFt || property.plotAreaSqYards
      ? [
          {
            icon: <Maximize2 className="h-4 w-4" />,
            label: "Area",
            value: formatArea(property.builtUpAreaSqFt, property.plotAreaSqYards, property.plotAreaCents),
          },
        ]
      : []),
    ...(property.floorNumber !== null && property.floorNumber !== undefined
      ? [
          {
            icon: <Building2 className="h-4 w-4" />,
            label: "Floor",
            value: `${property.floorNumber}${property.totalFloors ? ` / ${property.totalFloors}` : ""}`,
          },
        ]
      : []),
    ...(property.facing
      ? [{ icon: <Home className="h-4 w-4" />, label: "Facing", value: property.facing.replace(/_/g, " ") }]
      : []),
    ...(property.furnishing
      ? [{ icon: <Home className="h-4 w-4" />, label: "Furnishing", value: property.furnishing.replace(/_/g, " ") }]
      : []),
    ...(property.ageOfProperty !== null && property.ageOfProperty !== undefined
      ? [{ icon: <Calendar className="h-4 w-4" />, label: "Property Age", value: `${property.ageOfProperty} year${property.ageOfProperty !== 1 ? "s" : ""}` }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/properties" className="flex items-center gap-1 hover:text-emerald-700 font-medium">
            <ArrowLeft className="h-3.5 w-3.5" />
            Properties
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-medium truncate">{property.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Image Gallery + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Image */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-200 aspect-[16/9] w-full">
              {featuredImage ? (
                <Image
                  src={featuredImage.url}
                  alt={featuredImage.altText || property.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                  <Building2 className="h-16 w-16 text-slate-300" />
                </div>
              )}

              {/* Overlay badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Badge variant="slate" className="bg-slate-900/80 backdrop-blur-sm text-white text-xs">
                  {property.propertyType.replace(/_/g, " ")}
                </Badge>
                {property.isFeatured && (
                  <Badge variant="gold" className="text-xs">Featured</Badge>
                )}
                {property.isVerified && (
                  <Badge variant="success" className="gap-1 text-xs">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </Badge>
                )}
              </div>

              {/* Save button */}
              <div className="absolute top-4 right-4">
                <SavePropertyButton
                  propertyId={property.id}
                  initialSaved={isSaved}
                  isAuthenticated={!!user}
                />
              </div>
            </div>

            {/* Gallery thumbnails */}
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {galleryImages.slice(0, 4).map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-square rounded-xl overflow-hidden bg-slate-100"
                  >
                    <Image
                      src={img.url}
                      alt={img.altText || property.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform cursor-pointer"
                      sizes="25vw"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Property Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-800 mb-2">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {property.locality}, {property.city}
                    {property.pincode && <span className="text-slate-400 font-normal">– {property.pincode}</span>}
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
                    {property.title}
                  </h1>
                  {property.tagline && (
                    <p className="mt-1.5 text-slate-500">{property.tagline}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-slate-500 mb-1">Price</p>
                  <p className="text-2xl font-extrabold text-emerald-900">
                    {formatPriceINR(property.price, { priceOnRequest: property.priceOnRequest })}
                  </p>
                  {property.isNegotiable && (
                    <p className="text-xs text-amber-700 font-semibold mt-0.5">Negotiable</p>
                  )}
                </div>
              </div>

              {/* Quick Specs */}
              {specs.length > 0 && (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-center gap-2.5 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5"
                    >
                      <span className="text-slate-400 shrink-0">{spec.icon}</span>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          {spec.label}
                        </p>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* RERA */}
              {property.reraApproved && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-2.5 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="text-emerald-800 font-semibold">RERA Approved</span>
                  {property.reraNumber && (
                    <span className="text-emerald-600 text-xs font-mono">({property.reraNumber})</span>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-base font-bold text-slate-900 mb-4">About This Property</h2>
              <div className="prose prose-sm prose-slate max-w-none">
                {property.description.split("\n").map((para, i) => (
                  <p key={i} className="text-slate-600 leading-relaxed mb-3 last:mb-0">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="text-base font-bold text-slate-900 mb-4">Amenities &amp; Features</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-sm"
                    >
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span className="text-slate-700 font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Enquiry + Contact sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Quick Contact */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">
                Quick Contact
              </h3>
              <div className="flex flex-col gap-3">
                <a href="tel:+919885839645">
                  <Button variant="primary" size="md" className="w-full justify-center font-bold">
                    <Phone className="h-4 w-4" />
                    +91 98858 39645
                  </Button>
                </a>
                <a
                  href={`https://wa.me/919885839645?text=${encodeURIComponent(`Hi, I'm interested in: ${property.title} (${property.locality}, ${property.city})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full justify-center text-emerald-800 border-emerald-200 hover:bg-emerald-50"
                  >
                    <MessageSquare className="h-4 w-4" />
                    WhatsApp Us
                  </Button>
                </a>
              </div>
            </div>

            {/* Enquiry Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-1">Enquire About This Property</h3>
              <p className="text-xs text-slate-500 mb-5">
                No account required. We&apos;ll respond within 1 business day.
              </p>
              <EnquiryForm
                propertyId={property.id}
                propertyTitle={property.title}
                user={user}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
