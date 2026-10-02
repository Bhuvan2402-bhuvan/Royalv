import { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/brand-logo";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Royal V Properties account to access saved properties and enquiry history.",
};

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <BrandLogo />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Welcome Back</h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Sign in to access your saved properties and enquiries
            </p>
          </div>

          <LoginForm callbackUrl={callbackUrl} />
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Protected by Royal V Properties.{" "}
          <Link href="/privacy-policy" className="hover:text-emerald-700 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
