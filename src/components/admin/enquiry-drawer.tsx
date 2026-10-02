"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateEnquiryStatusAction } from "@/lib/actions/admin";
import { formatPriceINR, formatDate } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquare,
  Phone,
  Mail,
  Save,
  Loader2,
  ExternalLink,
  X,
} from "lucide-react";
import Link from "next/link";
import { EnquiryStatus } from "@prisma/client";

interface EnquiryDrawerProps {
  enquiry: {
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
  };
  teamMembers: { id: string; name: string; role: string }[];
  onClose: () => void;
}

const STATUS_OPTIONS: { label: string; value: EnquiryStatus; color: "info" | "warning" | "success" | "gold" | "slate" | "danger" }[] = [
  { label: "New Lead", value: EnquiryStatus.NEW, color: "info" },
  { label: "Under Review", value: EnquiryStatus.IN_REVIEW, color: "warning" },
  { label: "Contacted / Follow Up", value: EnquiryStatus.CONTACTED, color: "success" },
  { label: "Site Visit Scheduled", value: EnquiryStatus.SCHEDULED_VISIT, color: "gold" },
  { label: "Deal Closed / Converted", value: EnquiryStatus.CLOSED_CONVERTED, color: "success" },
  { label: "Closed / Lost", value: EnquiryStatus.CLOSED_LOST, color: "slate" },
  { label: "Mark as Spam", value: EnquiryStatus.SPAM, color: "danger" },
];

export function EnquiryDrawer({ enquiry, teamMembers, onClose }: EnquiryDrawerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<EnquiryStatus>(enquiry.status);
  const [internalNotes, setInternalNotes] = useState(enquiry.internalNotes || "");
  const [assignedToId, setAssignedToId] = useState(enquiry.assignedToId || "");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = () => {
    setErrorMsg(null);
    startTransition(async () => {
      const res = await updateEnquiryStatusAction(enquiry.id, {
        status,
        internalNotes: internalNotes.trim() || null,
        assignedToId: assignedToId || null,
      });

      if (res.success) {
        router.refresh();
        onClose();
      } else {
        setErrorMsg(res.message || "Failed to update enquiry.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-700" />
              <h2 className="text-base font-extrabold text-slate-900">
                Lead Management: {enquiry.name}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Received on {formatDate(enquiry.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* Customer & Property Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
            <p className="font-bold text-slate-900 text-xs uppercase tracking-wider text-[10px] text-slate-400">
              Customer Contact
            </p>
            <p className="font-bold text-slate-800 text-sm">{enquiry.name}</p>
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
              <a href={`tel:${enquiry.phone}`} className="font-mono hover:underline">
                {enquiry.phone}
              </a>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="h-3.5 w-3.5 text-blue-700 shrink-0" />
              <a href={`mailto:${enquiry.email}`} className="truncate hover:underline">
                {enquiry.email}
              </a>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
            <p className="font-bold text-slate-900 text-xs uppercase tracking-wider text-[10px] text-slate-400">
              Enquired Property
            </p>
            <p className="font-bold text-slate-800 line-clamp-1">{enquiry.property.title}</p>
            <p className="text-slate-500 font-medium">
              {enquiry.property.locality}, {enquiry.property.city}
            </p>
            <div className="flex items-center justify-between pt-1">
              <span className="font-bold text-emerald-800">
                {formatPriceINR(enquiry.property.price)}
              </span>
              <Link
                href={`/properties/${enquiry.property.slug}`}
                target="_blank"
                className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
              >
                View <ExternalLink className="h-2.5 w-2.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Customer Message */}
        <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-100 text-xs">
          <p className="font-bold text-blue-950 mb-1">Customer Message:</p>
          <p className="text-slate-700 leading-relaxed font-medium">&quot;{enquiry.message}&quot;</p>
          {enquiry.preferredTime && (
            <p className="mt-2 text-[11px] text-blue-800">
              Preferred Callback Time: <strong>{enquiry.preferredTime}</strong>
            </p>
          )}
        </div>

        {/* Lead Workflow Status Dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Lead Workflow Stage *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EnquiryStatus)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-800"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Assign to Staff / Agent
            </label>
            <select
              value={assignedToId}
              onChange={(e) => setAssignedToId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800"
            >
              <option value="">Unassigned</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.role.replace(/_/g, " ")})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Internal Notes (Never visible to customer) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Internal Staff Follow-Up Notes (Hidden from Customer)
          </label>
          <Textarea
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            rows={4}
            placeholder="Record discussion details, budget clarification, customer preferences, or site inspection notes."
            className="text-xs font-sans"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isPending} className="text-xs">
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={isPending}
            className="text-xs gap-1.5 font-bold shadow-sm"
          >
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
