import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { SellPropertyForm } from "@/components/dashboard/sell-property-form";
import { Info } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Submit Property",
  description: "Submit your property to Royal V Properties for listing.",
  robots: { index: false, follow: false },
};

export default async function SubmitPropertyPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/dashboard/submit-property");
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h1 className="text-lg font-extrabold text-slate-900">Submit Your Property</h1>
        <p className="text-sm text-slate-500 mt-1">
          Share your property details and our team will review it and reach out to discuss listing options.
        </p>
      </div>

      {/* Information notice */}
      <div className="flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-200 px-5 py-4">
        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">How it works</p>
          <ol className="list-decimal list-inside space-y-0.5 text-blue-700">
            <li>Fill in your property details below</li>
            <li>Our team reviews the submission (2–3 business days)</li>
            <li>We contact you to discuss listing options and pricing</li>
            <li>Approved properties are published on our portal</li>
          </ol>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <SellPropertyForm user={user} />
      </div>
    </div>
  );
}
