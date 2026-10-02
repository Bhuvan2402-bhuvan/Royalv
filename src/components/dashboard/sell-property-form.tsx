"use client";

import { useActionState } from "react";
import { submitSellPropertyAction } from "@/lib/actions/properties";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Loader2, CheckCircle2 } from "lucide-react";
import { PropertyType } from "@prisma/client";
import { SessionUser } from "@/types/auth";

const PROPERTY_TYPE_OPTIONS: { value: PropertyType; label: string }[] = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "VILLA", label: "Villa" },
  { value: "INDEPENDENT_HOUSE", label: "Independent House" },
  { value: "OPEN_PLOT", label: "Open Plot" },
  { value: "RESIDENTIAL_PLOT", label: "Residential Plot" },
  { value: "COMMERCIAL_SPACE", label: "Commercial Space" },
  { value: "COMMERCIAL_BUILDING", label: "Commercial Building" },
  { value: "COMMERCIAL_PLOT", label: "Commercial Plot" },
  { value: "AGRICULTURAL_LAND", label: "Agricultural Land" },
  { value: "FARM_HOUSE", label: "Farm House" },
];

interface SellPropertyFormProps {
  user?: SessionUser | null;
}

export function SellPropertyForm({ user }: SellPropertyFormProps) {
  const [state, formAction, isPending] = useActionState(submitSellPropertyAction, null);

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 border border-emerald-200 mb-5">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-emerald-900 mb-2">Submission Received!</h3>
        <p className="text-sm text-emerald-700 leading-relaxed max-w-md mx-auto">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {state && !state.success && state.message && (
        <Alert variant="danger">{state.message}</Alert>
      )}

      {/* Owner Details */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-bold text-slate-700 uppercase tracking-wide border-b border-slate-200 pb-2 w-full mb-4">
          Your Contact Details
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="sell-name" required>Your Name</Label>
            <Input
              id="sell-name"
              name="ownerName"
              placeholder="Full name"
              defaultValue={user?.name || ""}
              error={state?.errors?.ownerName?.[0]}
              disabled={isPending}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sell-phone" required>Phone Number</Label>
            <Input
              id="sell-phone"
              name="ownerPhone"
              type="tel"
              placeholder="+91 9876543210"
              error={state?.errors?.ownerPhone?.[0]}
              disabled={isPending}
              required
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sell-email" required>Email Address</Label>
          <Input
            id="sell-email"
            name="ownerEmail"
            type="email"
            placeholder="you@example.com"
            defaultValue={user?.email || ""}
            error={state?.errors?.ownerEmail?.[0]}
            disabled={isPending}
            required
          />
        </div>
      </fieldset>

      {/* Property Details */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-bold text-slate-700 uppercase tracking-wide border-b border-slate-200 pb-2 w-full mb-4">
          Property Details
        </legend>

        <div className="space-y-1.5">
          <Label htmlFor="sell-type" required>Property Type</Label>
          <select
            id="sell-type"
            name="propertyType"
            className={`w-full rounded-xl border px-3.5 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer ${
              state?.errors?.propertyType ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-white"
            }`}
            disabled={isPending}
            required
          >
            <option value="">Select property type</option>
            {PROPERTY_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {state?.errors?.propertyType && (
            <p className="text-xs text-rose-600">{state.errors.propertyType[0]}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="sell-city" required>City</Label>
            <Input
              id="sell-city"
              name="city"
              placeholder="e.g. Guntur, Vijayawada"
              error={state?.errors?.city?.[0]}
              disabled={isPending}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sell-locality" required>Locality / Area</Label>
            <Input
              id="sell-locality"
              name="locality"
              placeholder="e.g. Lakshmipuram, Benz Circle"
              error={state?.errors?.locality?.[0]}
              disabled={isPending}
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sell-address" required>Full Address</Label>
          <Input
            id="sell-address"
            name="address"
            placeholder="Plot no., Street, Area, City"
            error={state?.errors?.address?.[0]}
            disabled={isPending}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="sell-price" required>Expected Price (₹)</Label>
            <Input
              id="sell-price"
              name="expectedPrice"
              type="number"
              placeholder="e.g. 5000000"
              error={state?.errors?.expectedPrice?.[0]}
              disabled={isPending}
              min={1}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sell-builtup">Built-up Area (sq.ft)</Label>
            <Input
              id="sell-builtup"
              name="builtUpAreaSqFt"
              type="number"
              placeholder="e.g. 1200"
              error={state?.errors?.builtUpAreaSqFt?.[0]}
              disabled={isPending}
              min={1}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sell-plot">Plot Area (sq.yds)</Label>
            <Input
              id="sell-plot"
              name="plotAreaSqYards"
              type="number"
              placeholder="e.g. 150"
              error={state?.errors?.plotAreaSqYards?.[0]}
              disabled={isPending}
              min={1}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sell-desc">Additional Notes</Label>
          <textarea
            id="sell-desc"
            name="description"
            rows={4}
            placeholder="Any additional details about your property — condition, unique features, reason for selling, etc."
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            disabled={isPending}
          />
        </div>
      </fieldset>

      <Button
        type="submit"
        variant="gold"
        size="lg"
        disabled={isPending}
        className="w-full justify-center font-bold"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting…
          </>
        ) : (
          "Submit Property to Royal V Properties"
        )}
      </Button>
      <p className="text-center text-xs text-slate-500">
        Submissions are reviewed by our team before being listed. We will contact you within 2–3 business days.
      </p>
    </form>
  );
}
