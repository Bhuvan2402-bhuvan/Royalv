"use client";

import { useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { resetPasswordAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [isPending, startTransition] = useTransition();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrorMsg(null);
    setFieldErrors({});

    if (!token) {
      setErrorMsg("Reset token is missing or invalid. Please request a new password reset link.");
      return;
    }

    const formData = new FormData();
    formData.append("token", token);
    formData.append("newPassword", newPassword);
    formData.append("confirmPassword", confirmPassword);

    startTransition(async () => {
      const res = await resetPasswordAction(null, formData);
      if (res.success) {
        setMessage(res.message || "Your password has been successfully reset.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setErrorMsg(res.message || "Failed to reset password.");
        if (res.errors) {
          setFieldErrors(res.errors);
        }
      }
    });
  };

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <div className="p-4 bg-rose-50 border border-rose-200 text-xs text-rose-800 rounded-xl">
          Invalid or missing reset token. Please request a new password reset link.
        </div>
        <Link href="/forgot-password">
          <Button variant="primary" size="sm" className="text-xs font-bold">
            Go to Forgot Password
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 rounded-xl space-y-3">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
            <span>Password Reset Complete!</span>
          </div>
          <p className="text-slate-600">{message}</p>
          <p className="text-[11px] text-emerald-800 font-semibold">
            Redirecting to login in 3 seconds...
          </p>
          <Link href="/login">
            <Button size="sm" variant="primary" className="text-xs font-bold gap-1.5 w-full">
              Login Now <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-xs text-rose-800 rounded-xl flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-700 shrink-0" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {!message && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              New Password * (Min 8 chars, 1 uppercase, 1 number)
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className={`text-xs ${fieldErrors.newPassword ? "border-rose-400" : ""}`}
            />
            {fieldErrors.newPassword && (
              <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.newPassword[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Confirm New Password *
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              className={`text-xs ${fieldErrors.confirmPassword ? "border-rose-400" : ""}`}
            />
            {fieldErrors.confirmPassword && (
              <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.confirmPassword[0]}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isPending}
            className="w-full text-xs font-bold gap-2 shadow-sm"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Reset Password & Sign In
          </Button>
        </form>
      )}

      <div className="pt-3 border-t border-slate-100 text-center text-xs">
        <Link
          href="/login"
          className="font-semibold text-slate-600 hover:text-emerald-800 transition-colors"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
