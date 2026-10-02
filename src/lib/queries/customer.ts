import prisma from "@/lib/db/prisma";

export async function getCustomerSavedProperties(userId: string) {
  return prisma.savedProperty.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      property: {
        include: {
          images: {
            where: { isFeatured: true },
            take: 1,
            orderBy: { orderIndex: "asc" },
          },
        },
      },
    },
  });
}

export async function getCustomerEnquiries(userId: string) {
  return prisma.propertyEnquiry.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          slug: true,
          city: true,
          locality: true,
          price: true,
          priceOnRequest: true,
          images: {
            where: { isFeatured: true },
            take: 1,
            orderBy: { orderIndex: "asc" },
          },
        },
      },
    },
  });
}

export async function getCustomerSellSubmissions(userId: string) {
  const submissions = await prisma.sellPropertySubmission.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return submissions.map((s) => ({
    ...s,
    expectedPrice: s.expectedPrice ? Number(s.expectedPrice) : 0,
    builtUpAreaSqFt: s.builtUpAreaSqFt ? Number(s.builtUpAreaSqFt) : null,
    plotAreaSqYards: s.plotAreaSqYards ? Number(s.plotAreaSqYards) : null,
  }));
}

export async function getCustomerDashboardCounts(userId: string) {
  const [savedCount, enquiriesCount, submissionsCount] = await Promise.all([
    prisma.savedProperty.count({ where: { userId } }),
    prisma.propertyEnquiry.count({ where: { userId } }),
    prisma.sellPropertySubmission.count({ where: { userId } }),
  ]);
  return { savedCount, enquiriesCount, submissionsCount };
}

export async function getCustomerProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      avatarUrl: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });
}
