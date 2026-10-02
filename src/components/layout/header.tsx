import React from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { LogoutButton } from "@/components/auth/logout-button";
import { BRAND_CONFIG } from "@/lib/utils/constants";
import { Phone, LogIn, UserCircle, ShieldCheck } from "lucide-react";

export async function Header() {
  const user = await getCurrentUser();
  const isStaff = user && ["ADMIN", "SUPER_ADMIN", "PROPERTY_MANAGER"].includes(user.role);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-sm">
      {/* Top Micro-Strip */}
      <div className="hidden md:flex items-center justify-between bg-emerald-950 px-6 py-1.5 text-[11px] font-medium text-slate-300">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-semibold tracking-wide">Royal V Properties</span>
          <span className="text-slate-600">|</span>
          <span>Trusted Real Estate Since 2006</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="tel:+919885839645"
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <Phone className="h-3 w-3 text-emerald-400" />
            +91 98858 39645
          </a>
          <span className="text-slate-600">•</span>
          <span>Guntur &middot; Vijayawada &middot; AP Capital Region</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <BrandLogo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {BRAND_CONFIG.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-emerald-800 transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth / CTA Actions */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/properties">
            <Button variant="primary" size="sm">
              Explore Properties
            </Button>
          </Link>

          {user ? (
            <div className="flex items-center gap-2 pl-1">
              <Link
                href={isStaff ? "/admin" : "/dashboard"}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-emerald-300 transition-colors"
              >
                {isStaff ? (
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                ) : (
                  <UserCircle className="h-3.5 w-3.5 text-emerald-700" />
                )}
                <span className="max-w-[90px] truncate">{user.name.split(" ")[0]}</span>
              </Link>
              <LogoutButton variant="ghost" size="sm" />
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-1">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="h-3.5 w-3.5" />
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <MobileNav user={user} />
      </div>
    </header>
  );
}
