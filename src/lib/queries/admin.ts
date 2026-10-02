import prisma from "@/lib/db/prisma";
import {
  PropertyWorkflowStatus,
  PropertyType,
  EnquiryStatus,
  SellSubmissionStatus,
  UserRole,
  Prisma,
} from "@prisma/client";

export async function getAdminDashboardMetrics(userId?: string, role?: UserRole) {
  const isAgent = role === UserRole.FIELD_AGENT;

  const [
    totalProperties,
    publishedProperties,
    pendingApprovals,
    draftProperties,
    soldProperties,
    newEnquiries,
    openLeads,
    totalSubmissions,
    pendingSubmissions,
    teamMembersCount,
    assignedPropertiesCount,
    assignedEnquiriesCount,
    scheduledVisitsCount,
    mySoldPropertiesCount,
    recentActivity,
    pendingPropertiesList,
    recentEnquiriesList,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { status: PropertyWorkflowStatus.PUBLISHED } }),
    prisma.property.count({ where: { status: PropertyWorkflowStatus.PENDING_APPROVAL } }),
    prisma.property.count({ where: { status: PropertyWorkflowStatus.DRAFT } }),
    prisma.property.count({ where: { status: PropertyWorkflowStatus.SOLD } }),
    prisma.propertyEnquiry.count({ where: { status: EnquiryStatus.NEW } }),
    prisma.propertyEnquiry.count({
      where: {
        status: { in: [EnquiryStatus.NEW, EnquiryStatus.IN_REVIEW, EnquiryStatus.CONTACTED, EnquiryStatus.SCHEDULED_VISIT] },
      },
    }),
    prisma.sellPropertySubmission.count(),
    prisma.sellPropertySubmission.count({ where: { status: SellSubmissionStatus.PENDING } }),
    prisma.user.count({ where: { status: "ACTIVE", role: { not: UserRole.CUSTOMER } } }),
    userId ? prisma.property.count({ where: { OR: [{ assignedToId: userId }, { createdById: userId }] } }) : 0,
    userId ? prisma.propertyEnquiry.count({ where: { assignedToId: userId } }) : 0,
    prisma.propertyEnquiry.count({ where: { status: EnquiryStatus.SCHEDULED_VISIT, ...(userId && isAgent ? { assignedToId: userId } : {}) } }),
    userId ? prisma.property.count({ where: { status: PropertyWorkflowStatus.SOLD, OR: [{ soldById: userId }, { createdById: userId }, { assignedToId: userId }] } }) : 0,
    prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    }),
    prisma.property.findMany({
      where: { status: PropertyWorkflowStatus.PENDING_APPROVAL },
      take: 5,
      orderBy: { submittedAt: "desc" },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        images: { take: 1, orderBy: { orderIndex: "asc" } },
      },
    }),
    prisma.propertyEnquiry.findMany({
      where: userId && isAgent ? { assignedToId: userId } : {},
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        property: { select: { id: true, title: true, slug: true, city: true } },
        assignedTo: { select: { id: true, name: true } },
      },
    }),
  ]);

  return {
    totalProperties,
    publishedProperties,
    pendingApprovals,
    draftProperties,
    soldProperties,
    newEnquiries,
    openLeads,
    totalSubmissions,
    pendingSubmissions,
    teamMembersCount,
    assignedPropertiesCount,
    assignedEnquiriesCount,
    scheduledVisitsCount,
    mySoldPropertiesCount,
    recentActivity,
    pendingPropertiesList,
    recentEnquiriesList,
  };
}

export interface AdminPropertyFilters {
  query?: string;
  status?: PropertyWorkflowStatus;
  propertyType?: PropertyType;
  city?: string;
  assignedToId?: string;
  page?: number;
  limit?: number;
}

// Helper to serialize Prisma Decimal objects to standard JS numbers for Client Components
function serializeProperty<T extends { price: unknown; pricePerSqFt?: unknown; builtUpAreaSqFt?: unknown; carpetAreaSqFt?: unknown; plotAreaSqYards?: unknown; plotAreaCents?: unknown; latitude?: unknown; longitude?: unknown }>(p: T) {
  return {
    ...p,
    price: p.price ? Number(p.price) : 0,
    pricePerSqFt: p.pricePerSqFt ? Number(p.pricePerSqFt) : null,
    builtUpAreaSqFt: p.builtUpAreaSqFt ? Number(p.builtUpAreaSqFt) : null,
    carpetAreaSqFt: p.carpetAreaSqFt ? Number(p.carpetAreaSqFt) : null,
    plotAreaSqYards: p.plotAreaSqYards ? Number(p.plotAreaSqYards) : null,
    plotAreaCents: p.plotAreaCents ? Number(p.plotAreaCents) : null,
    latitude: p.latitude ? Number(p.latitude) : null,
    longitude: p.longitude ? Number(p.longitude) : null,
  };
}

