"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateSellSubmissionAction,
  convertSubmissionToPropertyDraftAction,
} from "@/lib/actions/admin";
import { formatPriceINR, formatDate, formatArea } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Inbox,
  Phone,
  Mail,
  Save,
  Loader2,
  FilePlus2,
  X,
} from "lucide-react";
import { SellSubmissionStatus } from "@prisma/client";

interface SubmissionDrawerProps {
  submission: {
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
  };
  teamMembers: { id: string; name: string; role: string }[];
  onClose: () => void;
}

const SUBMISSION_STATUSES: { label: string; value: SellSubmissionStatus }[] = [
  { label: "Pending Review", value: SellSubmissionStatus.PENDING },
  { label: "Under Review", value: SellSubmissionStatus.UNDER_REVIEW },
  { label: "Owner Contacted", value: SellSubmissionStatus.CONTACTED },
  { label: "Site Inspection Scheduled", value: SellSubmissionStatus.SITE_VISIT_SCHEDULED },
  { label: "Approved for Listing", value: SellSubmissionStatus.APPROVED_FOR_LISTING },
  { label: "Rejected", value: SellSubmissionStatus.REJECTED },
  { label: "Completed", value: SellSubmissionStatus.COMPLETED },
];

export function SubmissionDrawer({ submission, teamMembers, onClose }: SubmissionDrawerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<SellSubmissionStatus>(submission.status);
  const [internalReviewNote, setInternalReviewNote] = useState(submission.internalReviewNote || "");
  const [assignedToId, setAssignedToId] = useState(submission.assignedToId || "");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = () => {
    setErrorMsg(null);
    startTransition(async () => {
      const res = await updateSellSubmissionAction(submission.id, {
        status,
        internalReviewNote: internalReviewNote.trim() || null,
        assignedToId: assignedToId || null,
      });

      if (res.success) {
        router.refresh();
        onClose();
      } else {
        setErrorMsg(res.message || "Failed to update submission.");
      }
    });
  };

  const handleConvertToDraft = () => {
    if (!confirm("Create a new Draft Property from this owner submission?")) return;
    setErrorMsg(null);
    startTransition(async () => {
      const res = await convertSubmissionToPropertyDraftAction(submission.id);
      if (res.success && res.data?.propertyId) {
        router.push(`/admin/properties/${res.data.propertyId}`);
        router.refresh();
      } else {
        setErrorMsg(res.message || "Failed to convert submission.");
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
              <Inbox className="h-5 w-5 text-emerald-800" />
              <h2 className="text-base font-extrabold text-slate-900">
                Owner Submission Review: {submission.ownerName}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Submitted on {formatDate(submission.createdAt)}
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

        {/* Owner & Property Specifications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
            <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400">
              Property Owner Contact
            </p>
            <p className="font-bold text-slate-800 text-sm">{submission.ownerName}</p>
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
              <a href={`tel:${submission.ownerPhone}`} className="font-mono hover:underline">
                {submission.ownerPhone}
              </a>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="h-3.5 w-3.5 text-blue-700 shrink-0" />
              <a href={`mailto:${submission.ownerEmail}`} className="truncate hover:underline">
                {submission.ownerEmail}
              </a>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
            <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400">
              Property Specifications
            </p>
            <p className="font-bold text-slate-800">
              {submission.propertyType.replace(/_/g, " ")} in {submission.locality}, {submission.city}
            </p>
            <p className="text-slate-500">{submission.address}</p>
            <div className="flex items-center justify-between pt-1">
              <span className="font-bold text-emerald-800 text-sm">
                Expected: {formatPriceINR(submission.expectedPrice)}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {formatArea(submission.builtUpAreaSqFt, submission.plotAreaSqYards)}
              </span>
            </div>
          </div>
        </div>

        {/* Description from owner */}
        {submission.description && (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs">
            <p className="font-bold text-slate-900 mb-1">Owner Comments & Description:</p>
            <p className="text-slate-700 leading-relaxed font-medium">&quot;{submission.description}&quot;</p>
          </div>
        )}

        {/* Status & Assignment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Review Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as SellSubmissionStatus)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-800"
            >
              {SUBMISSION_STATUSES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Assigned Field Agent
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

        {/* Internal Review Note */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Internal Staff Evaluation Notes
          </label>
          <Textarea
            value={internalReviewNote}
            onChange={(e) => setInternalReviewNote(e.target.value)}
            rows={3}
            placeholder="Record legal verification check, site visit impressions, valuation appraisal, or pricing discussion."
            className="text-xs font-sans"
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="gold"
            size="sm"
            onClick={handleConvertToDraft}
            disabled={isPending}
            className="text-xs gap-1.5 font-bold"
          >
            <FilePlus2 className="h-4 w-4" />
            Convert to Property Draft
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isPending}
              className="text-xs"
            >
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
              Save Review
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
