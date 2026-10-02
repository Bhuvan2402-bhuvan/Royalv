import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { Building2 } from "lucide-react";

interface BrandLogoProps {
  className?: string;
  variant?: "light" | "dark";
  showTagline?: boolean;
}

export function BrandLogo({ className, variant = "dark", showTagline = false }: BrandLogoProps) {
  const isLight = variant === "light";

  return (
    <Link href="/" className={cn("inline-flex items-center gap-3 group select-none", className)}>
      {/* Emblem Icon */}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-amber-400 shadow-md ring-1 ring-amber-500/30 group-hover:ring-amber-500/60 transition-all duration-300">
        <Building2 className="h-5 w-5" />
        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[9px] font-extrabold text-white ring-2 ring-white">
          V
        </span>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "text-lg font-extrabold tracking-tight font-sans transition-colors",
              isLight ? "text-white" : "text-slate-900"
            )}
          >
            ROYAL <span className="text-amber-600">V</span>
          </span>
          <span
            className={cn(
              "text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded",
              isLight ? "bg-slate-800 text-amber-400" : "bg-emerald-50 text-emerald-800 border border-emerald-200"
            )}
          >
            Est. 2006
          </span>
        </div>
        {showTagline ? (
          <span
            className={cn(
              "text-[11px] font-medium tracking-wide",
              isLight ? "text-slate-400" : "text-slate-500"
            )}
          >
            Properties &middot; AP Capital Region
          </span>
        ) : null}
      </div>
    </Link>
  );
}
