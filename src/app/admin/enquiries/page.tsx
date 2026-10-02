import { Metadata } from "next";
import Link from "next/link";
import { getAdminEnquiries, getAdminTeam } from "@/lib/queries/admin";
import { EnquiriesTable } from "@/components/admin/enquiries-table";
import { Button } from "@/components/ui/button";
import { MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { EnquiryStatus } from "@prisma/client";

export const metadata: Metadata = {
  title: "Enquiries & Leads",
  description: "Manage customer property enquiries and sales leads.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface AdminEnquiriesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminEnquiriesPage({ searchParams }: AdminEnquiriesPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = typeof resolvedSearchParams.query === "string" ? resolvedSearchParams.query : undefined;
  const status = typeof resolvedSearchParams.status === "string" ? (resolvedSearchParams.status as EnquiryStatus) : undefined;
  const page = typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page, 10) : 1;

  const [{ enquiries, total, totalPages }, team] = await Promise.all([
    getAdminEnquiries({ query, status, page, limit: 15 }),
    getAdminTeam(),
  ]);

  const teamMembers = team.map((t) => ({ id: t.id, name: t.name, role: t.role }));

  const statusTabs: { label: string; value?: EnquiryStatus }[] = [
    { label: "All Enquiries" },
    { label: "New Leads", value: EnquiryStatus.NEW },
    { label: "In Review", value: EnquiryStatus.IN_REVIEW },
    { label: "Contacted", value: EnquiryStatus.CONTACTED },
    { label: "Site Visits", value: EnquiryStatus.SCHEDULED_VISIT },
    { label: "Converted", value: EnquiryStatus.CLOSED_CONVERTED },
    { label: "Closed / Lost", value: EnquiryStatus.CLOSED_LOST },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="h-5 w-5 text-blue-700" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Customer Enquiries & Leads ({total})
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Track incoming property buyer requests, assign sales reps, and record consultation notes.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {statusTabs.map((tab) => {
          const isActive = status === tab.value;
          return (
            <Link
              key={tab.label}
              href={`/admin/enquiries?${new URLSearchParams({
                ...(query ? { query } : {}),
                ...(tab.value ? { status: tab.value } : {}),
              }).toString()}`}
              className={`rounded-xl px-3.5 py-2 font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <EnquiriesTable enquiries={enquiries} teamMembers={teamMembers} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-500 font-medium">
              Page {page} of {totalPages} ({total} leads)
            </span>
            <div className="flex items-center gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/enquiries?${new URLSearchParams({
                    ...(query ? { query } : {}),
                    ...(status ? { status } : {}),
                    page: String(page - 1),
                  }).toString()}`}
                >
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                    Previous
                  </Button>
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/enquiries?${new URLSearchParams({
                    ...(query ? { query } : {}),
                    ...(status ? { status } : {}),
                    page: String(page + 1),
                  }).toString()}`}
                >
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    Next
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
