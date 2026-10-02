import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Royal V Properties. Visit our office in Guntur or speak to our real estate consultants for Guntur, Vijayawada & AP Capital Region properties.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800 mb-4">
            <Building2 className="h-3.5 w-3.5" />
            Established in 2006 · Guntur, AP
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Let&apos;s Connect with Our <br />
            <span className="bg-gradient-to-r from-emerald-950 via-emerald-800 to-amber-700 bg-clip-text text-transparent">
              Property Advisory Team
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Whether you are looking to discover residential plots, luxury villas, apartments, or list your property for verified buyers in Andhra Pradesh, our team is here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Office Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-700" />
                Head Office Location
              </h2>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-slate-800">Royal V Properties</p>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    SVN Colony,<br />
                    Guntur, Andhra Pradesh — 522006, India
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-start gap-3">
                  <Phone className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div>
                      <a href="tel:+919885839645" className="font-bold text-slate-900 hover:text-emerald-800 text-sm">
                        +91 98858 39645
                      </a>
                      <span className="text-xs text-emerald-700 ml-1.5 font-semibold">(Primary Hotline)</span>
                    </div>
                    <div className="text-xs text-slate-600 flex items-center gap-2">
                      <span className="font-semibold text-slate-500">Secondary:</span>
                      <a href="tel:+919700071279" className="hover:text-emerald-800 font-medium">
                        +91 97000 71279
                      </a>
                      <span>·</span>
                      <a href="tel:+919491796224" className="hover:text-emerald-800 font-medium">
                        +91 94917 96224
                      </a>
                    </div>
                    <p className="text-[11px] text-slate-500">Mon – Sat, 9:30 AM to 7:00 PM IST</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-start gap-3">
                  <Mail className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <a href="mailto:royalvproperties@gmail.com" className="font-medium text-slate-900 hover:text-emerald-800">
                      royalvproperties@gmail.com
                    </a>
                    <p className="text-xs text-slate-500">Response within 24 business hours</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-start gap-3">
                  <Clock className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Working Hours</p>
                    <p className="text-xs text-slate-500">Monday – Saturday: 9:30 AM – 7:00 PM</p>
                    <p className="text-xs text-slate-500">Sunday: By Prior Appointment</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100">
                <a
                  href="https://wa.me/919885839645?text=Hello%20Royal%20V%20Properties%2C%20I%20would%20like%20to%20enquire%20about%20properties."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-4 text-sm transition-colors shadow-sm"
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat on WhatsApp (+91 98858 39645)
                </a>
              </div>
            </div>

            {/* Service Areas */}
            <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-white mb-3">Service Coverage</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                We actively operate across key urban and developing hubs in Andhra Pradesh:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {["Guntur City", "Vijayawada", "Amaravati Capital Region", "Mangalagiri", "Tadepalli", "Tenali & Surroundings"].map((region) => (
                  <div key={region} className="flex items-center gap-1.5 text-slate-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span>{region}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Action Cards & Next Steps */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-900 mb-2">
                How Can We Help You Today?
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                Choose the direct path that matches your current real estate goal:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Discover Properties */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all flex flex-col justify-between">
                  <div>
                    <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-3">
                      <Building2 className="h-5 w-5 text-emerald-800" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">Buy / Discover Property</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Explore verified residential plots, apartments, independent houses and commercial spaces in Guntur & Vijayawada.
                    </p>
                  </div>
                  <Link href="/properties">
                    <Button variant="primary" size="sm" className="w-full justify-center">
                      Browse Listings
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                {/* Sell Property */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 hover:border-amber-200 hover:bg-amber-50/30 transition-all flex flex-col justify-between">
                  <div>
                    <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center mb-3">
                      <ShieldCheck className="h-5 w-5 text-amber-800" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">Sell Your Property</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Are you a property owner? Submit your listing directly for review and connect with genuine prospective buyers.
                    </p>
                  </div>
                  <Link href="/dashboard/submit-property">
                    <Button variant="gold" size="sm" className="w-full justify-center">
                      Submit for Listing
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Consultation details */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-3">What to expect when contacting us:</h4>
                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</div>
                    <p><strong className="text-slate-800">Clear Property Specifications:</strong> Direct access to verified listings with real location, price and document status clarity.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</div>
                    <p><strong className="text-slate-800">Direct In-Person Visits:</strong> Coordinated site inspections with local neighborhood insights and road accessibility checks.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</div>
                    <p><strong className="text-slate-800">Transparent Facilitation:</strong> No hidden terms, structured legal assistance, and guidance through title verification.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
