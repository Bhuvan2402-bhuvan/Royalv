"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Heart,
  MessageSquare,
  Building2,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Saved Properties", href: "/dashboard/saved-properties", icon: Heart },
  { label: "My Enquiries", href: "/dashboard/enquiries", icon: MessageSquare },
  { label: "Submit Property", href: "/dashboard/submit-property", icon: Building2 },
  { label: "My Profile", href: "/dashboard/profile", icon: User },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
              isActive
                ? "bg-emerald-900 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100 hover:text-emerald-900"
            )}
          >
            <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-emerald-300" : "text-slate-400")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