function serializeSubmission<T extends { expectedPrice?: unknown; builtUpAreaSqFt?: unknown; plotAreaSqYards?: unknown }>(s: T) {
  return {
    ...s,
    expectedPrice: s.expectedPrice ? Number(s.expectedPrice) : 0,
    builtUpAreaSqFt: s.builtUpAreaSqFt ? Number(s.builtUpAreaSqFt) : null,
    plotAreaSqYards: s.plotAreaSqYards ? Number(s.plotAreaSqYards) : null,
  };
}

export async function getAdminProperties(filters: AdminPropertyFilters = {}) {
  const { query, status, propertyType, city, assignedToId, page = 1, limit = 15 } = filters;

  const where: Prisma.PropertyWhereInput = {
    ...(status && { status }),
    ...(propertyType && { propertyType }),
    ...(city && { city: { contains: city, mode: "insensitive" } }),
    ...(assignedToId && { assignedToId }),
    ...(query && {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { locality: { contains: query, mode: "insensitive" } },
        { city: { contains: query, mode: "insensitive" } },
        { slug: { contains: query, mode: "insensitive" } },
      ],
    }),
  };

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        images: { take: 1, orderBy: { orderIndex: "asc" } },
      },
    }),
    prisma.property.count({ where }),
  ]);

  return {
    properties: properties.map(serializeProperty),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getPendingApprovalProperties() {
  const properties = await prisma.property.findMany({
    where: { status: PropertyWorkflowStatus.PENDING_APPROVAL },
    orderBy: { submittedAt: "asc" },
    include: {
      createdBy: { select: { id: true, name: true, email: true, role: true } },
      assignedTo: { select: { id: true, name: true } },
      images: { orderBy: { orderIndex: "asc" } },
    },
  });

  return properties.map(serializeProperty);
}

export async function getAdminPropertyById(id: string) {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, name: true, email: true, role: true } },
      approvedBy: { select: { id: true, name: true, email: true } },
      publishedBy: { select: { id: true, name: true, email: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
      images: { orderBy: { orderIndex: "asc" } },
    },
  });

  if (!property) return null;

  // Retrieve property-specific audit logs
  const auditLogs = await prisma.auditLog.findMany({
    where: { entity: "Property", entityId: id },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  return { ...serializeProperty(property), auditLogs };
}

export interface AdminEnquiryFilters {
  query?: string;
  status?: EnquiryStatus;
  assignedToId?: string;
  page?: number;
  limit?: number;
}

export async function getAdminEnquiries(filters: AdminEnquiryFilters = {}) {
  const { query, status, assignedToId, page = 1, limit = 15 } = filters;

  const where: Prisma.PropertyEnquiryWhereInput = {
    ...(status && { status }),
    ...(assignedToId && { assignedToId }),
    ...(query && {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { phone: { contains: query, mode: "insensitive" } },
        { property: { title: { contains: query, mode: "insensitive" } } },
      ],
    }),
  };

  const [enquiries, total] = await Promise.all([
    prisma.propertyEnquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
            city: true,
            locality: true,
            price: true,
            propertyType: true,
          },
        },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.propertyEnquiry.count({ where }),
  ]);

  const serializedEnquiries = enquiries.map((enq) => ({
    ...enq,
    property: {
      ...enq.property,
      price: enq.property.price ? Number(enq.property.price) : 0,
    },
  }));

  return {
    enquiries: serializedEnquiries,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export interface AdminSubmissionFilters {
  query?: string;
  status?: SellSubmissionStatus;
  assignedToId?: string;
  page?: number;
  limit?: number;
}

export async function getAdminSubmissions(filters: AdminSubmissionFilters = {}) {
  const { query, status, assignedToId, page = 1, limit = 15 } = filters;

  const where: Prisma.SellPropertySubmissionWhereInput = {
    ...(status && { status }),
    ...(assignedToId && { assignedToId }),
    ...(query && {
      OR: [
        { ownerName: { contains: query, mode: "insensitive" } },
        { ownerEmail: { contains: query, mode: "insensitive" } },
        { ownerPhone: { contains: query, mode: "insensitive" } },
        { locality: { contains: query, mode: "insensitive" } },
        { city: { contains: query, mode: "insensitive" } },
      ],
    }),
  };

  const [submissions, total] = await Promise.all([
    prisma.sellPropertySubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        reviewedBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.sellPropertySubmission.count({ where }),
  ]);

  return {
    submissions: submissions.map(serializeSubmission),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getAdminTeam() {
  return prisma.user.findMany({
    where: {
      role: { in: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PROPERTY_MANAGER, UserRole.FIELD_AGENT] },
    },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
      lastLoginAt: true,
      _count: {
        select: {
          createdProperties: true,
          assignedProperties: true,
          assignedEnquiries: true,
          assignedSubmissions: true,
        },
      },
    },
  });
}

export interface AdminAuditFilters {
  action?: string;
  entity?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

export async function getAdminAuditLogs(filters: AdminAuditFilters = {}) {
  const { action, entity, userId, page = 1, limit = 25 } = filters;

  const where: Prisma.AuditLogWhereInput = {
    ...(action && { action: { contains: action, mode: "insensitive" } }),
    ...(entity && { entity }),
    ...(userId && { userId }),
  };

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    logs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
