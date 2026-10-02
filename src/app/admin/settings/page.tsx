import { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/session";
import { canManageUsers } from "@/lib/auth/permissions";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChangePasswordForm } from "@/components/auth/change-password-form";
import {
  Settings,
  Building2,
  Phone,
  MapPin,
  ShieldCheck,
  Server,
  CheckCircle2,
  Info,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Platform Settings",
  description: "Configure Royal V Properties company details and platform parameters.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();
  const isAdmin = canManageUsers(user?.role);

  const serviceRegions = [
    "Guntur City & Suburbs",
    "Vijayawada Urban & Rural",
    "Amaravati Capital Region",
    "Mangalagiri Corridor",
    "Tadepalli",
    "Tenali & Surrounding Areas",
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="h-5 w-5 text-emerald-800" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Platform & Company Settings
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Manage company branding, regional contact information, and infrastructure environment parameters.
          </p>
        </div>
        <Badge variant={isAdmin ? "gold" : "default"} className="text-xs font-semibold self-start sm:self-auto">
          <ShieldCheck className="h-3.5 w-3.5 mr-1" />
          {isAdmin ? "Admin Full Access" : "Staff View Mode"}
        </Badge>
      </div>

      {/* Section 1: Company Profile */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-emerald-800" />
          1. Company &amp; Brand Identity
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Company Legal Name</label>
            <Input defaultValue="Royal V Properties (Branch of Varunya Tech)" readOnly={!isAdmin} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Parent Enterprise Organization</label>
            <Input defaultValue="Varunya Tech" readOnly />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Founder &amp; Chairman</label>
            <Input defaultValue="V.V.S.R.Krishna Prasad" readOnly={!isAdmin} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Technology &amp; Hosting Partner</label>
            <Input defaultValue="VarunyaTech (varunyatech.in)" readOnly />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Official Brand Slogan</label>
            <Input
              defaultValue="Trusted Real Estate Advisory & Property Discovery in Andhra Pradesh Since 2006 · Branch of Varunya Tech"
              readOnly={!isAdmin}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Head Office Address</label>
            <Textarea
              defaultValue="SVN Colony, Guntur, Andhra Pradesh — 522006, India"
              rows={2}
              readOnly={!isAdmin}
            />
          </div>
        </div>
      </div>

      {/* Section 2: Contact & Inquiry Channels */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Phone className="h-4 w-4 text-emerald-800" />
          2. Customer Support & WhatsApp Channels
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Primary Hotline</label>
            <Input defaultValue="+91 98858 39645" readOnly={!isAdmin} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Secondary Hotlines</label>
            <Input defaultValue="+91 97000 71279, +91 94917 96224" readOnly={!isAdmin} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Official WhatsApp</label>
            <Input defaultValue="+91 98858 39645" readOnly={!isAdmin} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Email</label>
            <Input defaultValue="royalvproperties@gmail.com" readOnly={!isAdmin} />
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <label className="block text-xs font-bold text-slate-700 mb-1">Working Hours</label>
            <Input defaultValue="Monday – Saturday: 9:30 AM to 7:00 PM IST (Sunday by appointment)" readOnly={!isAdmin} />
          </div>
        </div>
      </div>

      {/* Section 3: Active Service Coverage Regions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-emerald-800" />
          3. Active Operational Service Regions
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {serviceRegions.map((region) => (
            <div
              key={region}
              className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>{region}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: System Architecture & Health Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Server className="h-4 w-4 text-emerald-800" />
          4. System Infrastructure & Security Parameters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Database Engine</span>
            <span className="text-xs font-bold text-slate-900 mt-1 block">PostgreSQL (Prisma ORM)</span>
            <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" /> Connected
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Session Security</span>
            <span className="text-xs font-bold text-slate-900 mt-1 block">JWT (HS256)</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">7-day HTTP-only Cookie</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Media Storage</span>
            <span className="text-xs font-bold text-slate-900 mt-1 block">Local Disk / S3 Ready</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Max 5MB (JPEG, PNG, WebP)</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Environment</span>
            <span className="text-xs font-bold text-slate-900 mt-1 block">Docker / Ubuntu Ready</span>
            <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">Node.js Production</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl bg-blue-50 border border-blue-200 p-4 text-xs text-blue-900">
          <Info className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Note: Core environment secrets (such as <code className="font-mono text-blue-950 font-bold">DATABASE_URL</code> and <code className="font-mono text-blue-950 font-bold">AUTH_SECRET</code>) are configured via server environment variables and cannot be modified from the web portal for maximum security.
          </p>
        </div>
      </div>

      {/* Section 5: Staff Password Management */}
      <ChangePasswordForm />
    </div>
  );
}
