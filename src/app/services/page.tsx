import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Search,
  Building2,
  HandshakeIcon,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Royal V Properties provides property buying assistance, selling support, mediation, and consultation services across Guntur and Vijayawada.",
};

const SERVICES = [
  {
    icon: <Search className="h-7 w-7 text-emerald-700" />,
    title: "Property Buying Assistance",
    tagline: "Find the right property for you",
    desc: "We help buyers understand their options, evaluate properties, and make informed decisions. From initial enquiry to site visits, we are available to guide you through each step.",
    points: [
      "Access to verified property listings",
      "Assistance with site visits",
      "Guidance on documentation",
      "Honest, straightforward advice",
    ],
    cta: { label: "Explore Properties", href: "/properties" },
  },
  {
    icon: <Building2 className="h-7 w-7 text-emerald-700" />,
    title: "Property Selling Assistance",
    tagline: "Connect with genuine buyers",
    desc: "We list your property on our platform and connect you with genuine, qualified buyers. We focus on properties in Guntur, Vijayawada, and the AP Capital Region.",
    points: [
      "Property submission review",
      "Listing on Royal V Properties portal",
      "Buyer enquiry coordination",
      "Documentation support guidance",
    ],
    cta: { label: "Submit Your Property", href: "/dashboard/submit-property" },
  },
  {
    icon: <HandshakeIcon className="h-7 w-7 text-emerald-700" />,
    title: "Property Mediation",
    tagline: "Transparent facilitation",
    desc: "When buyer and seller are aligned, we act as a neutral facilitator to help both parties complete the transaction clearly and with proper documentation.",
    points: [
      "Neutral, transparent approach",
      "Communication facilitation",
      "Documentation process guidance",
      "Fair representation for both parties",
    ],
    cta: { label: "Contact Us", href: "/contact" },
  },
  {
    icon: <MessageSquare className="h-7 w-7 text-emerald-700" />,
    title: "Property Consultation",
    tagline: "Informed local guidance",
    desc: "Have questions about the Guntur or Vijayawada property market? Our team offers consultation services based on local expertise and direct experience in the region.",
    points: [
      "Local market guidance",
      "Property type suitability advice",
      "Location assessment",
      "No-pressure conversations",
    ],
    cta: { label: "Contact Us", href: "/contact" },
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-white border-b border-slate-200 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-3">
            What We Offer
          </p>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Our Property Services
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Royal V Properties provides end-to-end property services for buyers, sellers, and investors
            across Guntur, Vijayawada, and the AP Capital Region.
          </p>
        </div>
      </div>

      {/* Services */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        {SERVICES.map((service, idx) => (
          <div
            key={service.title}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm ${
              idx % 2 !== 0 ? "lg:flex-row-reverse" : ""
            }`}
          >
            <div className={idx % 2 !== 0 ? "lg:order-2" : ""}>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 mb-5">
                {service.icon}
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2">
                {service.tagline}
              </p>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-4">{service.title}</h2>
              <p className="text-slate-600 leading-relaxed mb-6">{service.desc}</p>
              <Link href={service.cta.href}>
                <Button variant="primary" size="md">
                  {service.cta.label}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className={`rounded-2xl bg-slate-50 border border-slate-200 p-6 ${idx % 2 !== 0 ? "lg:order-1" : ""}`}>
              <h3 className="text-sm font-bold text-slate-700 mb-4">What&apos;s included:</h3>
              <ul className="space-y-3">
                {service.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 font-medium">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="rounded-3xl bg-emerald-950 p-10 text-white text-center">
          <h2 className="text-2xl font-extrabold mb-3">Ready to Get Started?</h2>
          <p className="text-emerald-200 mb-8 max-w-md mx-auto">
            Browse available properties or contact our team to discuss your requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/properties">
              <Button variant="gold" size="lg" className="font-bold">
                Explore Properties
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-emerald-700 bg-transparent text-white hover:bg-emerald-900 hover:text-white"
              >
                Contact Royal V Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
