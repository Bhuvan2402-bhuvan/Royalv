import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getRecentProperties } from "@/lib/queries/properties";
import { PropertyCard } from "@/components/ui/property-card";
import { PropertyCardSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BRAND_CONFIG } from "@/lib/utils/constants";
import {
  MapPin,
  ArrowRight,
  CheckCircle2,
  Users,
  HandshakeIcon,
  Building2,
  PhoneCall,
} from "lucide-react";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Royal V Properties | Trusted Real Estate in Guntur & Vijayawada",
  description:
    "Find the right property with Royal V Properties. Trusted property services since 2006, serving Guntur, Vijayawada, and the AP Capital Region.",
};

async function FeaturedPropertiesSection() {
  const properties = await getRecentProperties(6);

  return (
    <section id="featured-properties" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2">
              Available Now
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900">Properties in Guntur &amp; Vijayawada</h2>
            <p className="mt-2 text-slate-500">
              Agency-vetted properties across Andhra Pradesh&apos;s prime locations.
            </p>
          </div>
          <Link href="/properties" className="shrink-0">
            <Button variant="outline" size="md">
              View All Properties
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-16 text-center">
            <Building2 className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">New listings coming soon.</p>
            <Link href="/contact" className="mt-4 inline-block text-sm font-semibold text-emerald-700 hover:underline">
              Contact us for available properties →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
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
            ))}
          </div>
        )}

        {properties.length > 0 && (
          <div className="mt-10 text-center">
            <Link href="/properties">
              <Button variant="primary" size="lg">
                Explore All Properties
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default async function HomePage() {
  return (
    <>
      {/* ─── HERO SECTION ─── */}
      <section
        id="hero"
        className="relative bg-slate-950 overflow-hidden"
        style={{ minHeight: "85vh" }}
      >
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80"
            alt="Premium property in Andhra Pradesh"
            fill
            className="object-cover opacity-30"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/60" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center min-h-[85vh] py-24">
          <div className="max-w-2xl">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 mb-7">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                Trusted Property Services Since 2006
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-white leading-[1.12]">
              Find the Right Property with{" "}
              <span className="text-amber-400">Royal V Properties</span>
            </h1>

            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-xl">
              Trusted property services since 2006, serving Guntur, Vijayawada, surrounding regions
              and the Capital area.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/properties">
                <Button
                  variant="gold"
                  size="lg"
                  className="text-base px-8 py-3.5 font-bold shadow-lg shadow-amber-900/30"
                >
                  Explore Properties
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base px-8 py-3.5 border-slate-600 bg-white/5 text-white hover:bg-white/10 hover:border-slate-400 hover:text-white backdrop-blur-sm"
                >
                  <PhoneCall className="h-4 w-4" />
                  Contact Us
                </Button>
              </Link>
            </div>

            {/* Region tags */}
            <div className="mt-10 flex flex-wrap gap-2">
              {["Guntur", "Vijayawada", "Mangalagiri", "Tadepalli", "AP Capital Region"].map(
                (area) => (
                  <Link
                    key={area}
                    href={`/properties?city=${encodeURIComponent(area)}`}
                    className="flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs font-semibold text-slate-300 hover:border-amber-500/50 hover:text-amber-300 transition-colors backdrop-blur-sm"
                  >
                    <MapPin className="h-3 w-3" />
                    {area}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROPERTIES SECTION ─── */}
      <Suspense
        fallback={
          <section className="py-20 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </section>
        }
      >
        <FeaturedPropertiesSection />
      </Suspense>

      {/* ─── REGIONS ─── */}
      <section id="regions" className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2">
              Our Service Area
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Properties Across Prime AP Locations
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BRAND_CONFIG.primaryRegions.map((region) => (
              <div
                key={region.id}
                className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 mb-4">
                  <MapPin className="h-5 w-5 text-emerald-700" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{region.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{region.tagline}</p>
                <div className="flex flex-wrap gap-1.5">
                  {region.featuredAreas.slice(0, 4).map((area) => (
                    <Link
                      key={area}
                      href={`/properties?locality=${encodeURIComponent(area)}`}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-emerald-100 hover:text-emerald-800 transition-colors"
                    >
                      {area}
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/properties?city=${encodeURIComponent(region.name)}`}
                  className="mt-5 flex items-center gap-1 text-xs font-bold text-emerald-800 group-hover:gap-2 transition-all"
                >
                  View Properties <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY ROYAL V ─── */}
      <section id="why-us" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-3">
                Why Royal V Properties
              </p>
              <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
                Local Expertise. Genuine Service.
              </h2>
              <p className="mt-4 text-slate-500 leading-relaxed">
                Established in 2006 and based in Guntur, we help property buyers and sellers across
                Andhra Pradesh navigate the market with honesty and clarity.
              </p>
              <ul className="mt-8 space-y-5">
                {[
                  {
                    icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
                    title: "Verified Listings",
                    desc: "Each property is individually verified by our team before being published.",
                  },
                  {
                    icon: <Users className="h-5 w-5 text-emerald-600" />,
                    title: "Direct Connections",
                    desc: "We connect buyers and sellers transparently without unnecessary intermediaries.",
                  },
                  {
                    icon: <HandshakeIcon className="h-5 w-5 text-emerald-600" />,
                    title: "End-to-End Support",
                    desc: "From site visits to documentation, we support you through the entire process.",
                  },
                  {
                    icon: <MapPin className="h-5 w-5 text-emerald-600" />,
                    title: "Deep Local Knowledge",
                    desc: "18+ years of experience across Guntur, Vijayawada localities and the Capital corridor.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* CTA Panel */}
            <div className="rounded-3xl bg-slate-900 p-8 lg:p-10 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">
                Get in Touch
              </p>
              <h3 className="text-2xl font-extrabold mb-3">Looking to Buy, Sell, or Invest?</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Contact our team for a conversation about your property needs — no pressure,
                no obligations.
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/properties">
                  <Button variant="gold" size="lg" className="w-full justify-center font-bold">
                    Explore Properties
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-center border-slate-700 bg-transparent text-white hover:bg-slate-800 hover:text-white hover:border-slate-600"
                  >
                    <PhoneCall className="h-4 w-4" />
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SELL PROPERTY CTA ─── */}
      <section id="sell-cta" className="py-14 bg-amber-50 border-y border-amber-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-start gap-5">
              <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-amber-100 border border-amber-200">
                <Building2 className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Have a Property to Sell?</h2>
                <p className="mt-1 text-slate-600 text-sm max-w-lg">
                  Submit your property details and our team will review it and reach out to discuss listing options.
                </p>
              </div>
            </div>
            <Link href="/dashboard/submit-property" className="shrink-0">
              <Button variant="gold" size="lg" className="font-bold whitespace-nowrap">
                Submit Your Property
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
