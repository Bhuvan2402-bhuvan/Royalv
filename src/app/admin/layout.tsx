import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { canAccessAdminPortal } from "@/lib/auth/permissions";
import { AdminNav } from "@/components/admin/admin-nav";
import { LogoutButton } from "@/components/auth/logout-button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, UserCircle } from "lucide-react";
import prisma from "@/lib/db/prisma";
import { PropertyWorkflowStatus, EnquiryStatus, SellSubmissionStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user || !canAccessAdminPortal(user.role)) {
    redirect("/login?callbackUrl=/admin");
  }

  // Load live counts for sidebar badges
  const [pendingCount, newEnquiriesCount, pendingSubmissionsCount] = await Promise.all([
    prisma.property.count({ where: { status: PropertyWorkflowStatus.PENDING_APPROVAL } }),
    prisma.propertyEnquiry.count({ where: { status: EnquiryStatus.NEW } }),
    prisma.sellPropertySubmission.count({ where: { status: SellSubmissionStatus.PENDING } }),
  ]);

  const roleColors: Record<string, "gold" | "success" | "info" | "default"> = {
    SUPER_ADMIN: "gold",
    ADMIN: "gold",
    PROPERTY_MANAGER: "info",
    FIELD_AGENT: "success",
    AGENT: "success",
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* Sidebar Desktop */}
      <aside className="w-full lg:w-72 bg-slate-900 text-white shrink-0 flex flex-col justify-between p-5 border-r border-slate-800">
        <div>
          {/* Logo & Portal Header */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-black tracking-tight text-white">ROYAL V</span>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-400 uppercase tracking-widest border border-amber-500/30">
                  Operations
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Admin & Agent Portal</p>
            </div>
          </div>

          <AdminNav
            userRole={user.role}
            pendingCount={pendingCount}
            newEnquiriesCount={newEnquiriesCount}
            pendingSubmissionsCount={pendingSubmissionsCount}
          />
        </div>

        {/* User Info & Logout at bottom */}
        <div className="mt-8 pt-5 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-9 w-9 rounded-full bg-emerald-900/80 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <UserCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  {user.role === "SUPER_ADMIN"
                    ? "Executive Admin"
                    : user.role === "ADMIN"
                    ? "Operations Admin"
                    : user.role === "PROPERTY_MANAGER"
                    ? "Property Manager"
                    : user.role === "FIELD_AGENT"
                    ? "Field Agent"
                    : user.role.replace(/_/g, " ")}
                </p>
              </div>
            </div>
          </div>
          <LogoutButton
            variant="outline"
            size="sm"
            className="w-full justify-center bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white text-xs"
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs font-bold text-slate-700">Royal V Properties Operations Engine</span>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={roleColors[user.role] || "default"} className="text-xs">
              <ShieldCheck className="h-3.5 w-3.5 mr-1" />
              {user.role.replace(/_/g, " ")}
            </Badge>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Guntur HQ
            </span>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
