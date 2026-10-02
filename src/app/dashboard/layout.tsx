import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { LogoutButton } from "@/components/auth/logout-button";
import { UserCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              {/* User info */}
              <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-100">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 border border-emerald-200">
                  <UserCircle className="h-6 w-6 text-emerald-700" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">{user.name}</p>
                  <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                    Verified Buyer / Seller
                  </p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                </div>
              </div>
              <DashboardNav />
              <div className="mt-5 pt-5 border-t border-slate-100">
                <LogoutButton
                  variant="outline"
                  size="sm"
                  className="w-full justify-center text-slate-600"
                />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
