"use client";

import { useState, useTransition } from "react";
import { changePasswordAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, AlertCircle, Loader2, KeyRound } from "lucide-react";

export function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength(newPassword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setFieldErrors({});

    const formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);
    formData.append("confirmPassword", confirmPassword);

    startTransition(async () => {
      const res = await changePasswordAction(null, formData);
      if (res.success) {
        setSuccessMsg(res.message || "Password updated successfully. Other active sessions have been signed out.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setErrorMsg(res.message || "Failed to update password.");
        if (res.errors) {
          setFieldErrors(res.errors);
        }
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
          <KeyRound className="h-5 w-5 text-emerald-800" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Change Password</h2>
          <p className="text-xs text-slate-500">
            Ensure your account is protected with a secure password.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold rounded-xl flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-700 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Current Password *
          </label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter your current password"
            required
            className={fieldErrors.currentPassword ? "border-rose-400" : ""}
          />
          {fieldErrors.currentPassword && (
            <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.currentPassword[0]}</p>
          )}
        </div>

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
            className={fieldErrors.newPassword ? "border-rose-400" : ""}
          />
          {fieldErrors.newPassword && (
            <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.newPassword[0]}</p>
          )}

          {/* Password strength indicator */}
          {newPassword.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full flex-1 ${strengthScore >= 1 ? (strengthScore <= 2 ? "bg-amber-400" : "bg-emerald-500") : "bg-transparent"}`} />
                <div className={`h-full flex-1 ${strengthScore >= 2 ? (strengthScore <= 2 ? "bg-amber-400" : "bg-emerald-500") : "bg-transparent"}`} />
                <div className={`h-full flex-1 ${strengthScore >= 3 ? "bg-emerald-500" : "bg-transparent"}`} />
                <div className={`h-full flex-1 ${strengthScore >= 4 ? "bg-emerald-600" : "bg-transparent"}`} />
              </div>
              <p className="text-[10px] text-slate-400">
                Strength: {strengthScore <= 2 ? "Weak / Fair" : strengthScore === 3 ? "Good" : "Strong"}
              </p>
            </div>
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
            placeholder="Confirm your new password"
            required
            className={fieldErrors.confirmPassword ? "border-rose-400" : ""}
          />
          {fieldErrors.confirmPassword && (
            <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.confirmPassword[0]}</p>
          )}
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isPending}
            className="text-xs font-bold gap-2 shadow-sm"
          >
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}
