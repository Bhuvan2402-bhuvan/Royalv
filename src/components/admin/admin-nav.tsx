"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Clock,
  PlusCircle,
  MessageSquare,
  Inbox,
  Users,
  ShieldAlert,
  Home,
  CalendarCheck,
  Settings as SettingsIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { UserRole } from "@prisma/client";

interface AdminNavProps {
  userRole?: UserRole;
  pendingCount?: number;
  newEnquiriesCount?: number;
  pendingSubmissionsCount?: number;
}

export function AdminNav({
  userRole = UserRole.SUPER_ADMIN,
  pendingCount = 0,
  newEnquiriesCount = 0,
  pendingSubmissionsCount = 0,
}: AdminNavProps) {
  const pathname = usePathname();

  // Dynamic Navigation Sections tailored to exact roles
  const getNavSections = () => {
    switch (userRole) {
      case UserRole.SUPER_ADMIN:
        return [
          {
            title: "Executive",
            items: [
              {
                name: "Executive Overview",
                href: "/admin",
                icon: LayoutDashboard,
                exact: true,
              },
            ],
          },
          {
            title: "Property Inventory",
            items: [
              {
                name: "All Properties",
                href: "/admin/properties",
                icon: Building2,
                exact: true,
              },
              {
                name: "Add & Publish Property",
                href: "/admin/properties/new",
                icon: PlusCircle,
              },
              {
                name: "Pending Approvals",
                href: "/admin/properties/pending",
                icon: Clock,
                badge: pendingCount > 0 ? pendingCount : undefined,
                badgeColor: "bg-amber-500 text-slate-950",
              },
            ],
          },
          {
            title: "Operations & Leads",
            items: [
              {
                name: "Enquiries & Leads",
                href: "/admin/enquiries",
                icon: MessageSquare,
                badge: newEnquiriesCount > 0 ? newEnquiriesCount : undefined,
                badgeColor: "bg-blue-500 text-white",
              },
              {
                name: "Customer Submissions",
                href: "/admin/submissions",
                icon: Inbox,
                badge: pendingSubmissionsCount > 0 ? pendingSubmissionsCount : undefined,
                badgeColor: "bg-emerald-500 text-white",
              },
            ],
          },
          {
            title: "Platform & Security",
            items: [
              {
                name: "Team & Staff",
                href: "/admin/team",
                icon: Users,
              },
              {
                name: "Audit Trail",
                href: "/admin/audit-logs",
                icon: ShieldAlert,
              },
              {
                name: "Settings",
                href: "/admin/settings",
                icon: SettingsIcon,
              },
            ],
          },
        ];

      case UserRole.ADMIN:
        return [
          {
            title: "Operations",
            items: [
              {
                name: "Operations Control",
                href: "/admin",
                icon: LayoutDashboard,
                exact: true,
              },
            ],
          },
          {
            title: "Property Inventory",
            items: [
              {
                name: "All Properties",
                href: "/admin/properties",
                icon: Building2,
                exact: true,
              },
              {
                name: "Add & Publish Property",
                href: "/admin/properties/new",
                icon: PlusCircle,
              },
            ],
          },
          {
            title: "Leads & Coordination",
            items: [
              {
                name: "Enquiries & Leads",
                href: "/admin/enquiries",
                icon: MessageSquare,
                badge: newEnquiriesCount > 0 ? newEnquiriesCount : undefined,
                badgeColor: "bg-blue-500 text-white",
              },
              {
                name: "Customer Submissions",
                href: "/admin/submissions",
                icon: Inbox,
                badge: pendingSubmissionsCount > 0 ? pendingSubmissionsCount : undefined,
                badgeColor: "bg-emerald-500 text-white",
              },
            ],
          },
          {
            title: "Staff & Management",
            items: [
              {
                name: "Staff Workload",
                href: "/admin/team",
                icon: Users,
              },
              {
                name: "Settings",
                href: "/admin/settings",
                icon: SettingsIcon,
              },
            ],
          },
        ];

      case UserRole.PROPERTY_MANAGER:
        return [
          {
            title: "Property Hub",
            items: [
              {
                name: "Property Operations",
                href: "/admin",
                icon: LayoutDashboard,
                exact: true,
              },
            ],
          },
          {
            title: "Inventory Management",
            items: [
              {
                name: "Property Listings",
                href: "/admin/properties",
                icon: Building2,
                exact: true,
              },
              {
                name: "Add & Publish Property",
                href: "/admin/properties/new",
                icon: PlusCircle,
              },
            ],
          },
          {
            title: "Customer & Inquiries",
            items: [
              {
                name: "Customer Submissions",
                href: "/admin/submissions",
                icon: Inbox,
                badge: pendingSubmissionsCount > 0 ? pendingSubmissionsCount : undefined,
                badgeColor: "bg-emerald-500 text-white",
              },
              {
                name: "Property Enquiries",
                href: "/admin/enquiries",
                icon: MessageSquare,
                badge: newEnquiriesCount > 0 ? newEnquiriesCount : undefined,
                badgeColor: "bg-blue-500 text-white",
              },
            ],
          },
          {
            title: "Account",
            items: [
              {
                name: "My Settings & Security",
                href: "/admin/settings",
                icon: SettingsIcon,
              },
            ],
          },
        ];

      case UserRole.FIELD_AGENT:
        return [
          {
            title: "Field Hub",
            items: [
              {
                name: "Field Operations",
                href: "/admin",
                icon: LayoutDashboard,
                exact: true,
              },
            ],
          },
          {
            title: "Field Listings",
            items: [
              {
                name: "My Properties",
                href: "/admin/properties",
                icon: Building2,
                exact: true,
              },
              {
                name: "Add & Publish Property",
                href: "/admin/properties/new",
                icon: PlusCircle,
              },
            ],
          },
          {
            title: "Visits & Leads",
            items: [
              {
                name: "Assigned Leads & Visits",
                href: "/admin/enquiries",
                icon: CalendarCheck,
                badge: newEnquiriesCount > 0 ? newEnquiriesCount : undefined,
                badgeColor: "bg-blue-500 text-white",
              },
            ],
          },
          {
            title: "Account",
            items: [
              {
                name: "My Settings & Security",
                href: "/admin/settings",
                icon: SettingsIcon,
              },
            ],
          },
        ];

      default:
        return [
          {
            title: "Overview",
            items: [
              {
                name: "Dashboard",
                href: "/admin",
                icon: LayoutDashboard,
                exact: true,
              },
            ],
          },
        ];
    }
  };

  const navSections = getNavSections();

  return (
    <nav className="space-y-6">
      {navSections.map((section) => (
        <div key={section.title}>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            {section.title}
          </p>
          <div className="space-y-1">
            {section.items.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors",
                    isActive
                      ? "bg-emerald-800 text-white shadow-sm"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isActive ? "text-emerald-300" : "text-slate-400"
                      )}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-extrabold",
                        item.badgeColor || "bg-slate-700 text-white"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      <div className="pt-4 border-t border-slate-800/80">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition-colors"
        >
          <Home className="h-4 w-4 shrink-0" />
          <span>View Live Website</span>
        </Link>
      </div>
    </nav>
  );
}
