"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { approvePropertyAction, rejectPropertyAction } from "@/lib/actions/admin";
import { formatPriceINR, formatDate, formatArea } from "@/lib/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  XCircle,
  Globe,
  MapPin,
  AlertTriangle,
  Loader2,
  Edit,
} from "lucide-react";

interface ApprovalCardProps {
  property: {
    id: string;
    title: string;
    slug: string;
    description: string;
    tagline?: string | null;
    propertyType: string;
    price: number | string | { toString(): string };
    priceOnRequest?: boolean;
    city: string;
    locality: string;
    address: string;
    bedrooms?: number | null;
    bathrooms?: number | null;
    builtUpAreaSqFt?: number | string | { toString(): string } | null;
    plotAreaSqYards?: number | string | { toString(): string } | null;
    plotAreaCents?: number | string | { toString(): string } | null;
    amenities?: unknown;
    submittedAt?: Date | null;
    createdAt: Date;
    createdBy: {
      name: string;
      email: string;
      role: string;
    };
    images: { url: string; isFeatured: boolean }[];
    [key: string]: unknown;
  };
}

export function ApprovalCard({ property }: ApprovalCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const thumb =
    property.images[0]?.url ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

  const handleApprove = (autoPublish: boolean) => {
    setErrorMsg(null);
    startTransition(async () => {
      const res = await approvePropertyAction(property.id, autoPublish);
      if (res.success) {
        router.refresh();
      } else {
        setErrorMsg(res.message || "Approval failed.");
      }
    });
  };

  const handleReject = () => {
    if (rejectReason.trim().length < 5) {
      setErrorMsg("Please enter a detailed rejection reason (minimum 5 characters).");
      return;
    }
    setErrorMsg(null);
    startTransition(async () => {
      const res = await rejectPropertyAction(property.id, rejectReason.trim());
      if (res.success) {
        setShowRejectModal(false);
        router.refresh();
      } else {
        setErrorMsg(res.message || "Rejection failed.");
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-colors">
      {errorMsg && (
        <div className="p-3 bg-rose-50 border-b border-rose-200 text-xs text-rose-800 font-semibold">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Customer Preview Card */}
        <div className="lg:col-span-4 bg-slate-50 p-5 border-r border-slate-100 flex flex-col justify-between">
          <div>
            <div className="relative h-48 w-full rounded-xl overflow-hidden bg-slate-200 mb-3 border border-slate-200">
              <Image
                src={thumb}
                alt={property.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 left-2">
                <Badge variant="slate" className="text-[10px]">
                  {property.propertyType.replace(/_/g, " ")}
                </Badge>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-base font-extrabold text-emerald-900">
                  {formatPriceINR(property.price, { priceOnRequest: property.priceOnRequest })}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {formatArea(property.builtUpAreaSqFt, property.plotAreaSqYards, property.plotAreaCents)}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm leading-snug">{property.title}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-emerald-700" />
                {property.locality}, {property.city}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center justify-between">
              <span>Submitted by:</span>
              <strong className="text-slate-800">{property.createdBy.name}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Submission Date:</span>
              <span>{property.submittedAt ? formatDate(property.submittedAt) : formatDate(property.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Right: Detailed Breakdown & Approval Controls */}
        <div className="lg:col-span-8 p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <Badge variant="warning" className="text-xs">
                Pending Administrator Approval
              </Badge>
              <Link href={`/admin/properties/${property.id}`}>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                  <Edit className="h-3.5 w-3.5" />
                  Edit Listing
                </Button>
              </Link>
            </div>

            {/* Description */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Property Description
              </p>
              <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">
                {property.description}
              </p>
            </div>

            {/* Specs Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-center">
                <span className="text-[10px] text-slate-400 font-semibold block">Bedrooms</span>
                <span className="text-xs font-bold text-slate-900">
                  {property.bedrooms ? `${property.bedrooms} BHK` : "—"}
                </span>
              </div>
              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-center">
                <span className="text-[10px] text-slate-400 font-semibold block">Bathrooms</span>
                <span className="text-xs font-bold text-slate-900">{property.bathrooms || "—"}</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-center">
                <span className="text-[10px] text-slate-400 font-semibold block">Area</span>
                <span className="text-xs font-bold text-slate-900 truncate block">
                  {formatArea(property.builtUpAreaSqFt, property.plotAreaSqYards, property.plotAreaCents)}
                </span>
              </div>
              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-center">
                <span className="text-[10px] text-slate-400 font-semibold block">Photos</span>
                <span className="text-xs font-bold text-slate-900">{property.images.length} photos</span>
              </div>
            </div>

            {/* Amenities preview */}
            {Array.isArray(property.amenities) && property.amenities.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Amenities
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {property.amenities.slice(0, 6).map((a: string) => (
                    <span
                      key={a}
                      className="bg-emerald-50 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-100"
                    >
                      {a}
                    </span>
                  ))}
                  {property.amenities.length > 6 && (
                    <span className="text-[10px] text-slate-400 self-center">
                      +{property.amenities.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowRejectModal(true)}
              disabled={isPending}
              className="text-rose-700 hover:bg-rose-50 border-rose-200 text-xs gap-1.5"
            >
              <XCircle className="h-4 w-4 text-rose-600" />
              Reject / Request Changes
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="gold"
                size="sm"
                onClick={() => handleApprove(false)}
                disabled={isPending}
                className="text-xs gap-1.5 font-bold"
              >
                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Approve Listing
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => handleApprove(true)}
                disabled={isPending}
                className="text-xs gap-1.5 font-bold shadow-sm"
              >
                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Globe className="h-4 w-4" />}
                Approve & Publish Live
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Reject / Request Changes Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-rose-700" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Reject or Request Changes
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Provide actionable feedback so the creator can correct the listing.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for Rejection *
              </label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Please verify property dimensions against the registered title deed and upload higher resolution facade photos."
                rows={4}
                className="text-xs"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowRejectModal(false)}
                disabled={isPending}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleReject}
                disabled={isPending}
                className="text-xs gap-1.5 font-bold"
              >
                {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
