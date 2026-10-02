import { Metadata } from "next";
import { BrandLogo } from "@/components/shared/brand-logo";
import { ForgotPasswordForm } from "./forgot-password-form";
import { KeyRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Royal V Properties account password securely.",
};

export default function ForgotPasswordPage() {
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
            <h1 className="text-2xl font-extrabold text-slate-900">Forgot Password?</h1>
            <p className="mt-1.5 text-xs text-slate-500 max-w-xs mx-auto">
              Enter your registered email address and we&apos;ll send you a secure password reset link.
            </p>
          </div>

          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
