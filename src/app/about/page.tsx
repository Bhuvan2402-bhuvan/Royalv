import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Building2, HandshakeIcon, Search, MessageSquare, Phone, Quote, Award, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Royal V Properties has been providing trusted real estate services in Guntur and Vijayawada since 2006. Learn about our team and services.",
};

const SERVICES = [
  {
    icon: <Search className="h-6 w-6 text-emerald-700" />,
    title: "Property Buying Assistance",
    desc: "We help property buyers find, evaluate, and acquire the right property across Guntur, Vijayawada, and the AP Capital Region.",
  },
  {
    icon: <Building2 className="h-6 w-6 text-emerald-700" />,
    title: "Property Selling Assistance",
    desc: "We connect property owners with qualified, serious buyers — with document review support and genuine market guidance.",
  },
  {
    icon: <HandshakeIcon className="h-6 w-6 text-emerald-700" />,
    title: "Property Mediation",
    desc: "We act as a transparent intermediary between buyers and sellers, facilitating fair and well-documented transactions.",
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-emerald-700" />,
    title: "Property Consultation",
    desc: "Need advice on the local market, pricing, or investment prospects? Our team provides informed guidance based on years of local experience.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-slate-950 text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">
            About Royal V Properties
          </p>
          <h1 className="text-4xl font-extrabold leading-tight max-w-2xl">
            Trusted Property Services Since 2006
          </h1>
          <p className="mt-5 text-slate-300 max-w-xl leading-relaxed">
            Royal V Properties is a real estate agency based in Guntur, Andhra Pradesh. Since 2006,
            we have been helping buyers discover properties and assisting sellers in connecting with
            genuine buyers across Guntur, Vijayawada, and the AP Capital Region.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/properties">
              <Button variant="gold" size="lg" className="font-bold">
                Explore Properties <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-slate-700 bg-white/5 text-white hover:bg-white/10 hover:text-white hover:border-slate-500"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* About content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Who we are */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-3">
              Who We Are
            </p>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-4">
              A Guntur-Based Real Estate Agency
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                Royal V Properties is headquartered in Guntur, Andhra Pradesh. Established in 2006,
                we work with property buyers and sellers across Guntur, Vijayawada, and the surrounding regions
                including the AP Capital Region development corridor.
              </p>
              <p>
                Our work centres on property discovery and genuine enquiry generation — helping people find
                properties that match their requirements and helping property owners connect with serious buyers.
              </p>
              <p>
                We believe in straightforward, transparent service. We do not make unsupported claims about
                your property or the market. Our guidance is based on local knowledge and direct experience
                in the Andhra Pradesh real estate landscape.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Established", value: "2006" },
              { label: "Head Office", value: "Guntur, AP" },
              { label: "Service Regions", value: "3+ Areas" },
              { label: "Property Types", value: "Residential, Commercial, Land" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl bg-white border border-slate-200 p-5 text-center shadow-sm"
              >
                <p className="text-2xl font-extrabold text-emerald-900 mb-1">{item.value}</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Founder & Chairman Profile */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center relative z-10">
            {/* Chairman Photo Portrait */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-600 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-500" />
                <div className="relative h-80 sm:h-96 w-64 sm:w-72 rounded-2xl overflow-hidden border-2 border-amber-400/40 bg-slate-800 shadow-2xl">
                  <Image
                    src="/images/leadership/vvsr-krishna-prasad.jpg"
                    alt="V.V.S.R.Krishna Prasad - Founder & Chairman, Royal V Properties"
                    fill
                    className="object-cover object-top filter brightness-105 contrast-105 group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <p className="text-white font-extrabold text-sm drop-shadow-md">
                      V.V.S.R.Krishna Prasad
                    </p>
                    <p className="text-amber-400 text-xs font-semibold tracking-wider uppercase drop-shadow-sm">
                      Founder & Chairman
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chairman Vision & Details */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-bold text-amber-300">
                  <Award className="h-3.5 w-3.5" />
                  Leadership & Vision
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  V.V.S.R.Krishna Prasad
                </h2>
                <p className="text-amber-400 font-bold text-sm tracking-wide uppercase">
                  Founder and Chairman &middot; Royal V Properties
                </p>
              </div>

              <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xs">
                <Quote className="h-8 w-8 text-amber-400/40 absolute top-4 right-4" />
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed italic font-serif">
                  &ldquo;When we founded Royal V Properties in 2006, our goal was simple: to bring genuine trust, clear title documentation, and honest market guidance to real estate buyers and sellers across Andhra Pradesh. Over the past 18+ years, we have guided thousands of families, business owners, and investors in finding properties they can truly rely on.&rdquo;
                </p>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-amber-400">— V.V.S.R.Krishna Prasad</span>
                  <span>Established 2006 &middot; Guntur, AP</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 mb-1.5" />
                  <p className="font-bold text-white">100% Verified Titles</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Strict legal scrutiny for every listed property.</p>
                </div>

                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5">
                  <Building2 className="h-4 w-4 text-amber-400 mb-1.5" />
                  <p className="font-bold text-white">Regional Network</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Active coverage across Guntur, Vijayawada & Amaravati.</p>
                </div>

                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5">
                  <HandshakeIcon className="h-4 w-4 text-emerald-400 mb-1.5" />
                  <p className="font-bold text-white">Personal Commitment</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Direct founder-level oversight on transactions.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="https://wa.me/919885839645?text=Hello%20Mr.%20Krishna%20Prasad%2C%20I%20would%20like%20to%20consult%20regarding%20properties."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-3 text-xs transition-colors shadow-sm"
                >
                  <MessageSquare className="h-4 w-4" />
                  Connect on WhatsApp (+91 98858 39645)
                </a>

                <a
                  href="tel:+919885839645"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-3 text-xs border border-white/20 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-amber-400" />
                  Direct Call: +91 98858 39645
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Service Regions */}
        <section>
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2">
              Where We Operate
            </p>
            <h2 className="text-2xl font-extrabold text-slate-900">Our Service Area</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                region: "Guntur",
                desc: "Our primary base. We serve properties across all major localities in Guntur city and surrounding areas.",
                areas: ["Lakshmipuram", "Brodipet", "Ring Road", "Arundelpet", "Koretipadu"],
              },
              {
                region: "Vijayawada",
                desc: "Covering key residential and commercial areas across Vijayawada — the commercial capital of Andhra Pradesh.",
                areas: ["Benz Circle", "MG Road", "Kanuru", "Poranki", "Gollapudi"],
              },
              {
                region: "AP Capital Region",
                desc: "Serving the AP Capital Region development corridor including Mangalagiri, Tadepalli, and the Amaravati area.",
                areas: ["Mangalagiri", "Tadepalli", "Navuluru", "NH-16 Corridor"],
              },
            ].map((item) => (
              <div
                key={item.region}
                className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-5 w-5 text-emerald-700" />
                  <h3 className="font-bold text-slate-900">{item.region}</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{item.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.areas.map((area) => (
                    <span
                      key={area}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section>
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2">
              What We Do
            </p>
            <h2 className="text-2xl font-extrabold text-slate-900">Our Services</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 mb-4">
                  {service.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-slate-900 p-10 text-white text-center">
          <h2 className="text-2xl font-extrabold mb-3">Looking for a Property?</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Browse our available listings or contact our team for personalised property guidance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/properties">
              <Button variant="gold" size="lg" className="font-bold">
                Explore Properties <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-slate-700 bg-transparent text-white hover:bg-slate-800 hover:text-white"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
