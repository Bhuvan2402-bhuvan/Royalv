"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone, Building2, UserCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND_CONFIG } from "@/lib/utils/constants";
import { SessionUser } from "@/types/auth";

interface MobileNavProps {
  user: SessionUser | null;
}

export function MobileNav({ user }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white p-6 shadow-2xl z-50">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-900 text-amber-400">
                  <Building2 className="h-4 w-4" />
                </div>
                <span className="font-bold text-slate-900 text-sm">ROYAL V PROPERTIES</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 text-slate-700"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="mt-6 flex flex-col space-y-3">
              {BRAND_CONFIG.navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Secondary Actions */}
            <div className="mt-6 border-t border-slate-100 pt-6 space-y-3">
              <Link
                href="/dashboard/submit-property"
                onClick={() => setIsOpen(false)}
                className="block"
              >
                <Button variant="gold" size="md" className="w-full justify-center">
                  Sell a Property
                </Button>
              </Link>

              {user ? (
                <div className="space-y-2 pt-2">
                  <Link
                    href={["ADMIN", "SUPER_ADMIN", "PROPERTY_MANAGER"].includes(user.role) ? "/admin" : "/dashboard"}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-900"
                  >
                    <UserCircle className="h-4 w-4 text-emerald-700" />
                    <span>{user.name} ({user.role})</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      <LogIn className="h-3.5 w-3.5" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Contact Footer */}
            <div className="mt-auto border-t border-slate-100 pt-4 text-xs text-slate-500 space-y-1">
              <a
                href="tel:+919885839645"
                className="flex items-center gap-2 font-medium text-slate-700 hover:text-emerald-800"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-700" />
                <span>+91 98858 39645</span>
              </a>
              <p>Guntur &middot; Vijayawada &middot; AP Capital</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
