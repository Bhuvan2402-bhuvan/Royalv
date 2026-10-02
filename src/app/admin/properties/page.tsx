import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth/session";
import { canApproveProperties } from "@/lib/auth/permissions";
import { getAdminProperties } from "@/lib/queries/admin";
import { PropertyActions } from "@/components/admin/property-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPriceINR, formatDate } from "@/lib/utils/formatters";
import {
  Building2,
  Plus,
  Clock,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
} from "lucide-react";
import { PropertyWorkflowStatus, PropertyType } from "@prisma/client";

export const metadata: Metadata = {
  title: "Property Inventory",
  description: "Manage Royal V Properties inventory.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface AdminPropertiesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const STATUS_CONFIG: Record<
  PropertyWorkflowStatus,
  { label: string; variant: "default" | "success" | "warning" | "danger" | "gold" | "slate" | "info" }
> = {
  DRAFT: { label: "Draft", variant: "default" },
  PENDING_APPROVAL: { label: "Pending Approval", variant: "warning" },
  APPROVED: { label: "Approved", variant: "info" },
  PUBLISHED: { label: "Published", variant: "success" },
  REJECTED: { label: "Rejected", variant: "danger" },
  SOLD: { label: "Sold", variant: "slate" },
  UNAVAILABLE: { label: "Unavailable", variant: "slate" },
  ARCHIVED: { label: "Archived", variant: "slate" },
};

export default async function AdminPropertiesPage({ searchParams }: AdminPropertiesPageProps) {
  const resolvedSearchParams = await searchParams;
  const user = await getCurrentUser();
  const canApprove = canApproveProperties(user?.role);

  const query = typeof resolvedSearchParams.query === "string" ? resolvedSearchParams.query : undefined;
  const status = typeof resolvedSearchParams.status === "string" ? (resolvedSearchParams.status as PropertyWorkflowStatus) : undefined;
  const propertyType = typeof resolvedSearchParams.propertyType === "string" ? (resolvedSearchParams.propertyType as PropertyType) : undefined;
  const page = typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page, 10) : 1;

  const { properties, total, totalPages } = await getAdminProperties({
    query,
    status,
    propertyType,
    page,
    limit: 12,
  });

  const statusTabs: { label: string; value?: PropertyWorkflowStatus }[] = [
    { label: "All Properties" },
    { label: "Published", value: PropertyWorkflowStatus.PUBLISHED },
    { label: "Pending Approval", value: PropertyWorkflowStatus.PENDING_APPROVAL },
    { label: "Approved", value: PropertyWorkflowStatus.APPROVED },
    { label: "Drafts", value: PropertyWorkflowStatus.DRAFT },
    { label: "Rejected", value: PropertyWorkflowStatus.REJECTED },
    { label: "Sold", value: PropertyWorkflowStatus.SOLD },
    { label: "Archived", value: PropertyWorkflowStatus.ARCHIVED },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-5 w-5 text-emerald-800" />
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Property Inventory ({total})
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Create, edit, approve, and manage all property listings across Andhra Pradesh.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/admin/properties/pending">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              Approval Center
            </Button>
          </Link>
          <Link href="/admin/properties/new">
            <Button variant="primary" size="sm" className="gap-1.5 text-xs shadow-sm">
              <Plus className="h-3.5 w-3.5" />
              Add Property
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {statusTabs.map((tab) => {
          const isActive = status === tab.value;
          return (
            <Link
              key={tab.label}
              href={`/admin/properties?${new URLSearchParams({
                ...(query ? { query } : {}),
                ...(tab.value ? { status: tab.value } : {}),
              }).toString()}`}
              className={`rounded-xl px-3.5 py-2 font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {properties.length === 0 ? (
          <div className="p-16 text-center">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <Building2 className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">No properties found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {query || status
                ? "Try clearing your search query or status filter to see other records."
                : "Get started by adding the first property listing."}
            </p>
            <div className="mt-4">
              <Link href="/admin/properties/new">
                <Button variant="primary" size="sm">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Property
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned</th>
                  <th className="py-3 px-4">Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((property) => {
                  const statusInfo = STATUS_CONFIG[property.status] || {
                    label: property.status,
                    variant: "default",
                  };
                  const thumb =
                    property.images[0]?.url ||
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80";

                  return (
                    <tr key={property.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Property Title & Image */}
                      <td className="py-3.5 px-4 min-w-[240px]">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            <Image
                              src={thumb}
                              alt={property.title}
                              fill
                              className="object-cover"
                            />
                            {property.isFeatured && (
                              <div className="absolute top-0.5 right-0.5 bg-amber-500 text-slate-950 p-0.5 rounded">
                                <Star className="h-2.5 w-2.5 fill-current" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/admin/properties/${property.id}`}
                              className="font-bold text-slate-900 hover:text-emerald-800 line-clamp-1 text-xs"
                            >
                              {property.title}
                            </Link>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                              /{property.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-medium text-slate-700">
                          <MapPin className="h-3 w-3 text-emerald-700" />
                          <span>
                            {property.locality}, {property.city}
                          </span>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[11px]">
                          {property.propertyType.replace(/_/g, " ")}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-emerald-900 text-xs">
                          {formatPriceINR(property.price, { priceOnRequest: property.priceOnRequest })}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge variant={statusInfo.variant} className="text-[10px]">
                          {statusInfo.label}
                        </Badge>
                      </td>

                      {/* Assigned Agent */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                        {property.assignedTo ? (
                          <span className="font-medium text-slate-800">
                            {property.assignedTo.name}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>

                      {/* Updated */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                        {formatDate(property.updatedAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <PropertyActions
                          property={{
                            id: property.id,
                            slug: property.slug,
                            title: property.title,
                            status: property.status,
                            isFeatured: property.isFeatured,
                            assignedToId: property.assignedToId,
                          }}
                          canApprove={canApprove}
                          isSuperAdmin={user?.role === "SUPER_ADMIN"}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-500 font-medium">
              Page {page} of {totalPages} ({total} properties)
            </span>
            <div className="flex items-center gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/properties?${new URLSearchParams({
                    ...(query ? { query } : {}),
                    ...(status ? { status } : {}),
                    page: String(page - 1),
                  }).toString()}`}
                >
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                    Previous
                  </Button>
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/properties?${new URLSearchParams({
                    ...(query ? { query } : {}),
                    ...(status ? { status } : {}),
                    page: String(page + 1),
                  }).toString()}`}
                >
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    Next
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
