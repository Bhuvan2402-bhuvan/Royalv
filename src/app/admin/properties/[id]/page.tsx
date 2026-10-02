import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { canPublishProperties } from "@/lib/auth/permissions";
import { getAdminPropertyById, getAdminTeam } from "@/lib/queries/admin";
import { PropertyForm } from "@/components/admin/property-form";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/formatters";
import {
  ArrowLeft,
  Building2,
  Globe,
  AlertTriangle,
  History,
  ShieldCheck,
} from "lucide-react";
import { PropertyWorkflowStatus } from "@prisma/client";

export const metadata: Metadata = {
  title: "Edit Property",
  description: "View and edit property details and approval workflow.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

const STATUS_CONFIG: Record<
  PropertyWorkflowStatus,
  { label: string; variant: "default" | "success" | "warning" | "danger" | "gold" | "slate" | "info" }
> = {
  DRAFT: { label: "Draft", variant: "default" },
  PENDING_APPROVAL: { label: "Pending Approval", variant: "warning" },
  APPROVED: { label: "Approved", variant: "info" },
  PUBLISHED: { label: "Published (Live)", variant: "success" },
  REJECTED: { label: "Rejected", variant: "danger" },
  SOLD: { label: "Sold", variant: "slate" },
  UNAVAILABLE: { label: "Unavailable", variant: "slate" },
  ARCHIVED: { label: "Archived", variant: "slate" },
};

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  const property = await getAdminPropertyById(id);

  if (!property) {
    notFound();
  }

  const team = await getAdminTeam();
  const teamMembers = team.map((t) => ({ id: t.id, name: t.name, role: t.role }));
  const canPublish = canPublishProperties(user?.role);
  const statusInfo = STATUS_CONFIG[property.status] || { label: property.status, variant: "default" };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin/properties"
              className="text-slate-400 hover:text-slate-700 transition-colors mr-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Building2 className="h-5 w-5 text-emerald-800" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Edit Property: {property.title}
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Internal ID: <span className="font-mono text-slate-700">{property.id}</span> · Slug:{" "}
            <span className="font-mono text-slate-700">/{property.slug}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={statusInfo.variant} className="text-xs px-3 py-1 font-bold">
            {statusInfo.label}
          </Badge>
          {property.status === "PUBLISHED" && (
            <Link
              href={`/properties/${property.slug}`}
              target="_blank"
              className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
            >
              <Globe className="h-3.5 w-3.5" />
              View Public Page
            </Link>
          )}
        </div>
      </div>

      {/* Lifecycle & Rejection Notice */}
      {property.status === "REJECTED" && property.rejectionReason && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-900">
            <p className="font-bold text-rose-950 mb-1">Rejection Feedback:</p>
            <p className="leading-relaxed bg-white/70 p-3 rounded-lg border border-rose-200 font-medium">
              {property.rejectionReason}
            </p>
            <p className="mt-2 text-rose-700 text-[11px]">
              Please address the highlighted items and click &quot;Submit for Approval&quot; to request a new review.
            </p>
          </div>
        </div>
      )}

      {/* Workflow Timeline Meta */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Created By</p>
          <p className="text-xs font-bold text-slate-800 mt-1">{property.createdBy.name}</p>
          <p className="text-[11px] text-slate-400">{formatDate(property.createdAt)}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Approved By</p>
          <p className="text-xs font-bold text-slate-800 mt-1">
            {property.approvedBy?.name || "—"}
          </p>
          <p className="text-[11px] text-slate-400">{property.approvedAt ? formatDate(property.approvedAt) : "Pending"}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Published By</p>
          <p className="text-xs font-bold text-slate-800 mt-1">
            {property.publishedBy?.name || "—"}
          </p>
          <p className="text-[11px] text-slate-400">{property.publishedAt ? formatDate(property.publishedAt) : "Unpublished"}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Staff</p>
          <p className="text-xs font-bold text-slate-800 mt-1">
            {property.assignedTo?.name || "Unassigned"}
          </p>
          <p className="text-[11px] text-slate-400">{property.assignedTo?.email || "—"}</p>
        </div>
      </div>

      {/* Property Form */}
      <PropertyForm
        initialData={property}
        teamMembers={teamMembers}
        canPublish={canPublish}
      />

      {/* Audit Trail for this Property */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
          <History className="h-4 w-4 text-emerald-800" />
          Property Change Audit Trail
        </h2>

        {property.auditLogs.length === 0 ? (
          <p className="text-xs text-slate-400">No previous audit logs recorded for this property.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {property.auditLogs.map((log: { id: string; action: string; createdAt: Date; user: { name: string } | null }) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                  <span className="font-semibold text-slate-800 font-mono text-[11px]">
                    {log.action}
                  </span>
                  <span className="text-slate-400">by</span>
                  <span className="font-medium text-slate-700">{log.user?.name || "System"}</span>
                </div>
                <span className="text-slate-400 text-[11px]">{formatDate(log.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
