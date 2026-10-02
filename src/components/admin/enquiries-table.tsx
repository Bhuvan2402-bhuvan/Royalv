"use client";

import { useState } from "react";
import { EnquiryDrawer } from "@/components/admin/enquiry-drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPriceINR, formatDate } from "@/lib/utils/formatters";
import { MessageSquare } from "lucide-react";
import { EnquiryStatus } from "@prisma/client";

export interface AdminEnquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: EnquiryStatus;
  internalNotes?: string | null;
  preferredTime?: string | null;
  createdAt: Date;
  assignedToId?: string | null;
  assignedTo?: { id: string; name: string } | null;
  property: {
    id: string;
    title: string;
    slug: string;
    city: string;
    locality: string;
    price: number | string | { toString(): string };
    propertyType: string;
  };
}

interface EnquiriesTableProps {
  enquiries: AdminEnquiryItem[];
  teamMembers: { id: string; name: string; role: string }[];
}

const STATUS_CONFIG: Record<
  EnquiryStatus,
  { label: string; variant: "info" | "warning" | "success" | "gold" | "slate" | "danger" }
> = {
  NEW: { label: "New Lead", variant: "info" },
  IN_REVIEW: { label: "In Review", variant: "warning" },
  CONTACTED: { label: "Contacted", variant: "success" },
  SCHEDULED_VISIT: { label: "Visit Scheduled", variant: "gold" },
  CLOSED_CONVERTED: { label: "Converted", variant: "success" },
  CLOSED_LOST: { label: "Lost", variant: "slate" },
  SPAM: { label: "Spam", variant: "danger" },
};

export function EnquiriesTable({ enquiries, teamMembers }: EnquiriesTableProps) {
  const [activeEnquiry, setActiveEnquiry] = useState<AdminEnquiryItem | null>(null);

  if (enquiries.length === 0) {
    return (
      <div className="p-16 text-center">
        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
          <MessageSquare className="h-6 w-6 text-slate-400" />
        </div>
        <h3 className="font-bold text-slate-900 text-sm">No enquiries found</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          When customers submit enquiry forms on property listings, they will appear here.
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
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Property</th>
              <th className="py-3 px-4">Message Snippet</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Assigned Agent</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {enquiries.map((enquiry) => {
              const statusInfo = STATUS_CONFIG[enquiry.status as EnquiryStatus] || {
                label: enquiry.status,
                variant: "default",
              };

              return (
                <tr key={enquiry.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Customer Info */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{enquiry.name}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <a href={`tel:${enquiry.phone}`} className="font-mono hover:underline">
                          {enquiry.phone}
                        </a>
                        <span>·</span>
                        <a href={`mailto:${enquiry.email}`} className="truncate hover:underline">
                          {enquiry.email}
                        </a>
                      </div>
                    </div>
                  </td>

                  {/* Property Info */}
                  <td className="py-3.5 px-4 min-w-[200px]">
                    <div>
                      <p className="font-bold text-slate-800 line-clamp-1">{enquiry.property.title}</p>
                      <p className="text-[11px] text-slate-400">
                        {enquiry.property.locality}, {enquiry.property.city} ·{" "}
                        <strong className="text-emerald-800">
                          {formatPriceINR(enquiry.property.price)}
                        </strong>
                      </p>
                    </div>
                  </td>

                  {/* Message */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="text-slate-600 line-clamp-2 text-xs">{enquiry.message}</p>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge variant={statusInfo.variant} className="text-[10px]">
                      {statusInfo.label}
                    </Badge>
                  </td>

                  {/* Assigned Agent */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                    {enquiry.assignedTo ? (
                      <span className="font-semibold text-slate-800">{enquiry.assignedTo.name}</span>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                    {formatDate(enquiry.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveEnquiry(enquiry)}
                      className="h-8 text-xs font-semibold"
                    >
                      Manage Lead
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Interactive Detail Drawer */}
      {activeEnquiry && (
        <EnquiryDrawer
          enquiry={activeEnquiry}
          teamMembers={teamMembers}
          onClose={() => setActiveEnquiry(null)}
        />
      )}
    </>
  );
}
