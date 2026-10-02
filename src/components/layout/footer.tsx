import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Building2, MapPin, Phone, Mail, Share2, MessageSquare } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300">
      {/* Main Footer Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 — Brand Info */}
          <div className="lg:col-span-1">
            <BrandLogo variant="light" showTagline />
            <p className="mt-2 text-[11px] font-semibold text-emerald-400 tracking-wide uppercase">
              Branch of Varunya Tech
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 max-w-xs">
              Established in 2006, Royal V Properties is one of Guntur&apos;s most trusted real estate
              agencies. Connecting buyers, sellers, and investors across Guntur, Vijayawada, and the
              AP Capital Region.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-emerald-900 hover:text-emerald-400 transition-colors"
              >
                <Share2 className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/919885839645?text=Hello%20Royal%20V%20Properties"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-emerald-900 hover:text-emerald-400 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2 — Properties */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">Properties</h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: "All Properties", href: "/properties" },
                { label: "Apartments in Guntur", href: "/properties?propertyType=APARTMENT&city=Guntur" },
                { label: "Villas in Vijayawada", href: "/properties?propertyType=VILLA&city=Vijayawada" },
                { label: "Plots in Amaravati", href: "/properties?city=Mangalagiri&propertyType=RESIDENTIAL_PLOT" },
                { label: "Commercial Spaces", href: "/properties?propertyType=COMMERCIAL_SPACE" },
                { label: "Farm Houses", href: "/properties?propertyType=FARM_HOUSE" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-amber-400 transition-colors hover:underline underline-offset-4"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">Company</h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: "About Royal V Properties", href: "/about" },
                { label: "Our Services", href: "/services" },
                { label: "Contact Us", href: "/contact" },
                { label: "Sell Your Property", href: "/dashboard/submit-property" },
                { label: "Customer Portal", href: "/dashboard" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-amber-400 transition-colors hover:underline underline-offset-4"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-400 leading-relaxed">
                  SVN Colony,<br />
                  Guntur, Andhra Pradesh – 522006
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-1 text-slate-400">
                  <div>
                    <a
                      href="tel:+919885839645"
                      className="hover:text-amber-400 transition-colors font-medium text-white"
                    >
                      +91 98858 39645
                    </a>
                    <span className="text-xs text-emerald-400 ml-1.5 font-semibold">(Primary)</span>
                  </div>
                  <div className="text-xs space-x-2">
                    <a href="tel:+919700071279" className="hover:text-amber-400 transition-colors">
                      +91 97000 71279
                    </a>
                    <span>·</span>
                    <a href="tel:+919491796224" className="hover:text-amber-400 transition-colors">
                      +91 94917 96224
                    </a>
                  </div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-emerald-500 shrink-0" />
                <a
                  href="mailto:royalvproperties@gmail.com"
                  className="text-slate-400 hover:text-amber-400 transition-colors font-medium"
                >
                  royalvproperties@gmail.com
                </a>
              </li>
            </ul>

            {/* Office hours */}
            <div className="mt-5 rounded-xl bg-slate-900 border border-slate-800 p-4 text-xs">
              <p className="font-semibold text-slate-300 mb-2">Office Hours</p>
              <p className="text-slate-500">Mon – Sat: 9:00 AM – 7:00 PM</p>
              <p className="text-slate-500">Sunday: 10:00 AM – 5:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950/90">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-amber-500 shrink-0" />
              <span>
                &copy; {currentYear} Royal V Properties (Branch of Varunya Tech).
              </span>
            </div>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span>
              Developed &amp; Hosted by{" "}
              <a
                href="https://varunyatech.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
              >
                VarunyaTech (varunyatech.in)
              </a>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-amber-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-amber-400 transition-colors">
              Terms of Service
            </Link>
            <span className="text-slate-700">Est. 2006</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
