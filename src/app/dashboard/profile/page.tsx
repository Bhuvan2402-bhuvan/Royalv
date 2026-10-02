import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getCustomerProfile } from "@/lib/queries/customer";
import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { UserCircle, Mail, Phone, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your Royal V Properties account profile.",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/dashboard/profile");
  }
  const profile = await getCustomerProfile(user.id);

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h1 className="text-lg font-extrabold text-slate-900">My Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Your Royal V Properties account details.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Profile header */}
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 px-6 py-8 flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 border border-white/20">
            <UserCircle className="h-8 w-8 text-white/80" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">{profile.name}</h2>
            <p className="text-sm text-emerald-300 font-medium mt-0.5">{profile.role}</p>
          </div>
        </div>

        {/* Profile details */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Email</span>
              </div>
              <p className="text-sm font-semibold text-slate-900">{profile.email}</p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Phone</span>
              </div>
              <p className="text-sm font-semibold text-slate-900">
                {profile.phone || <span className="text-slate-400 italic">Not provided</span>}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Member Since</span>
              </div>
              <p className="text-sm font-semibold text-slate-900">
                {new Date(profile.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Last Login</span>
              </div>
              <p className="text-sm font-semibold text-slate-900">
                {profile.lastLoginAt
                  ? new Date(profile.lastLoginAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : <span className="text-slate-400 italic">—</span>}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Component */}
      <ChangePasswordForm />
    </div>
  );
}
