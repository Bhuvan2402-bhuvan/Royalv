"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Application Error Caught]:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4 py-16">
      <div className="text-center max-w-md bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="h-16 w-16 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mx-auto mb-5 border border-rose-100">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-rose-700 mb-2">Unexpected Error</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Something went wrong
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed">
          An unexpected error occurred while processing your request. Please try again or return to the homepage.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => reset()}
            className="w-full sm:w-auto justify-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full justify-center gap-2">
              <Home className="h-4 w-4" />
              Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
