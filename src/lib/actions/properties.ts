"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { propertyEnquirySchema, sellPropertySubmissionSchema } from "@/lib/validators/property";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { AuthResult } from "@/types/auth";

// ─── Submit Property Enquiry ────────────────────────────────────────────────

export async function submitEnquiryAction(
  prevState: unknown,
  formData: FormData
): Promise<AuthResult> {
  const rawData = {
    propertyId: formData.get("propertyId"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
    preferredTime: formData.get("preferredTime") || undefined,
  };

  const validation = propertyEnquirySchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Please correct the errors below.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { propertyId, name, email, phone, message, preferredTime } =
    validation.data;

  // Rate limiting per email/phone
  const rateLimit = checkRateLimit(`enquiry_${email.toLowerCase()}`, { limit: 5, windowSeconds: 120 });
  if (!rateLimit.allowed) {
    return {
      success: false,
      message: "Too many enquiries submitted recently. Please wait a couple minutes.",
    };
  }

  try {
    // Verify property exists and is published
    const property = await prisma.property.findUnique({
      where: { id: propertyId, status: "PUBLISHED" },
      select: { id: true, title: true },
    });

    if (!property) {
      return { success: false, message: "Property not found or not available." };
    }

    // Get optional user session
    const user = await getCurrentUser();

    await prisma.propertyEnquiry.create({
      data: {
        propertyId,
        userId: user?.id ?? null,
        name,
        email,
        phone,
        message,
        preferredTime: preferredTime || null,
        status: "NEW",
      },
    });

    if (user) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "ENQUIRY_SUBMITTED",
          entity: "PropertyEnquiry",
          entityId: propertyId,
          details: { propertyTitle: property.title },
        },
      });
    }

    return {
      success: true,
      message:
        "Your enquiry has been submitted. Our team will contact you shortly.",
    };
  } catch (error) {
    console.error("Enquiry submission error:", error);
    return {
      success: false,
      message: "Failed to submit enquiry. Please try again.",
    };
  }
}

// ─── Toggle Save Property ────────────────────────────────────────────────────

export async function toggleSavePropertyAction(
  propertyId: string
): Promise<{ saved: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { saved: false, error: "You must be logged in to save properties." };
  }

  try {
    const existing = await prisma.savedProperty.findUnique({
      where: { userId_propertyId: { userId: user.id, propertyId } },
    });

    if (existing) {
      await prisma.savedProperty.delete({
        where: { userId_propertyId: { userId: user.id, propertyId } },
      });
      revalidatePath(`/properties`);
      revalidatePath(`/dashboard/saved-properties`);
      return { saved: false };
    } else {
      await prisma.savedProperty.create({
        data: { userId: user.id, propertyId },
      });
      revalidatePath(`/properties`);
      revalidatePath(`/dashboard/saved-properties`);
      return { saved: true };
    }
  } catch (error) {
    console.error("Toggle save error:", error);
    return { saved: false, error: "Failed to update saved properties." };
  }
}

// ─── Submit Sell Property Request ───────────────────────────────────────────

export async function submitSellPropertyAction(
  prevState: unknown,
  formData: FormData
): Promise<AuthResult> {
  const rawData = {
    ownerName: formData.get("ownerName"),
    ownerEmail: formData.get("ownerEmail"),
    ownerPhone: formData.get("ownerPhone"),
    propertyType: formData.get("propertyType"),
    city: formData.get("city"),
    locality: formData.get("locality"),
    address: formData.get("address"),
    expectedPrice: formData.get("expectedPrice"),
    builtUpAreaSqFt: formData.get("builtUpAreaSqFt") || undefined,
    plotAreaSqYards: formData.get("plotAreaSqYards") || undefined,
    description: formData.get("description") || undefined,
  };

  const validation = sellPropertySubmissionSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Please correct the errors below.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const user = await getCurrentUser();

  try {
    const submission = await prisma.sellPropertySubmission.create({
      data: {
        ...validation.data,
        userId: user?.id ?? null,
        status: "PENDING",
      },
    });

    if (user) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "SELL_SUBMISSION_CREATED",
          entity: "SellPropertySubmission",
          entityId: submission.id,
          details: { city: validation.data.city, propertyType: validation.data.propertyType },
        },
      });
    }

    revalidatePath("/dashboard/submit-property");

    return {
      success: true,
      message:
        "Your property submission has been received. Our team will review it and contact you soon.",
    };
  } catch (error) {
    console.error("Sell submission error:", error);
    return {
      success: false,
      message: "Failed to submit your property. Please try again.",
    };
  }
}
