import { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { canPublishProperties } from "@/lib/auth/permissions";
import { getAdminTeam } from "@/lib/queries/admin";
import { PropertyForm } from "@/components/admin/property-form";
import { ArrowLeft, PlusCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Add New Property",
  description: "Create a new property listing.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NewPropertyPage() {
  const user = await getCurrentUser();
  const team = await getAdminTeam();
  const canPublish = canPublishProperties(user?.role);

  const teamMembers = team.map((t) => ({ id: t.id, name: t.name, role: t.role }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin/properties"
              className="text-slate-400 hover:text-slate-700 transition-colors mr-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <PlusCircle className="h-5 w-5 text-emerald-800" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Add New Property
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Fill in the full property details to save as a private draft or publish live immediately.
          </p>
        </div>
      </div>

      <PropertyForm teamMembers={teamMembers} canPublish={canPublish} />
    </div>
  );
}
