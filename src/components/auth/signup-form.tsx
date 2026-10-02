"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { signupCustomerAction } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Loader2, UserPlus, ShieldCheck } from "lucide-react";

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signupCustomerAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard");
      router.refresh();
    }
  }, [state?.success, router]);

  return (
    <form action={formAction} className="space-y-5">
      {state && !state.success && state.message && (
        <Alert variant="danger">{state.message}</Alert>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="name" required>Full Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Your full name"
          error={state?.errors?.name?.[0]}
          disabled={isPending}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" required>Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={state?.errors?.email?.[0]}
          disabled={isPending}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+91 9876543210"
          error={state?.errors?.phone?.[0]}
          helperText="Optional — helps us respond to your enquiries faster"
          disabled={isPending}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" required>Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Min 8 chars, 1 uppercase, 1 number"
          error={state?.errors?.password?.[0]}
          disabled={isPending}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword" required>Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          error={state?.errors?.confirmPassword?.[0]}
          disabled={isPending}
          required
        />
      </div>

      {/* Role security notice */}
      <div className="flex items-start gap-2.5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
        <ShieldCheck className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
        <p className="text-xs text-emerald-800 leading-relaxed">
          Your account will be created as a <strong>Customer</strong> account, giving you access
          to saved properties, enquiry tracking, and your personal dashboard.
        </p>
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
            Creating account…
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4" />
            Create Account
          </>
        )}
      </Button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-emerald-700 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
