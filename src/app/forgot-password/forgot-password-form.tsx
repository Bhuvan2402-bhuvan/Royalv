"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetLink, setResetLink] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrorMsg(null);
    setResetLink(null);

    const formData = new FormData();
    formData.append("email", email);

    startTransition(async () => {
      const res = await forgotPasswordAction(null, formData);
      if (res.success) {
        setMessage(res.message || "If an account exists with this email address, you will receive password reset instructions shortly.");
        if (res.data?.resetLink) {
          setResetLink(res.data.resetLink);
        }
      } else {
        setErrorMsg(res.message || "Failed to process request.");
      }
    });
  };

  return (
    <div className="space-y-5">
      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 rounded-xl space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
            <span>Request Received</span>
          </div>
          <p className="text-slate-600">{message}</p>
          {resetLink && (
            <div className="mt-3 pt-3 border-t border-emerald-200">
              <p className="font-bold text-emerald-950 mb-1.5">Direct Reset Link (Local Testing):</p>
              <Link href={resetLink}>
                <Button size="sm" variant="primary" className="text-xs font-bold gap-1.5 shadow-sm">
                  Continue to Reset Password <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          )}
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
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Account Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. yourname@example.com"
              required
              className="text-xs"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isPending}
            className="w-full text-xs font-bold gap-2 shadow-sm"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Send Password Reset Link
          </Button>
        </form>
      )}

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <Link
          href="/login"
          className="flex items-center gap-1.5 font-semibold text-slate-600 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Login
        </Link>
        <a
          href="tel:+919885839645"
          className="text-slate-500 hover:text-slate-700"
        >
          Support: 98858 39645
        </a>
      </div>
    </div>
  );
}
