import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

export interface LogAuditOptions {
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: Prisma.InputJsonValue;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Creates an immutable record in the audit log table.
 * Never throws an uncaught error to prevent breaking user-facing operations.
 */
export async function logAudit(options: LogAuditOptions): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: options.userId ?? null,
        action: options.action,
        entity: options.entity,
        entityId: options.entityId ?? null,
        details: options.details ?? Prisma.JsonNull,
        ipAddress: options.ipAddress ?? null,
        userAgent: options.userAgent ?? null,
      },
    });
  } catch (error) {
    console.error("[AuditLog Error] Failed to write audit record:", error);
  }
}
