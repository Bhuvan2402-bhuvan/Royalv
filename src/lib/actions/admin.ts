"use server";

import prisma from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import {
  requireStaff,
  requireAdmin,
  requireSuperAdmin,
  requirePropertyManager,
  canFeatureProperties,
} from "@/lib/auth/permissions";
import { logAudit } from "@/lib/audit/logger";
import {
  adminPropertySchema,
  propertyRejectSchema,
  updateEnquiryStatusSchema,
  updateSubmissionStatusSchema,
  createTeamMemberSchema,
  updateTeamMemberRoleSchema,
} from "@/lib/validators/admin";
import {
  PropertyWorkflowStatus,
  PropertySource,
  SellSubmissionStatus,
  UserRole,
  UserStatus,
} from "@prisma/client";

function generateSlug(title: string, city: string): string {
  const base = `${title} ${city}`
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${randomSuffix}`;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// -------------------------------------------------------------
// PROPERTY MANAGEMENT ACTIONS
// -------------------------------------------------------------

export async function createPropertyAction(
  formData: unknown,
  workflowIntent: "SAVE_DRAFT" | "SUBMIT_APPROVAL" | "PUBLISH" = "SAVE_DRAFT"
): Promise<ActionResult<{ propertyId: string; slug: string }>> {
  try {
    const user = await requireStaff();

    const parsed = adminPropertySchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        message: "Invalid property information. Please fix the highlighted errors.",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const data = parsed.data;
    const slug = generateSlug(data.title, data.city);

    let status: PropertyWorkflowStatus = PropertyWorkflowStatus.DRAFT;
    let submittedAt: Date | null = null;
    let publishedAt: Date | null = null;
    let publishedById: string | null = null;
    let approvedAt: Date | null = null;
    let approvedById: string | null = null;

    if (workflowIntent === "PUBLISH") {
      status = PropertyWorkflowStatus.PUBLISHED;
      publishedAt = new Date();
      publishedById = user.id;
      approvedAt = new Date();
      approvedById = user.id;
    } else if (workflowIntent === "SUBMIT_APPROVAL") {
      status = PropertyWorkflowStatus.PENDING_APPROVAL;
      submittedAt = new Date();
    }

    const newProperty = await prisma.property.create({
      data: {
        title: data.title,
        slug,
        tagline: data.tagline,
        description: data.description,
        propertyType: data.propertyType,
        listingCategory: data.listingCategory,
        status,
        source: PropertySource.INTERNAL,
        isFeatured: data.isFeatured && canFeatureProperties(user.role),
        isVerified: data.isVerified,
        price: data.price,
        pricePerSqFt: data.pricePerSqFt,
        priceOnRequest: data.priceOnRequest,
        isNegotiable: data.isNegotiable,
        city: data.city,
        locality: data.locality,
        subLocality: data.subLocality,
        landmark: data.landmark,
        address: data.address,
        pincode: data.pincode,
        state: data.state,
        country: data.country,
        latitude: data.latitude,
        longitude: data.longitude,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        balconies: data.balconies,
        carpetAreaSqFt: data.carpetAreaSqFt,
        builtUpAreaSqFt: data.builtUpAreaSqFt,
        plotAreaSqYards: data.plotAreaSqYards,
        plotAreaCents: data.plotAreaCents,
        facing: data.facing,
        furnishing: data.furnishing,
        floorNumber: data.floorNumber,
        totalFloors: data.totalFloors,
        ageOfProperty: data.ageOfProperty,
        reraApproved: data.reraApproved,
        reraNumber: data.reraNumber,
        amenities: data.amenities,
        createdById: user.id,
        assignedToId: data.assignedToId || null,
        submittedAt,
        approvedAt,
        approvedById,
        publishedAt,
        publishedById,
        images: {
          create: data.images.map((img, idx) => ({
            url: img.url,
            altText: img.altText || data.title,
            caption: img.caption,
            isFeatured: img.isFeatured || idx === 0,
            orderIndex: img.orderIndex ?? idx,
          })),
        },
      },
    });

    await logAudit({
      userId: user.id,
      action: "PROPERTY_CREATED",
      entity: "Property",
      entityId: newProperty.id,
      details: { title: newProperty.title, status: newProperty.status, slug: newProperty.slug },
    });

    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    revalidatePath("/");

    return {
      success: true,
      message: `Property "${newProperty.title}" created successfully as ${status.replace(/_/g, " ")}.`,
      data: { propertyId: newProperty.id, slug: newProperty.slug },
    };
  } catch (error) {
    console.error("createPropertyAction error:", error);
    return { success: false, message: error instanceof Error ? error.message : "Failed to create property." };
  }
}

export async function updatePropertyAction(
  propertyId: string,
  formData: unknown,
  workflowIntent?: "SAVE" | "SUBMIT_APPROVAL" | "PUBLISH"
): Promise<ActionResult> {
  try {
    const user = await requireStaff();

    const existing = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { images: true },
    });

    if (!existing) {
      return { success: false, message: "Property not found." };
    }

    const parsed = adminPropertySchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        message: "Invalid property information. Please fix the highlighted errors.",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const data = parsed.data;

    let status = existing.status;
    let submittedAt = existing.submittedAt;
    let publishedAt = existing.publishedAt;
    let publishedById = existing.publishedById;
    let approvedAt = existing.approvedAt;
    let approvedById = existing.approvedById;

    // Internal staff members (SuperAdmin, Admin, PropertyManager, FieldAgent) can manage and publish directly
    if (workflowIntent === "PUBLISH") {
      status = PropertyWorkflowStatus.PUBLISHED;
      publishedAt = new Date();
      publishedById = user.id;
      approvedAt = approvedAt || new Date();
      approvedById = approvedById || user.id;
    } else if (workflowIntent === "SUBMIT_APPROVAL") {
      status = PropertyWorkflowStatus.PENDING_APPROVAL;
      submittedAt = new Date();
    }

    // Replace images with new set
    await prisma.$transaction(async (tx) => {
      await tx.propertyImage.deleteMany({ where: { propertyId } });
      await tx.property.update({
        where: { id: propertyId },
        data: {
          title: data.title,
          tagline: data.tagline,
          description: data.description,
          propertyType: data.propertyType,
          listingCategory: data.listingCategory,
          status,
          isFeatured: data.isFeatured,
          isVerified: data.isVerified,
          price: data.price,
          pricePerSqFt: data.pricePerSqFt,
          priceOnRequest: data.priceOnRequest,
          isNegotiable: data.isNegotiable,
          city: data.city,
          locality: data.locality,
          subLocality: data.subLocality,
          landmark: data.landmark,
          address: data.address,
          pincode: data.pincode,
          state: data.state,
          country: data.country,
          latitude: data.latitude,
          longitude: data.longitude,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          balconies: data.balconies,
          carpetAreaSqFt: data.carpetAreaSqFt,
          builtUpAreaSqFt: data.builtUpAreaSqFt,
          plotAreaSqYards: data.plotAreaSqYards,
          plotAreaCents: data.plotAreaCents,
          facing: data.facing,
          furnishing: data.furnishing,
          floorNumber: data.floorNumber,
          totalFloors: data.totalFloors,
          ageOfProperty: data.ageOfProperty,
          reraApproved: data.reraApproved,
          reraNumber: data.reraNumber,
          amenities: data.amenities,
          assignedToId: data.assignedToId || null,
          submittedAt,
          approvedAt,
          approvedById,
          publishedAt,
          publishedById,
          images: {
            create: data.images.map((img, idx) => ({
              url: img.url,
              altText: img.altText || data.title,
              caption: img.caption,
              isFeatured: img.isFeatured || idx === 0,
              orderIndex: img.orderIndex ?? idx,
            })),
          },
        },
      });
    });

    await logAudit({
      userId: user.id,
      action: "PROPERTY_UPDATED",
      entity: "Property",
      entityId: propertyId,
      details: { title: data.title, status },
    });

    revalidatePath(`/admin/properties/${propertyId}`);
    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    revalidatePath(`/properties/${existing.slug}`);

    return { success: true, message: "Property updated successfully." };
  } catch (error) {
    console.error("updatePropertyAction error:", error);
    return { success: false, message: error instanceof Error ? error.message : "Failed to update property." };
  }
}

export async function submitPropertyForApprovalAction(propertyId: string): Promise<ActionResult> {
  try {
    const user = await requireStaff();
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return { success: false, message: "Property not found." };

    await prisma.property.update({
      where: { id: propertyId },
      data: {
        status: PropertyWorkflowStatus.PENDING_APPROVAL,
        submittedAt: new Date(),
      },
    });

    await logAudit({
      userId: user.id,
      action: "PROPERTY_SUBMITTED_FOR_APPROVAL",
      entity: "Property",
      entityId: propertyId,
      details: { title: property.title },
    });

    revalidatePath(`/admin/properties/${propertyId}`);
    revalidatePath("/admin/properties/pending");
    revalidatePath("/admin/properties");

    return { success: true, message: "Property submitted for administrator approval." };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to submit property." };
  }
}

export async function approvePropertyAction(
  propertyId: string,
  autoPublish: boolean = false
): Promise<ActionResult> {
  try {
    const user = await requirePropertyManager();
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return { success: false, message: "Property not found." };

    const status = autoPublish ? PropertyWorkflowStatus.PUBLISHED : PropertyWorkflowStatus.APPROVED;

    await prisma.property.update({
      where: { id: propertyId },
      data: {
        status,
        approvedAt: new Date(),
        approvedById: user.id,
        publishedAt: autoPublish ? new Date() : property.publishedAt,
        publishedById: autoPublish ? user.id : property.publishedById,
        rejectionReason: null,
      },
    });

    await logAudit({
      userId: user.id,
      action: autoPublish ? "PROPERTY_APPROVED_AND_PUBLISHED" : "PROPERTY_APPROVED",
      entity: "Property",
      entityId: propertyId,
      details: { title: property.title, autoPublish },
    });

    revalidatePath("/admin/properties/pending");
    revalidatePath("/admin/properties");
    revalidatePath("/properties");

    return {
      success: true,
      message: autoPublish
        ? `Property "${property.title}" approved and published to the website.`
        : `Property "${property.title}" approved successfully.`,
    };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to approve property." };
  }
}

export async function rejectPropertyAction(propertyId: string, reason: string): Promise<ActionResult> {
  try {
    const user = await requirePropertyManager();

    const parsed = propertyRejectSchema.safeParse({ reason });
    if (!parsed.success) {
      return { success: false, message: "A clear rejection reason (min 5 characters) is required." };
    }

    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return { success: false, message: "Property not found." };

    await prisma.property.update({
      where: { id: propertyId },
      data: {
        status: PropertyWorkflowStatus.REJECTED,
        rejectionReason: parsed.data.reason,
      },
    });

    await logAudit({
      userId: user.id,
      action: "PROPERTY_REJECTED",
      entity: "Property",
      entityId: propertyId,
      details: { title: property.title, reason: parsed.data.reason },
    });

    revalidatePath("/admin/properties/pending");
    revalidatePath("/admin/properties");

    return { success: true, message: `Property rejected. Reason recorded for team review.` };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to reject property." };
  }
}

export async function publishPropertyAction(propertyId: string): Promise<ActionResult> {
  try {
    const user = await requireStaff();
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return { success: false, message: "Property not found." };

    await prisma.property.update({
      where: { id: propertyId },
      data: {
        status: PropertyWorkflowStatus.PUBLISHED,
        publishedAt: new Date(),
        publishedById: user.id,
      },
    });

    await logAudit({
      userId: user.id,
      action: "PROPERTY_PUBLISHED",
      entity: "Property",
      entityId: propertyId,
      details: { title: property.title },
    });

    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    revalidatePath(`/properties/${property.slug}`);
    revalidatePath("/");

    return { success: true, message: `Property "${property.title}" is now LIVE on the website.` };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to publish property." };
  }
}

export async function unpublishPropertyAction(propertyId: string): Promise<ActionResult> {
  try {
    const user = await requireStaff();
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return { success: false, message: "Property not found." };

    await prisma.property.update({
      where: { id: propertyId },
      data: {
        status: PropertyWorkflowStatus.APPROVED,
      },
    });

    await logAudit({
      userId: user.id,
      action: "PROPERTY_UNPUBLISHED",
      entity: "Property",
      entityId: propertyId,
      details: { title: property.title },
    });

    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    revalidatePath(`/properties/${property.slug}`);
    revalidatePath("/");

    return { success: true, message: `Property removed from public listings.` };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to unpublish property." };
  }
}

export async function markPropertySoldAction(propertyId: string): Promise<ActionResult> {
  try {
    const user = await requireStaff();
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return { success: false, message: "Property not found." };

    await prisma.property.update({
      where: { id: propertyId },
      data: {
        status: PropertyWorkflowStatus.SOLD,
        soldAt: new Date(),
        soldById: user.id,
        previousStatus: property.status,
      },
    });

    await logAudit({
      userId: user.id,
      action: "PROPERTY_MARKED_SOLD",
      entity: "Property",
      entityId: propertyId,
      details: { title: property.title, previousStatus: property.status },
    });

    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    revalidatePath(`/properties/${property.slug}`);
    revalidatePath("/");

    return { success: true, message: `Property marked as SOLD.` };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to mark property as sold." };
  }
}

export async function markPropertyUnavailableAction(propertyId: string): Promise<ActionResult> {
  try {
    const user = await requireStaff();
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return { success: false, message: "Property not found." };

    await prisma.property.update({
      where: { id: propertyId },
      data: {
        status: PropertyWorkflowStatus.UNAVAILABLE,
        previousStatus: property.status,
      },
    });

    await logAudit({
      userId: user.id,
      action: "PROPERTY_MARKED_UNAVAILABLE",
      entity: "Property",
      entityId: propertyId,
      details: { title: property.title, previousStatus: property.status },
    });

    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    revalidatePath(`/properties/${property.slug}`);
    revalidatePath("/");

    return { success: true, message: `Property marked as UNAVAILABLE.` };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to mark property as unavailable." };
  }
}

export async function archivePropertyAction(propertyId: string): Promise<ActionResult> {
  try {
    const user = await requireStaff();
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return { success: false, message: "Property not found." };

    await prisma.property.update({
      where: { id: propertyId },
      data: {
        status: PropertyWorkflowStatus.ARCHIVED,
        archivedAt: new Date(),
        archivedById: user.id,
        previousStatus: property.status,
      },
    });

    await logAudit({
      userId: user.id,
      action: "PROPERTY_ARCHIVED",
      entity: "Property",
      entityId: propertyId,
      details: { title: property.title, previousStatus: property.status },
    });

    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    revalidatePath(`/properties/${property.slug}`);
    revalidatePath("/");

    return { success: true, message: `Property archived and removed from active listings.` };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to archive property." };
  }
}

export async function restorePropertyAction(propertyId: string): Promise<ActionResult> {
  try {
    const user = await requireStaff();
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return { success: false, message: "Property not found." };

    const restoredStatus = property.previousStatus === PropertyWorkflowStatus.PUBLISHED
      ? PropertyWorkflowStatus.PUBLISHED
      : PropertyWorkflowStatus.DRAFT;

    await prisma.property.update({
      where: { id: propertyId },
      data: {
        status: restoredStatus,
        archivedAt: null,
        archivedById: null,
      },
    });

    await logAudit({
      userId: user.id,
      action: "PROPERTY_RESTORED",
      entity: "Property",
      entityId: propertyId,
      details: { title: property.title, restoredStatus },
    });

    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    revalidatePath(`/properties/${property.slug}`);
    revalidatePath("/");

    return { success: true, message: `Property restored to ${restoredStatus}.` };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to restore property." };
  }
}

export async function permanentDeletePropertyAction(propertyId: string): Promise<ActionResult> {
  try {
    const user = await requireSuperAdmin();
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return { success: false, message: "Property not found." };

    await prisma.$transaction(async (tx) => {
      await tx.propertyImage.deleteMany({ where: { propertyId } });
      await tx.savedProperty.deleteMany({ where: { propertyId } });
      await tx.propertyEnquiry.deleteMany({ where: { propertyId } });
      await tx.property.delete({ where: { id: propertyId } });
    });

    await logAudit({
      userId: user.id,
      action: "PROPERTY_PERMANENTLY_DELETED",
      entity: "Property",
      entityId: propertyId,
      details: { title: property.title },
    });

    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    revalidatePath("/");

    return { success: true, message: `Property permanently deleted from database.` };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to permanently delete property." };
  }
}

export async function toggleFeaturePropertyAction(propertyId: string): Promise<ActionResult<{ isFeatured: boolean }>> {
  try {
    const user = await requireAdmin();
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return { success: false, message: "Property not found." };

    const updated = await prisma.property.update({
      where: { id: propertyId },
      data: { isFeatured: !property.isFeatured },
    });

    await logAudit({
      userId: user.id,
      action: updated.isFeatured ? "PROPERTY_FEATURED" : "PROPERTY_UNFEATURED",
      entity: "Property",
      entityId: propertyId,
      details: { isFeatured: updated.isFeatured },
    });

    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    revalidatePath("/");

    return {
      success: true,
      message: updated.isFeatured ? "Property marked as Featured." : "Property unfeatured.",
      data: { isFeatured: updated.isFeatured },
    };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to toggle featured status." };
  }
}

export async function assignPropertyAction(propertyId: string, agentId: string | null): Promise<ActionResult> {
  try {
    const user = await requireAdmin();
    await prisma.property.update({
      where: { id: propertyId },
      data: { assignedToId: agentId || null },
    });

    await logAudit({
      userId: user.id,
      action: "PROPERTY_ASSIGNED",
      entity: "Property",
      entityId: propertyId,
      details: { assignedToId: agentId },
    });

    revalidatePath("/admin/properties");
    return { success: true, message: "Property assignment updated." };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to assign property." };
  }
}

// -------------------------------------------------------------
// ENQUIRY & LEAD ACTIONS
// -------------------------------------------------------------

export async function updateEnquiryStatusAction(
  enquiryId: string,
  formData: unknown
): Promise<ActionResult> {
  try {
    const user = await requireStaff();

    const parsed = updateEnquiryStatusSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, message: "Invalid enquiry status data." };
    }

    const { status, internalNotes, assignedToId } = parsed.data;

    await prisma.propertyEnquiry.update({
      where: { id: enquiryId },
      data: {
        status,
        ...(internalNotes !== undefined && { internalNotes }),
        ...(assignedToId !== undefined && { assignedToId: assignedToId || null }),
      },
    });

    await logAudit({
      userId: user.id,
      action: "ENQUIRY_STATUS_UPDATED",
      entity: "PropertyEnquiry",
      entityId: enquiryId,
      details: { status, internalNotesRecorded: !!internalNotes, assignedToId },
    });

    revalidatePath("/admin/enquiries");
    revalidatePath("/dashboard/enquiries");

    return { success: true, message: `Enquiry status updated to ${status.replace(/_/g, " ")}.` };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to update enquiry." };
  }
}

export async function assignEnquiryAction(enquiryId: string, agentId: string | null): Promise<ActionResult> {
  try {
    const user = await requireAdmin();
    await prisma.propertyEnquiry.update({
      where: { id: enquiryId },
      data: { assignedToId: agentId || null },
    });

    await logAudit({
      userId: user.id,
      action: "ENQUIRY_ASSIGNED",
      entity: "PropertyEnquiry",
      entityId: enquiryId,
      details: { assignedToId: agentId },
    });

    revalidatePath("/admin/enquiries");
    return { success: true, message: "Enquiry lead assigned successfully." };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to assign lead." };
  }
}

// -------------------------------------------------------------
// SUBMISSIONS ACTIONS
// -------------------------------------------------------------

export async function updateSellSubmissionAction(
  submissionId: string,
  formData: unknown
): Promise<ActionResult> {
  try {
    const user = await requireStaff();

    const parsed = updateSubmissionStatusSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, message: "Invalid submission data." };
    }

    const { status, internalReviewNote, assignedToId } = parsed.data;

    await prisma.sellPropertySubmission.update({
      where: { id: submissionId },
      data: {
        status,
        reviewedById: user.id,
        ...(internalReviewNote !== undefined && { internalReviewNote }),
        ...(assignedToId !== undefined && { assignedToId: assignedToId || null }),
      },
    });

    await logAudit({
      userId: user.id,
      action: "SUBMISSION_STATUS_UPDATED",
      entity: "SellPropertySubmission",
      entityId: submissionId,
      details: { status, assignedToId },
    });

    revalidatePath("/admin/submissions");
    return { success: true, message: `Submission updated to ${status.replace(/_/g, " ")}.` };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to update submission." };
  }
}

export async function convertSubmissionToPropertyDraftAction(
  submissionId: string
): Promise<ActionResult<{ propertyId: string }>> {
  try {
    const user = await requireStaff();

    const sub = await prisma.sellPropertySubmission.findUnique({
      where: { id: submissionId },
    });

    if (!sub) return { success: false, message: "Submission not found." };

    const title = `${sub.propertyType.replace(/_/g, " ")} in ${sub.locality}, ${sub.city}`;
    const slug = generateSlug(title, sub.city);

    const draftProperty = await prisma.property.create({
      data: {
        title,
        slug,
        description: sub.description || `Property located at ${sub.address}, ${sub.locality}, ${sub.city}.`,
        propertyType: sub.propertyType,
        listingCategory: "BUY_PROPERTY",
        status: PropertyWorkflowStatus.DRAFT,
        price: sub.expectedPrice,
        city: sub.city,
        locality: sub.locality,
        address: sub.address,
        pincode: "522002",
        builtUpAreaSqFt: sub.builtUpAreaSqFt,
        plotAreaSqYards: sub.plotAreaSqYards,
        createdById: user.id,
        assignedToId: sub.assignedToId || user.id,
      },
    });

    await prisma.sellPropertySubmission.update({
      where: { id: submissionId },
      data: {
        status: SellSubmissionStatus.APPROVED_FOR_LISTING,
        reviewedById: user.id,
        internalReviewNote: `Converted to Draft Property (ID: ${draftProperty.id}) on ${new Date().toISOString()}`,
      },
    });

    await logAudit({
      userId: user.id,
      action: "SUBMISSION_CONVERTED_TO_DRAFT",
      entity: "SellPropertySubmission",
      entityId: submissionId,
      details: { propertyId: draftProperty.id },
    });

    revalidatePath("/admin/submissions");
    revalidatePath("/admin/properties");

    return {
      success: true,
      message: "Submission converted to Property Draft successfully.",
      data: { propertyId: draftProperty.id },
    };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to convert submission." };
  }
}

// -------------------------------------------------------------
// TEAM & USER MANAGEMENT ACTIONS
// -------------------------------------------------------------

export async function createTeamMemberAction(formData: unknown): Promise<ActionResult> {
  try {
    const user = await requireAdmin();

    const parsed = createTeamMemberSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        message: "Invalid team member information.",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const { name, email, phone, password, role } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return { success: false, message: "A user with this email address already exists." };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newMember = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        passwordHash,
        role,
        status: UserStatus.ACTIVE,
      },
    });

    await logAudit({
      userId: user.id,
      action: "TEAM_MEMBER_CREATED",
      entity: "User",
      entityId: newMember.id,
      details: { name: newMember.name, email: newMember.email, role: newMember.role },
    });

    revalidatePath("/admin/team");
    return { success: true, message: `Team member ${newMember.name} created as ${newMember.role}.` };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to create team member." };
  }
}

export async function updateTeamMemberRoleAction(
  targetUserId: string,
  formData: unknown
): Promise<ActionResult> {
  try {
    const user = await requireAdmin();

    if (user.id === targetUserId) {
      return { success: false, message: "You cannot change your own role or status." };
    }

    const parsed = updateTeamMemberRoleSchema.safeParse(formData);
    if (!parsed.success) {
      return { success: false, message: "Invalid role or status parameters." };
    }

    const { role, status } = parsed.data;

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) return { success: false, message: "Team member not found." };

    // Prevent demoting the last SUPER_ADMIN
    if (targetUser.role === UserRole.SUPER_ADMIN && role !== UserRole.SUPER_ADMIN) {
      const superAdminCount = await prisma.user.count({
        where: { role: UserRole.SUPER_ADMIN, status: UserStatus.ACTIVE },
      });
      if (superAdminCount <= 1) {
        return { success: false, message: "Cannot demote the sole active Super Admin." };
      }
    }

    await prisma.user.update({
      where: { id: targetUserId },
      data: { role, status },
    });

    await logAudit({
      userId: user.id,
      action: "TEAM_MEMBER_ROLE_UPDATED",
      entity: "User",
      entityId: targetUserId,
      details: { previousRole: targetUser.role, newRole: role, newStatus: status },
    });

    revalidatePath("/admin/team");
    return { success: true, message: `User ${targetUser.name} updated successfully.` };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to update user." };
  }
}

export async function deleteTeamMemberAction(targetUserId: string): Promise<ActionResult> {
  try {
    const user = await requireAdmin();

    if (user.id === targetUserId) {
      return { success: false, message: "You cannot delete your own logged-in account." };
    }

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) return { success: false, message: "Team member not found." };

    // Privilege check: ADMIN cannot delete SUPER_ADMIN or another ADMIN
    if (user.role !== UserRole.SUPER_ADMIN) {
      if (targetUser.role === UserRole.SUPER_ADMIN || targetUser.role === UserRole.ADMIN) {
        return { success: false, message: "Only Super Admins can delete administrative accounts." };
      }
    }

    // Protect sole Super Admin
    if (targetUser.role === UserRole.SUPER_ADMIN) {
      const superAdminCount = await prisma.user.count({
        where: { role: UserRole.SUPER_ADMIN },
      });
      if (superAdminCount <= 1) {
        return { success: false, message: "Cannot delete the sole Super Admin account." };
      }
    }

    // Step 1: Reassign / Unlink references to prevent FK violation
    await prisma.$transaction([
      prisma.property.updateMany({
        where: { assignedToId: targetUserId },
        data: { assignedToId: null },
      }),
      prisma.property.updateMany({
        where: { createdById: targetUserId },
        data: { createdById: user.id },
      }),
      prisma.property.updateMany({
        where: { approvedById: targetUserId },
        data: { approvedById: null },
      }),
      prisma.property.updateMany({
        where: { publishedById: targetUserId },
        data: { publishedById: null },
      }),
      prisma.property.updateMany({
        where: { soldById: targetUserId },
        data: { soldById: null },
      }),
      prisma.property.updateMany({
        where: { archivedById: targetUserId },
        data: { archivedById: null },
      }),
      prisma.propertyEnquiry.updateMany({
        where: { assignedToId: targetUserId },
        data: { assignedToId: null },
      }),
      prisma.propertyEnquiry.updateMany({
        where: { userId: targetUserId },
        data: { userId: null },
      }),
      prisma.sellPropertySubmission.updateMany({
        where: { assignedToId: targetUserId },
        data: { assignedToId: null },
      }),
      prisma.sellPropertySubmission.updateMany({
        where: { reviewedById: targetUserId },
        data: { reviewedById: null },
      }),
      prisma.sellPropertySubmission.updateMany({
        where: { userId: targetUserId },
        data: { userId: null },
      }),
      prisma.savedProperty.deleteMany({
        where: { userId: targetUserId },
      }),
      prisma.auditLog.updateMany({
        where: { userId: targetUserId },
        data: { userId: null },
      }),
      prisma.user.delete({
        where: { id: targetUserId },
      }),
    ]);

    await logAudit({
      userId: user.id,
      action: "TEAM_MEMBER_DELETED",
      entity: "User",
      entityId: targetUserId,
      details: { deletedName: targetUser.name, deletedEmail: targetUser.email, deletedRole: targetUser.role },
    });

    revalidatePath("/admin/team");
    return { success: true, message: `Staff member ${targetUser.name} (${targetUser.email}) has been permanently deleted.` };
  } catch (error) {
    console.error("deleteTeamMemberAction error:", error);
    return { success: false, message: error instanceof Error ? error.message : "Failed to delete team member." };
  }
}
