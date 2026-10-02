"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  publishPropertyAction,
  unpublishPropertyAction,
  markPropertySoldAction,
  markPropertyUnavailableAction,
  archivePropertyAction,
  restorePropertyAction,
  permanentDeletePropertyAction,
  toggleFeaturePropertyAction,
} from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Globe,
  EyeOff,
  Star,
  CheckCircle,
  Archive,
  RotateCcw,
  Trash2,
  Edit,
  ExternalLink,
  Loader2,
  Ban,
} from "lucide-react";
import Link from "next/link";
import { PropertyWorkflowStatus } from "@prisma/client";

interface PropertyActionsProps {
  property: {
    id: string;
    slug: string;
    title: string;
    status: PropertyWorkflowStatus;
    isFeatured: boolean;
    assignedToId?: string | null;
  };
  canApprove?: boolean;
  isSuperAdmin?: boolean;
}

export function PropertyActions({
  property,
  canApprove = true,
  isSuperAdmin = false,
}: PropertyActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handlePublish = () => {
    startTransition(async () => {
      const res = await publishPropertyAction(property.id);
      if (res.success) router.refresh();
      else alert(res.message);
    });
  };

  const handleUnpublish = () => {
    startTransition(async () => {
      const res = await unpublishPropertyAction(property.id);
      if (res.success) router.refresh();
      else alert(res.message);
    });
  };

  const handleToggleFeature = () => {
    startTransition(async () => {
      const res = await toggleFeaturePropertyAction(property.id);
      if (res.success) router.refresh();
      else alert(res.message);
    });
  };

  const handleMarkSold = () => {
    if (!confirm(`Are you sure you want to mark "${property.title}" as SOLD?`)) return;
    startTransition(async () => {
      const res = await markPropertySoldAction(property.id);
      if (res.success) router.refresh();
      else alert(res.message);
    });
  };

  const handleMarkUnavailable = () => {
    if (!confirm(`Mark "${property.title}" as UNAVAILABLE?`)) return;
    startTransition(async () => {
      const res = await markPropertyUnavailableAction(property.id);
      if (res.success) router.refresh();
      else alert(res.message);
    });
  };

  const handleArchive = () => {
    if (!confirm(`Archive "${property.title}"? It will be removed from active listings but retained for internal records.`)) return;
    startTransition(async () => {
      const res = await archivePropertyAction(property.id);
      if (res.success) router.refresh();
      else alert(res.message);
    });
  };

  const handleRestore = () => {
    startTransition(async () => {
      const res = await restorePropertyAction(property.id);
      if (res.success) router.refresh();
      else alert(res.message);
    });
  };

  const handlePermanentDelete = () => {
    if (!confirm(`PERMANENT DESTRUCTIVE ACTION: Are you absolutely sure you want to permanently delete "${property.title}" from the database? This cannot be undone.`)) return;
    startTransition(async () => {
      const res = await permanentDeletePropertyAction(property.id);
      if (res.success) router.refresh();
      else alert(res.message);
    });
  };

  const isArchivedOrUnavailable =
    property.status === PropertyWorkflowStatus.ARCHIVED ||
    property.status === PropertyWorkflowStatus.UNAVAILABLE;

  return (
    <div className="flex items-center gap-1.5 justify-end">
      {/* Quick Edit */}
      <Link href={`/admin/properties/${property.id}`}>
        <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs">
          <Edit className="h-3.5 w-3.5 mr-1" />
          Edit
        </Button>
      </Link>

      {/* Dropdown Options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            disabled={isPending}
            className="h-8 w-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            ) : (
              <MoreVertical className="h-4 w-4" />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          {/* Public Preview */}
          {property.status === PropertyWorkflowStatus.PUBLISHED && (
            <DropdownMenuItem asChild>
              <Link href={`/properties/${property.slug}`} target="_blank" className="flex items-center gap-2">
                <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                <span>View Public Page</span>
              </Link>
            </DropdownMenuItem>
          )}

          {/* Publishing controls (all staff) */}
          {property.status === PropertyWorkflowStatus.PUBLISHED ? (
            <DropdownMenuItem onClick={handleUnpublish} className="flex items-center gap-2">
              <EyeOff className="h-3.5 w-3.5 text-slate-500" />
              <span>Unpublish</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handlePublish} className="flex items-center gap-2 text-emerald-700">
              <Globe className="h-3.5 w-3.5 text-emerald-600" />
              <span>Publish Now (Live)</span>
            </DropdownMenuItem>
          )}

          {/* Feature toggle */}
          {canApprove && (
            <DropdownMenuItem onClick={handleToggleFeature} className="flex items-center gap-2">
              <Star className={`h-3.5 w-3.5 ${property.isFeatured ? "text-amber-500 fill-amber-500" : "text-slate-500"}`} />
              <span>{property.isFeatured ? "Unfeature" : "Mark as Featured"}</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {/* Mark SOLD */}
          {property.status !== PropertyWorkflowStatus.SOLD && (
            <DropdownMenuItem onClick={handleMarkSold} className="flex items-center gap-2 text-slate-700">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
              <span>Mark as SOLD</span>
            </DropdownMenuItem>
          )}

          {/* Mark Unavailable */}
          {property.status !== PropertyWorkflowStatus.UNAVAILABLE && (
            <DropdownMenuItem onClick={handleMarkUnavailable} className="flex items-center gap-2 text-slate-700">
              <Ban className="h-3.5 w-3.5 text-amber-600" />
              <span>Mark Unavailable</span>
            </DropdownMenuItem>
          )}

          {/* Restore or Soft-Delete / Archive */}
          {isArchivedOrUnavailable ? (
            <DropdownMenuItem onClick={handleRestore} className="flex items-center gap-2 text-emerald-700">
              <RotateCcw className="h-3.5 w-3.5 text-emerald-600" />
              <span>Restore Property</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleArchive} className="flex items-center gap-2 text-amber-700">
              <Archive className="h-3.5 w-3.5 text-amber-600" />
              <span>Archive (Soft Delete)</span>
            </DropdownMenuItem>
          )}

          {/* Permanent Destructive Delete (Super Admin only) */}
          {isSuperAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handlePermanentDelete} className="flex items-center gap-2 text-rose-700 font-semibold">
                <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                <span>Permanent Delete</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
