import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4 py-16">
      <div className="text-center max-w-md bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="h-16 w-16 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-5 border border-emerald-100">
          <Building2 className="h-8 w-8" />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-800 mb-2">404 Error</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Page Not Found
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed">
          The property listing or page you are looking for might have been sold, unpublished, or the address may have changed.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/properties" className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full justify-center gap-2">
              <Search className="h-4 w-4" />
              Browse Properties
            </Button>
          </Link>
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
