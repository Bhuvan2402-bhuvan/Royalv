import { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { getAdminDashboardMetrics } from "@/lib/queries/admin";
import { formatDate } from "@/lib/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Clock,
  CheckCircle2,
  MessageSquare,
  Inbox,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Plus,
  Users,
  CalendarCheck,
  CheckCheck,
  FileText,
} from "lucide-react";
import { UserRole } from "@prisma/client";

export const metadata: Metadata = {
  title: "Operations Dashboard",
  description: "Royal V Properties Operations Portal",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  const role = user?.role || UserRole.SUPER_ADMIN;
  const metrics = await getAdminDashboardMetrics(user?.id, role);

  // Role-specific headers and descriptions
  const getDashboardHeader = () => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return {
          title: "Executive Overview — Royal V",
          roleTag: "Executive Admin",
          desc: "Overall business and platform authority. Full control over system configurations, team management, listings and audit trail.",
        };
      case UserRole.ADMIN:
        return {
          title: "Operations Control Center — Operations Admin",
          roleTag: "Operations Admin",
          desc: "Runs the office and coordinates operations. Oversees customer submissions, property inventory, leads, and operational staff.",
        };
      case UserRole.PROPERTY_MANAGER:
        return {
          title: "Property Operations — Varun Teja",
          roleTag: "Property Manager",
          desc: "Manages property inventory, listings & publishing. Direct publishing privileges, pricing updates, and listing lifecycle management.",
        };
      case UserRole.FIELD_AGENT:
        return {
          title: "Field Operations / My Work — Bhuvana Mohan",
          roleTag: "Field Agent",
          desc: "Handles field operations, property verification, site visits and customer follow-up. Direct property creation and immediate publishing.",
        };
      default:
        return {
          title: `Welcome, ${user?.name}`,
          roleTag: "Staff",
          desc: "Royal V Properties Operations Portal.",
        };
    }
  };

  const header = getDashboardHeader();

  // Role-Specific KPI Cards
  const getRoleCards = () => {
    if (role === UserRole.SUPER_ADMIN) {
      return [
        { label: "Total Properties", value: metrics.totalProperties, icon: Building2, color: "text-slate-800", bg: "bg-slate-100", href: "/admin/properties" },
        { label: "Live Published", value: metrics.publishedProperties, icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", href: "/admin/properties?status=PUBLISHED" },
        { label: "Customer Submissions", value: metrics.totalSubmissions, icon: Inbox, color: "text-amber-800", bg: "bg-amber-50 border-amber-200", href: "/admin/submissions", badge: metrics.pendingSubmissions > 0 ? `${metrics.pendingSubmissions} Pending` : undefined },
        { label: "Properties Sold", value: metrics.soldProperties, icon: CheckCheck, color: "text-emerald-800", bg: "bg-emerald-50 border-emerald-200", href: "/admin/properties?status=SOLD" },
        { label: "New Enquiries", value: metrics.newEnquiries, icon: MessageSquare, color: "text-blue-700", bg: "bg-blue-50 border-blue-200", href: "/admin/enquiries?status=NEW", highlight: metrics.newEnquiries > 0 },
        { label: "Open Leads", value: metrics.openLeads, icon: TrendingUp, color: "text-purple-700", bg: "bg-purple-50 border-purple-200", href: "/admin/enquiries" },
        { label: "Team Members", value: metrics.teamMembersCount, icon: Users, color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200", href: "/admin/team" },
      ];
    }

    if (role === UserRole.ADMIN) {
      return [
        { label: "New Enquiries", value: metrics.newEnquiries, icon: MessageSquare, color: "text-blue-700", bg: "bg-blue-50 border-blue-200", href: "/admin/enquiries?status=NEW", highlight: metrics.newEnquiries > 0 },
        { label: "Pending Submissions", value: metrics.pendingSubmissions, icon: Inbox, color: "text-amber-800", bg: "bg-amber-50 border-amber-200", href: "/admin/submissions", highlight: metrics.pendingSubmissions > 0 },
        { label: "Drafts Needing Attention", value: metrics.draftProperties, icon: FileText, color: "text-slate-700", bg: "bg-slate-100", href: "/admin/properties?status=DRAFT" },
        { label: "Active Follow-ups", value: metrics.openLeads, icon: TrendingUp, color: "text-purple-700", bg: "bg-purple-50 border-purple-200", href: "/admin/enquiries" },
        { label: "Live Properties", value: metrics.publishedProperties, icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", href: "/admin/properties?status=PUBLISHED" },
        { label: "Sold Properties", value: metrics.soldProperties, icon: CheckCheck, color: "text-emerald-800", bg: "bg-emerald-50 border-emerald-200", href: "/admin/properties?status=SOLD" },
        { label: "Operational Staff", value: metrics.teamMembersCount, icon: Users, color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200", href: "/admin/team" },
      ];
    }

    if (role === UserRole.PROPERTY_MANAGER) {
      return [
        { label: "Properties Managed", value: metrics.totalProperties, icon: Building2, color: "text-slate-800", bg: "bg-slate-100", href: "/admin/properties" },
        { label: "Draft Listings", value: metrics.draftProperties, icon: FileText, color: "text-amber-800", bg: "bg-amber-50 border-amber-200", href: "/admin/properties?status=DRAFT" },
        { label: "Live Published", value: metrics.publishedProperties, icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", href: "/admin/properties?status=PUBLISHED" },
        { label: "Sold Properties", value: metrics.soldProperties, icon: CheckCheck, color: "text-emerald-800", bg: "bg-emerald-50 border-emerald-200", href: "/admin/properties?status=SOLD" },
        { label: "Customer Submissions", value: metrics.pendingSubmissions, icon: Inbox, color: "text-amber-700", bg: "bg-amber-50 border-amber-200", href: "/admin/submissions", badge: metrics.pendingSubmissions > 0 ? `${metrics.pendingSubmissions} Pending` : undefined },
        { label: "Property Enquiries", value: metrics.newEnquiries, icon: MessageSquare, color: "text-blue-700", bg: "bg-blue-50 border-blue-200", href: "/admin/enquiries" },
      ];
    }

    // FIELD_AGENT
    return [
      { label: "My Assigned Properties", value: metrics.assignedPropertiesCount || metrics.totalProperties, icon: Building2, color: "text-slate-800", bg: "bg-slate-100", href: "/admin/properties" },
      { label: "Scheduled Site Visits", value: metrics.scheduledVisitsCount, icon: CalendarCheck, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", href: "/admin/enquiries" },
      { label: "Assigned Leads", value: metrics.assignedEnquiriesCount || metrics.openLeads, icon: TrendingUp, color: "text-purple-700", bg: "bg-purple-50 border-purple-200", href: "/admin/enquiries" },
      { label: "Needing Verification", value: metrics.draftProperties, icon: Clock, color: "text-amber-800", bg: "bg-amber-50 border-amber-200", href: "/admin/properties?status=DRAFT" },
      { label: "Live Published", value: metrics.publishedProperties, icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", href: "/admin/properties?status=PUBLISHED" },
      { label: "Marked SOLD", value: metrics.soldProperties, icon: CheckCheck, color: "text-emerald-800", bg: "bg-emerald-50 border-emerald-200", href: "/admin/properties?status=SOLD" },
    ];
  };

  const statCards = getRoleCards();

  return (
    <div className="space-y-8">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="rounded-md bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider border border-emerald-200">
              {header.roleTag}
            </span>
            <span className="text-xs text-slate-400">· Royal V Properties</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {header.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {header.desc}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/admin/properties/new">
            <Button variant="primary" size="md" className="gap-2 shadow-sm font-bold text-xs">
              <Plus className="h-4 w-4" />
              Add & Publish Property
            </Button>
          </Link>
        </div>
      </div>

      {/* Role-Specific Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`rounded-2xl border p-5 transition-all hover:shadow-md hover:-translate-y-0.5 bg-white ${
              stat.highlight ? "border-amber-300 ring-2 ring-amber-400/20" : "border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              {stat.badge && (
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                  {stat.badge}
                </span>
              )}
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{stat.value}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1 truncate">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Role-Specific Work Hub & Direct Action Center */}
      {role === UserRole.FIELD_AGENT && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5 text-emerald-800" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Direct Field Publishing Active — Bhuvana Mohan
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Take photographs, enter property details, validate information, and click <strong>Publish Now</strong>. Your listings go live on the public site immediately without admin approval.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/admin/properties/new">
              <Button variant="primary" size="sm" className="text-xs font-bold">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add & Publish Property
              </Button>
            </Link>
          </div>
        </div>
      )}

      {role === UserRole.PROPERTY_MANAGER && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5 text-blue-800" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Property Inventory Management — Varun Teja
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Maintain listing accuracy, update pricing and media, publish directly, and mark sold or unavailable inventory in real time.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/admin/properties/new">
              <Button variant="primary" size="sm" className="text-xs font-bold">
                <Plus className="h-3.5 w-3.5 mr-1" /> New Listing
              </Button>
            </Link>
            <Link href="/admin/properties">
              <Button variant="outline" size="sm" className="text-xs">
                Manage Inventory
              </Button>
            </Link>
          </div>
        </div>
      )}

      {role === UserRole.ADMIN && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-100 border border-indigo-300 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-indigo-800" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Operations Control & Team Coordination — Operations Admin
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Monitor incoming enquiries, distribute buyer leads to Field Agents, review customer property submissions, and keep daily office workflow moving smoothly.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/admin/enquiries">
              <Button variant="primary" size="sm" className="text-xs font-bold">
                Assign Leads
              </Button>
            </Link>
            <Link href="/admin/team">
              <Button variant="outline" size="sm" className="text-xs">
                Staff Workload
              </Button>
            </Link>
          </div>
        </div>
      )}

      {role === UserRole.SUPER_ADMIN && (
        <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                Executive Administration — Royal V
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Full platform authority: Security governance, team role privileges, system parameters, comprehensive audit trail, and permanent deletion controls.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/admin/team">
              <Button variant="outline" size="sm" className="text-xs bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white">
                Manage Team
              </Button>
            </Link>
            <Link href="/admin/audit-logs">
              <Button variant="outline" size="sm" className="text-xs bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white">
                Audit Trail
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Action Banner for Customer Submissions or Approvals */}
      {metrics.pendingSubmissions > 0 && (role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN || role === UserRole.PROPERTY_MANAGER) && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
              <Inbox className="h-5 w-5 text-amber-800" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {metrics.pendingSubmissions} Customer Property Submissions Waiting for Review
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review submitted owner details and convert to active property drafts.
              </p>
            </div>
          </div>
          <Link href="/admin/submissions">
            <Button variant="primary" size="sm" className="text-xs font-bold shrink-0">
              Review Submissions <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      )}

      {/* Two Column Layout: Recent Enquiries & Live Audit / Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Enquiries & Leads */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {role === UserRole.FIELD_AGENT ? "My Assigned Leads & Enquiries" : "Recent Customer Enquiries"}
              </h2>
              <p className="text-xs text-slate-500">
                {role === UserRole.FIELD_AGENT ? "Prospective buyers and site visit requests" : "Incoming buyer leads and inspection requests"}
              </p>
            </div>
            <Link href="/admin/enquiries">
              <Button variant="outline" size="sm" className="text-xs">
                View All Enquiries
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          {metrics.recentEnquiriesList.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No enquiries recorded yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {metrics.recentEnquiriesList.map((enquiry) => (
                <div key={enquiry.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">{enquiry.name}</span>
                      <Badge
                        variant={enquiry.status === "NEW" ? "info" : "default"}
                        className="text-[10px] px-2 py-0"
                      >
                        {enquiry.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 truncate font-medium">
                      Property: {enquiry.property.title} ({enquiry.property.city})
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {enquiry.phone} · {enquiry.email} · {formatDate(enquiry.createdAt)}
                    </p>
                  </div>
                  <Link href="/admin/enquiries">
                    <Button variant="outline" size="sm" className="h-8 text-xs shrink-0">
                      Manage Lead
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Activity & Audit Feed */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Operations Activity</h2>
              <p className="text-xs text-slate-500">Live traceability log of team actions</p>
            </div>
            {role === UserRole.SUPER_ADMIN && (
              <Link href="/admin/audit-logs">
                <Button variant="outline" size="sm" className="text-xs">
                  Audit Logs
                </Button>
              </Link>
            )}
          </div>

          {metrics.recentActivity.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No recent activity recorded.</p>
          ) : (
            <div className="space-y-3.5">
              {metrics.recentActivity.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-xs">
                  <div className="h-7 w-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 text-xs truncate">
                        {log.user?.name || "System"}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {formatDate(log.createdAt)}
                      </span>
                    </div>
                    <p className="text-slate-600 font-mono text-[11px] mt-0.5">
                      {log.action.replace(/_/g, " ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
