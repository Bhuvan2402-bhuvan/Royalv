"use client";

import { useState } from "react";
import { SubmissionDrawer } from "@/components/admin/submission-drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPriceINR, formatDate, formatArea } from "@/lib/utils/formatters";
import { Inbox, MapPin } from "lucide-react";
import { SellSubmissionStatus } from "@prisma/client";

export interface AdminSubmissionItem {
  id: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  propertyType: string;
  city: string;
  locality: string;
  address: string;
  expectedPrice: number | string | { toString(): string };
  builtUpAreaSqFt?: number | string | { toString(): string } | null;
  plotAreaSqYards?: number | string | { toString(): string } | null;
  description?: string | null;
  status: SellSubmissionStatus;
  internalReviewNote?: string | null;
  createdAt: Date;
  assignedToId?: string | null;
  assignedTo?: { id: string; name: string } | null;
  reviewedBy?: { id: string; name: string } | null;
}

interface SubmissionsTableProps {
  submissions: AdminSubmissionItem[];
  teamMembers: { id: string; name: string; role: string }[];
}

const STATUS_CONFIG: Record<
  SellSubmissionStatus,
  { label: string; variant: "info" | "warning" | "success" | "gold" | "slate" | "danger" }
> = {
  PENDING: { label: "Pending Review", variant: "warning" },
  UNDER_REVIEW: { label: "Under Review", variant: "info" },
  CONTACTED: { label: "Contacted", variant: "info" },
  SITE_VISIT_SCHEDULED: { label: "Inspection Scheduled", variant: "gold" },
  APPROVED_FOR_LISTING: { label: "Approved for Listing", variant: "success" },
  REJECTED: { label: "Rejected", variant: "danger" },
  COMPLETED: { label: "Completed", variant: "success" },
};

export function SubmissionsTable({ submissions, teamMembers }: SubmissionsTableProps) {
  const [activeSubmission, setActiveSubmission] = useState<AdminSubmissionItem | null>(null);

  if (submissions.length === 0) {
    return (
      <div className="p-16 text-center">
        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
          <Inbox className="h-6 w-6 text-slate-400" />
        </div>
        <h3 className="font-bold text-slate-900 text-sm">No property submissions found</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          When property owners submit their property details for sale through the customer portal, records will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Owner</th>
              <th className="py-3 px-4">Property Details</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Expected Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Assigned Agent</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {submissions.map((sub) => {
              const statusInfo = STATUS_CONFIG[sub.status as SellSubmissionStatus] || {
                label: sub.status,
                variant: "default",
              };

              return (
                <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Owner Contact */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{sub.ownerName}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <a href={`tel:${sub.ownerPhone}`} className="font-mono hover:underline">
                          {sub.ownerPhone}
                        </a>
                        <span>·</span>
                        <a href={`mailto:${sub.ownerEmail}`} className="truncate hover:underline">
                          {sub.ownerEmail}
                        </a>
                      </div>
                    </div>
                  </td>

                  {/* Property Specs */}
                  <td className="py-3.5 px-4 min-w-[200px]">
                    <div>
                      <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[10px]">
                        {sub.propertyType.replace(/_/g, " ")}
                      </span>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Area: {formatArea(sub.builtUpAreaSqFt, sub.plotAreaSqYards)}
                      </p>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 font-medium text-slate-700">
                      <MapPin className="h-3 w-3 text-emerald-700" />
                      <span>
                        {sub.locality}, {sub.city}
                      </span>
                    </div>
                  </td>

                  {/* Expected Price */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-bold text-emerald-800 text-xs">
                    {formatPriceINR(sub.expectedPrice)}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge variant={statusInfo.variant} className="text-[10px]">
                      {statusInfo.label}
                    </Badge>
                  </td>

                  {/* Assigned Agent */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                    {sub.assignedTo ? (
                      <span className="font-semibold text-slate-800">{sub.assignedTo.name}</span>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                    {formatDate(sub.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveSubmission(sub)}
                      className="h-8 text-xs font-semibold"
                    >
                      Review & Convert
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {activeSubmission && (
        <SubmissionDrawer
          submission={activeSubmission}
          teamMembers={teamMembers}
          onClose={() => setActiveSubmission(null)}
        />
      )}
    </>
  );
}
