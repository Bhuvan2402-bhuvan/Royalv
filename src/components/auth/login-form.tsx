"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Loader2, LogIn, KeyRound } from "lucide-react";

interface LoginFormProps {
  callbackUrl?: string;
}

const DEMO_ACCOUNTS = [
  { role: "Super Admin", name: "Royal V", email: "royalvproperties@gmail.com", pass: "SuperAdmin@2026!" },
  { role: "Admin", name: "Operations Admin", email: "admin@royalvproperties.com", pass: "Admin@2026!" },
  { role: "Property Manager", name: "Varun Teja", email: "varun@royalvproperties.com", pass: "PropertyManager@2026!" },
  { role: "Field Agent", name: "Bhuvana Mohan", email: "bhuvana@royalvproperties.com", pass: "FieldAgent@2026!" },
  { role: "Customer", name: "Verified Buyer / Seller", email: "customer@royalvproperties.com", pass: "Customer@2026!" },
];

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [showCredentials, setShowCredentials] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state?.success && state.user) {
      if (callbackUrl && callbackUrl.startsWith("/")) {
        router.push(callbackUrl);
      } else {
        const isStaff = ["SUPER_ADMIN", "ADMIN", "PROPERTY_MANAGER", "FIELD_AGENT", "AGENT"].includes(state.user.role);
        const destination = isStaff ? "/admin" : "/dashboard";
        router.push(destination);
      }
      router.refresh();
    }
  }, [state?.success, state?.user, callbackUrl, router]);

  const handleQuickFill = (email: string, pass: string) => {
    setEmailValue(email);
    setPasswordValue(pass);
  };

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-5">
        {state && !state.success && state.message && (
          <Alert variant="danger">{state.message}</Alert>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email" required>Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            error={state?.errors?.email?.[0]}
            disabled={isPending}
            required
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" required>Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-emerald-700 hover:text-emerald-900 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            error={state?.errors?.password?.[0]}
            disabled={isPending}
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isPending}
          className="w-full justify-center font-bold"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Sign In
            </>
          )}
        </Button>

        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-emerald-700 hover:underline">
            Create one free
          </Link>
        </p>
      </form>

      {/* Quick Test Credentials Box */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <button
          type="button"
          onClick={() => setShowCredentials(!showCredentials)}
          className="flex w-full items-center justify-between text-xs font-bold text-slate-700 hover:text-emerald-800"
        >
          <span className="flex items-center gap-1.5">
            <KeyRound className="h-3.5 w-3.5 text-emerald-700" />
            Quick-Fill Role Credentials
          </span>
          <span className="text-[10px] text-slate-400">
            {showCredentials ? "Hide" : "Click to view / autofill"}
          </span>
        </button>

        {showCredentials && (
          <div className="mt-3 space-y-2 pt-2 border-t border-slate-200 text-xs">
            {DEMO_ACCOUNTS.map((acc) => (
              <div
                key={acc.email}
                className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{acc.role}</span>
                    <span className="text-[10px] text-slate-500">({acc.name})</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">{acc.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickFill(acc.email, acc.pass)}
                  className="rounded-md bg-emerald-100 px-2 py-1 text-[11px] font-bold text-emerald-800 hover:bg-emerald-200 transition-colors"
                >
                  Fill
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
