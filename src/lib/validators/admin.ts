import { z } from "zod";
import {
  PropertyType,
  ListingCategory,
  FurnishingStatus,
  FacingDirection,
  EnquiryStatus,
  SellSubmissionStatus,
  UserRole,
  UserStatus,
} from "@prisma/client";

export const adminPropertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  tagline: z.string().max(250).optional().nullable(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  propertyType: z.nativeEnum(PropertyType),
  listingCategory: z.nativeEnum(ListingCategory).default(ListingCategory.BUY_PROPERTY),
  
  // Pricing
  price: z.coerce.number().min(0, "Price must be non-negative"),
  pricePerSqFt: z.coerce.number().min(0).optional().nullable(),
  priceOnRequest: z.boolean().default(false),
  isNegotiable: z.boolean().default(false),

  // Location
  city: z.string().min(2, "City is required"),
  locality: z.string().min(2, "Locality is required"),
  subLocality: z.string().optional().nullable(),
  landmark: z.string().optional().nullable(),
  address: z.string().min(5, "Full address is required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  state: z.string().default("Andhra Pradesh"),
  country: z.string().default("India"),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),

  // Specs
  bedrooms: z.coerce.number().int().min(0).max(50).optional().nullable(),
  bathrooms: z.coerce.number().int().min(0).max(50).optional().nullable(),
  balconies: z.coerce.number().int().min(0).max(20).optional().nullable(),
  carpetAreaSqFt: z.coerce.number().min(0).optional().nullable(),
  builtUpAreaSqFt: z.coerce.number().min(0).optional().nullable(),
  plotAreaSqYards: z.coerce.number().min(0).optional().nullable(),
  plotAreaCents: z.coerce.number().min(0).optional().nullable(),
  facing: z.nativeEnum(FacingDirection).optional().nullable(),
  furnishing: z.nativeEnum(FurnishingStatus).optional().nullable(),
  floorNumber: z.coerce.number().int().optional().nullable(),
  totalFloors: z.coerce.number().int().optional().nullable(),
  ageOfProperty: z.coerce.number().int().min(0).optional().nullable(),
  reraApproved: z.boolean().default(false),
  reraNumber: z.string().optional().nullable(),
  amenities: z.array(z.string()).default([]),

  // Badges & Assignment
  isFeatured: z.boolean().default(false),
  isVerified: z.boolean().default(false),
  assignedToId: z.string().optional().nullable(),

  // Images list (MANDATORY: At least 1 image required)
  images: z
    .array(
      z.object({
        url: z.string().url("Valid image URL required"),
        altText: z.string().optional().nullable(),
        caption: z.string().optional().nullable(),
        isFeatured: z.boolean().default(false),
        orderIndex: z.number().int().default(0),
      })
    )
    .min(1, "Uploading at least 1 property photograph is required"),
});

export const propertyRejectSchema = z.object({
  reason: z.string().min(5, "Rejection reason must be at least 5 characters"),
});

export const updateEnquiryStatusSchema = z.object({
  status: z.nativeEnum(EnquiryStatus),
  internalNotes: z.string().optional().nullable(),
  assignedToId: z.string().optional().nullable(),
});

export const updateSubmissionStatusSchema = z.object({
  status: z.nativeEnum(SellSubmissionStatus),
  internalReviewNote: z.string().optional().nullable(),
  assignedToId: z.string().optional().nullable(),
});

export const createTeamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email address required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number").optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum([UserRole.ADMIN, UserRole.PROPERTY_MANAGER, UserRole.FIELD_AGENT]),
});

export const updateTeamMemberRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
  status: z.nativeEnum(UserStatus),
});
