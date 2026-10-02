import { Suspense } from "react";
import { Metadata } from "next";
import { BrandLogo } from "@/components/shared/brand-logo";
import { ResetPasswordForm } from "./reset-password-form";
import { KeyRound, Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your Royal V Properties account.",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-5">
              <BrandLogo />
            </div>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 mb-3">
              <KeyRound className="h-6 w-6 text-emerald-800" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Set New Password</h1>
            <p className="mt-1.5 text-xs text-slate-500 max-w-xs mx-auto">
              Choose a strong, secure password for your account.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="py-8 flex justify-center text-slate-400">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-800" />
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
