import { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { canApproveProperties } from "@/lib/auth/permissions";
import { getPendingApprovalProperties } from "@/lib/queries/admin";
import { ApprovalCard } from "@/components/admin/approval-card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Property Approval Center",
  description: "Review and approve pending property listings.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PendingPropertiesPage() {
  const user = await getCurrentUser();
  const canApprove = canApproveProperties(user?.role);
  const pendingProperties = await getPendingApprovalProperties();

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
            <Clock className="h-5 w-5 text-amber-600" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Property Approval Center ({pendingProperties.length})
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Review submitted listings, verify details, and approve or request changes before publication.
          </p>
        </div>

        {!canApprove && (
          <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 font-medium">
            <ShieldAlert className="h-4 w-4 text-amber-700 shrink-0" />
            <span>View Only (Admin role required to approve)</span>
          </div>
        )}
      </div>

      {pendingProperties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-xs">
          <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3 border border-emerald-200">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">All caught up!</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            There are currently no property listings waiting for approval.
          </p>
          <div className="mt-4">
            <Link href="/admin/properties">
              <Button variant="outline" size="sm" className="text-xs">
                View All Properties
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingProperties.map((property) => (
            <ApprovalCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
