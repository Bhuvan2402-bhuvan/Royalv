"use client";

import { useActionState } from "react";
import { submitEnquiryAction } from "@/lib/actions/properties";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { SessionUser } from "@/types/auth";

interface EnquiryFormProps {
  propertyId: string;
  propertyTitle: string;
  user?: SessionUser | null;
}

export function EnquiryForm({ propertyId, propertyTitle, user }: EnquiryFormProps) {
  const [state, formAction, isPending] = useActionState(submitEnquiryAction, null);

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 border border-emerald-200 mb-4">
          <CheckCircle2 className="h-7 w-7 text-emerald-600" />
        </div>
        <h3 className="text-lg font-bold text-emerald-900 mb-2">Enquiry Submitted!</h3>
        <p className="text-sm text-emerald-700 leading-relaxed">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="propertyId" value={propertyId} />

      {state && !state.success && state.message && (
        <Alert variant="danger">{state.message}</Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="enq-name" required>Your Name</Label>
          <Input
            id="enq-name"
            name="name"
            type="text"
            placeholder="Full name"
            defaultValue={user?.name || ""}
            error={state?.errors?.name?.[0]}
            disabled={isPending}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="enq-phone" required>Phone Number</Label>
          <Input
            id="enq-phone"
            name="phone"
            type="tel"
            placeholder="+91 9876543210"
            error={state?.errors?.phone?.[0]}
            disabled={isPending}
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="enq-email" required>Email Address</Label>
        <Input
          id="enq-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          defaultValue={user?.email || ""}
          error={state?.errors?.email?.[0]}
          disabled={isPending}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="enq-message" required>Message</Label>
        <textarea
          id="enq-message"
          name="message"
          rows={4}
          placeholder={`I am interested in "${propertyTitle}". Please share more details about availability, price, and site visit options.`}
          className={`w-full rounded-xl border px-3.5 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none ${
            state?.errors?.message ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-white"
          }`}
          disabled={isPending}
          required
          minLength={10}
        />
        {state?.errors?.message && (
          <p className="text-xs text-rose-600">{state.errors.message[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="enq-time">Preferred Contact Time</Label>
        <select
          id="enq-time"
          name="preferredTime"
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          disabled={isPending}
        >
          <option value="">Any time is fine</option>
          <option value="Morning (9 AM – 12 PM)">Morning (9 AM – 12 PM)</option>
          <option value="Afternoon (12 PM – 4 PM)">Afternoon (12 PM – 4 PM)</option>
          <option value="Evening (4 PM – 7 PM)">Evening (4 PM – 7 PM)</option>
        </select>
      </div>

      <Button
        type="submit"
        variant="primary"
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
          <>
            <Send className="h-4 w-4" />
            Enquire About This Property
          </>
        )}
      </Button>

      {!user && (
        <p className="text-center text-xs text-slate-500">
          No account required to enquire.
        </p>
      )}
    </form>
  );
}
