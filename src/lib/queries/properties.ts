import prisma from "@/lib/db/prisma";
import { PropertyWorkflowStatus, PropertyType, ListingCategory, Prisma } from "@prisma/client";

export interface PropertyFilters {
  query?: string;
  city?: string;
  locality?: string;
  propertyType?: PropertyType;
  listingCategory?: ListingCategory;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "newest" | "price_asc" | "price_desc" | "featured";
}

export async function getPublishedProperties(filters: PropertyFilters = {}) {
  const {
    query,
    city,
    locality,
    propertyType,
    listingCategory,
    minPrice,
    maxPrice,
    bedrooms,
    isFeatured,
    page = 1,
    limit = 12,
    sortBy = "newest",
  } = filters;

  const where: Prisma.PropertyWhereInput = {
    status: PropertyWorkflowStatus.PUBLISHED,
    ...(query && {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { locality: { contains: query, mode: "insensitive" } },
        { city: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tagline: { contains: query, mode: "insensitive" } },
      ],
    }),
    ...(city && { city: { contains: city, mode: "insensitive" } }),
    ...(locality && { locality: { contains: locality, mode: "insensitive" } }),
    ...(propertyType && { propertyType }),
    ...(listingCategory && { listingCategory }),
    ...(minPrice !== undefined && { price: { gte: minPrice } }),
    ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
    ...(bedrooms !== undefined && { bedrooms }),
    ...(isFeatured !== undefined && { isFeatured }),
  };

  const orderBy: Prisma.PropertyOrderByWithRelationInput | Prisma.PropertyOrderByWithRelationInput[] =
    sortBy === "price_asc"
      ? { price: "asc" }
      : sortBy === "price_desc"
      ? { price: "desc" }
      : sortBy === "featured"
      ? [{ isFeatured: "desc" }, { publishedAt: "desc" }]
      : { publishedAt: "desc" };

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        images: {
          where: { isFeatured: true },
          take: 1,
          orderBy: { orderIndex: "asc" },
        },
      },
    }),
    prisma.property.count({ where }),
  ]);

  return {
    properties,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getPropertyBySlug(slug: string) {
  return prisma.property.findUnique({
    where: { slug, status: PropertyWorkflowStatus.PUBLISHED },
    include: {
      images: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });
}

export async function getFeaturedProperties(limit = 6) {
  return prisma.property.findMany({
    where: { status: PropertyWorkflowStatus.PUBLISHED, isFeatured: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: {
      images: {
        where: { isFeatured: true },
        take: 1,
        orderBy: { orderIndex: "asc" },
      },
    },
  });
}

export async function getRecentProperties(limit = 6) {
  return prisma.property.findMany({
    where: { status: PropertyWorkflowStatus.PUBLISHED },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: {
      images: {
        where: { isFeatured: true },
        take: 1,
        orderBy: { orderIndex: "asc" },
      },
    },
  });
}

export async function isPropertySavedByUser(
  userId: string,
  propertyId: string
): Promise<boolean> {
  const saved = await prisma.savedProperty.findUnique({
    where: { userId_propertyId: { userId, propertyId } },
    select: { id: true },
  });
  return !!saved;
}

export async function getDistinctCities(): Promise<string[]> {
  const results = await prisma.property.findMany({
    where: { status: PropertyWorkflowStatus.PUBLISHED },
    select: { city: true },
    distinct: ["city"],
    orderBy: { city: "asc" },
  });
  return results.map((r) => r.city);
}
