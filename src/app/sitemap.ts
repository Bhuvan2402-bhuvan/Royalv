import { MetadataRoute } from "next";
import prisma from "@/lib/db/prisma";
import { PropertyWorkflowStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://royalvproperties.com";

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  try {
    const publishedProperties = await prisma.property.findMany({
      where: { status: PropertyWorkflowStatus.PUBLISHED },
      select: { slug: true, updatedAt: true },
    });

    const propertyRoutes: MetadataRoute.Sitemap = publishedProperties.map((prop) => ({
      url: `${baseUrl}/properties/${prop.slug}`,
      lastModified: prop.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...propertyRoutes];
  } catch (error) {
    console.error("[Sitemap Generation Error]:", error);
    return staticRoutes;
  }
}
