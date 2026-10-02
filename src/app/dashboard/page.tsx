import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getCustomerDashboardCounts } from "@/lib/queries/customer";
import { Heart, MessageSquare, Building2, User, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Dashboard",
  description: "Your Royal V Properties customer dashboard.",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const { savedCount, enquiriesCount, submissionsCount } = await getCustomerDashboardCounts(
    user.id
  );

  const stats = [
    {
      label: "Saved Properties",
      value: savedCount,
      icon: Heart,
      href: "/dashboard/saved-properties",
      color: "text-rose-600",
      bg: "bg-rose-50 border-rose-100",
    },
    {
      label: "My Enquiries",
      value: enquiriesCount,
      icon: MessageSquare,
      href: "/dashboard/enquiries",
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-100",
    },
    {
      label: "Property Submissions",
      value: submissionsCount,
      icon: Building2,
      href: "/dashboard/submit-property",
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-100",
    },
  ];

  const quickLinks = [
    { label: "Browse Properties", href: "/properties", icon: Building2 },
    { label: "Submit a Property to Sell", href: "/dashboard/submit-property", icon: Building2 },
    { label: "View My Enquiries", href: "/dashboard/enquiries", icon: MessageSquare },
    { label: "Update Profile", href: "/dashboard/profile", icon: User },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="rounded-md bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider border border-emerald-200">
            Verified Buyer / Seller
          </span>
          <span className="text-xs text-slate-400">· Royal V Properties</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Welcome back, {user!.name}!
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Discover properties across Guntur, Amaravati, and Vijayawada. Track your property enquiries, manage saved listings, and submit your property for sale.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
          >
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${stat.bg} mb-4`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
            <p className="text-sm font-semibold text-slate-500 mt-1">{stat.label}</p>
            <div className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity">
              View all <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-800 transition-colors group"
            >
              {link.label}
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
