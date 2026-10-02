import { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/session";
import { canManageUsers } from "@/lib/auth/permissions";
import { getAdminTeam } from "@/lib/queries/admin";
import { TeamTable } from "@/components/admin/team-table";
import { Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Team & Staff",
  description: "Manage Royal V Properties staff and operational roles.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const user = await getCurrentUser();
  const canManage = canManageUsers(user?.role);
  const team = await getAdminTeam();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-5 w-5 text-emerald-800" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Operational Team & Staff ({team.length})
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Manage administrators, property managers, and field agents handling property sales and buyer leads.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <TeamTable team={team} canManageUsers={canManage} />
      </div>
    </div>
  );
}
