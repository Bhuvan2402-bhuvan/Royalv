import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getCustomerEnquiries } from "@/lib/queries/customer";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Building2, ArrowRight, MapPin } from "lucide-react";
import { EnquiryStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Enquiries",
  description: "View your property enquiry history.",
  robots: { index: false, follow: false },
};

const STATUS_LABELS: Record<EnquiryStatus, { label: string; variant: "default" | "success" | "warning" | "danger" | "info" | "gold" | "slate" }> = {
  NEW: { label: "New", variant: "info" },
  IN_REVIEW: { label: "In Review", variant: "warning" },
  CONTACTED: { label: "Contacted", variant: "success" },
  SCHEDULED_VISIT: { label: "Visit Scheduled", variant: "gold" },
  CLOSED_CONVERTED: { label: "Completed", variant: "success" },
  CLOSED_LOST: { label: "Closed", variant: "slate" },
  SPAM: { label: "Spam", variant: "danger" },
};

export default async function EnquiriesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/dashboard/enquiries");
  }
  const enquiries = await getCustomerEnquiries(user.id);

  if (enquiries.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-16 shadow-sm">
        <EmptyState
          icon={<MessageSquare className="h-10 w-10 text-slate-300" />}
          title="No enquiries yet"
          description="When you enquire about a property, it will appear here."
          action={
            <Link href="/properties">
              <Button variant="primary" size="md">
                <Building2 className="h-4 w-4" />
                Browse Properties
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h1 className="text-lg font-extrabold text-slate-900">My Enquiries</h1>
        <p className="text-sm text-slate-500 mt-1">
          {enquiries.length} enquir{enquiries.length === 1 ? "y" : "ies"} submitted
        </p>
      </div>

      <div className="space-y-3">
        {enquiries.map((enquiry) => {
          const statusConfig = STATUS_LABELS[enquiry.status] || { label: enquiry.status, variant: "default" as const };
          return (
            <div
              key={enquiry.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 mb-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {enquiry.property.locality}, {enquiry.property.city}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1 truncate">
                    {enquiry.property.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    {enquiry.message}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>
                      {new Date(enquiry.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                  <Link href={`/properties/${enquiry.property.slug}`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      View Property
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
