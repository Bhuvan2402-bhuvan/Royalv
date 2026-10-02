"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toggleSavePropertyAction } from "@/lib/actions/properties";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SavePropertyButtonProps {
  propertyId: string;
  initialSaved: boolean;
  isAuthenticated: boolean;
  className?: string;
  size?: "sm" | "md";
}

export function SavePropertyButton({
  propertyId,
  initialSaved,
  isAuthenticated,
  className,
  size = "md",
}: SavePropertyButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // Optimistic update
    setIsSaved((prev) => !prev);

    startTransition(async () => {
      const result = await toggleSavePropertyAction(propertyId);
      if (result.error) {
        // Revert on error
        setIsSaved((prev) => !prev);
      } else {
        setIsSaved(result.saved);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      title={
        !isAuthenticated
          ? "Sign in to save properties"
          : isSaved
          ? "Remove from saved"
          : "Save this property"
      }
      className={cn(
        "flex items-center justify-center rounded-full transition-all duration-200",
        size === "sm"
          ? "h-8 w-8"
          : "h-10 w-10",
        isSaved
          ? "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100"
          : "bg-white/90 text-slate-400 border border-slate-200 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200",
        isPending && "opacity-60 cursor-not-allowed",
        className
      )}
      aria-pressed={isSaved}
      aria-label={isSaved ? "Remove from saved properties" : "Save property"}
    >
      <Heart
        className={cn(
          size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4",
          isSaved ? "fill-rose-500 stroke-rose-500" : "stroke-current fill-none"
        )}
      />
    </button>
  );
}
