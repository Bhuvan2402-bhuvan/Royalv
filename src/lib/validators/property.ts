import { z } from "zod";
import { PropertyType, ListingCategory, FurnishingStatus, FacingDirection } from "@prisma/client";

export const propertyFilterSchema = z.object({
  city: z.string().optional(),
  locality: z.string().optional(),
  propertyType: z.nativeEnum(PropertyType).optional(),
  listingCategory: z.nativeEnum(ListingCategory).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  bedrooms: z.coerce.number().int().min(1).optional(),
  isFeatured: z.coerce.boolean().optional(),
  query: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  sortBy: z.enum(["newest", "price_asc", "price_desc", "featured"]).default("newest"),
});

export type PropertyFilterInput = z.infer<typeof propertyFilterSchema>;

export const propertyEnquirySchema = z.object({
  propertyId: z.string().cuid({ message: "Invalid property identifier" }),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().trim().regex(/^[+0-9\s-]{10,15}$/, "Please enter a valid 10-digit phone number"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
  preferredTime: z.string().max(100).optional(),
});

export type PropertyEnquiryInput = z.infer<typeof propertyEnquirySchema>;

export const sellPropertySubmissionSchema = z.object({
  ownerName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  ownerEmail: z.string().trim().email("Please enter a valid email address"),
  ownerPhone: z.string().trim().regex(/^[+0-9\s-]{10,15}$/, "Please enter a valid 10-digit phone number"),
  propertyType: z.nativeEnum(PropertyType, { errorMap: () => ({ message: "Please select a valid property type" }) }),
  city: z.string().trim().min(2, "City is required (e.g. Guntur, Vijayawada)"),
  locality: z.string().trim().min(2, "Locality / Area is required"),
  address: z.string().trim().min(5, "Address must be at least 5 characters"),
  expectedPrice: z.coerce.number().positive("Expected price must be greater than zero"),
  builtUpAreaSqFt: z.coerce.number().positive().optional(),
  plotAreaSqYards: z.coerce.number().positive().optional(),
  description: z.string().trim().max(2000).optional(),
});

export type SellPropertySubmissionInput = z.infer<typeof sellPropertySubmissionSchema>;

export const propertyCreateSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(200),
  tagline: z.string().trim().max(250).optional(),
  description: z.string().trim().min(20, "Description must be at least 20 characters"),
  propertyType: z.nativeEnum(PropertyType),
  listingCategory: z.nativeEnum(ListingCategory).default(ListingCategory.BUY_PROPERTY),
  price: z.coerce.number().positive("Price must be greater than zero"),
  pricePerSqFt: z.coerce.number().positive().optional(),
  priceOnRequest: z.boolean().default(false),
  isNegotiable: z.boolean().default(false),
  city: z.string().trim().min(2, "City is required"),
  locality: z.string().trim().min(2, "Locality is required"),
  subLocality: z.string().trim().optional(),
  landmark: z.string().trim().optional(),
  address: z.string().trim().min(5, "Address is required"),
  pincode: z.string().trim().regex(/^[0-9]{6}$/, "Pincode must be a 6-digit number"),
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(0).optional(),
  balconies: z.coerce.number().int().min(0).optional(),
  carpetAreaSqFt: z.coerce.number().positive().optional(),
  builtUpAreaSqFt: z.coerce.number().positive().optional(),
  plotAreaSqYards: z.coerce.number().positive().optional(),
  plotAreaCents: z.coerce.number().positive().optional(),
  facing: z.nativeEnum(FacingDirection).optional(),
  furnishing: z.nativeEnum(FurnishingStatus).default(FurnishingStatus.UNFURNISHED),
  floorNumber: z.coerce.number().int().optional(),
  totalFloors: z.coerce.number().int().optional(),
  ageOfProperty: z.coerce.number().int().min(0).optional(),
  reraApproved: z.boolean().default(false),
  reraNumber: z.string().trim().optional(),
  amenities: z.array(z.string()).optional(),
  isFeatured: z.boolean().default(false),
});

export type PropertyCreateInput = z.infer<typeof propertyCreateSchema>;
