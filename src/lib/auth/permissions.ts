import { UserRole } from "@prisma/client";
import { getCurrentUser } from "./session";
import { SessionUser } from "@/types/auth";

export const SUPER_ADMIN_ROLES: UserRole[] = [UserRole.SUPER_ADMIN];
export const ADMIN_ROLES: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN];
export const SUBMISSION_REVIEW_ROLES: UserRole[] = [
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.PROPERTY_MANAGER,
];
export const PROPERTY_APPROVAL_ROLES = SUBMISSION_REVIEW_ROLES;
export const STAFF_ROLES: UserRole[] = [
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.PROPERTY_MANAGER,
  UserRole.FIELD_AGENT,
];

/**
 * Checks if a user has one of the allowed roles.
 */
export function hasRole(userRole: UserRole | undefined | null, allowedRoles: UserRole[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

/**
 * Staff permission check for creating & editing property listings (drafting & direct publishing).
 * Allowed: SUPER_ADMIN, ADMIN, PROPERTY_MANAGER, FIELD_AGENT
 */
export function canManageProperties(role: UserRole | undefined | null): boolean {
  return hasRole(role, STAFF_ROLES);
}

/**
 * Permission check for publishing properties directly to the public website.
 * CRITICAL RULE: Any internal staff member (SUPER_ADMIN, ADMIN, PROPERTY_MANAGER, FIELD_AGENT)
 * can create and publish properties immediately without waiting for approval.
 */
export function canPublishProperties(role: UserRole | undefined | null): boolean {
  return hasRole(role, STAFF_ROLES);
}

/**
 * Permission check for unpublishing properties.
 * Allowed: SUPER_ADMIN, ADMIN, PROPERTY_MANAGER, FIELD_AGENT
 */
export function canUnpublishProperties(role: UserRole | undefined | null): boolean {
  return hasRole(role, STAFF_ROLES);
}

/**
 * Permission check for featuring properties on homepage.
 * Allowed: SUPER_ADMIN, ADMIN, PROPERTY_MANAGER
 */
export function canFeatureProperties(role: UserRole | undefined | null): boolean {
  return hasRole(role, SUBMISSION_REVIEW_ROLES);
}

/**
 * Permission check for reviewing & approving customer property submissions.
 * Allowed: SUPER_ADMIN, ADMIN, PROPERTY_MANAGER
 */
export function canApproveSubmissions(role: UserRole | undefined | null): boolean {
  return hasRole(role, SUBMISSION_REVIEW_ROLES);
}

/**
 * Alias for approving properties/submissions
 */
export function canApproveProperties(role: UserRole | undefined | null): boolean {
  return hasRole(role, SUBMISSION_REVIEW_ROLES);
}

/**
 * Permission check for user management and staff accounts (Office Operations & Team).
 * Allowed: SUPER_ADMIN, ADMIN
 */
export function canManageUsers(role: UserRole | undefined | null): boolean {
  return hasRole(role, ADMIN_ROLES);
}

/**
 * Permission check for assigning leads, enquiries, and properties.
 * Allowed: SUPER_ADMIN, ADMIN, PROPERTY_MANAGER
 */
export function canAssignLeads(role: UserRole | undefined | null): boolean {
  return hasRole(role, SUBMISSION_REVIEW_ROLES);
}

/**
 * Permission check for reviewing customer submissions.
 * Allowed: SUPER_ADMIN, ADMIN, PROPERTY_MANAGER
 */
export function canReviewSubmissions(role: UserRole | undefined | null): boolean {
  return hasRole(role, SUBMISSION_REVIEW_ROLES);
}

/**
 * Permission check for marking properties SOLD, UNAVAILABLE, or Soft Delete / Archive.
 * Allowed: SUPER_ADMIN, ADMIN, PROPERTY_MANAGER, FIELD_AGENT
 */
export function canMarkSoldOrArchive(role: UserRole | undefined | null): boolean {
  return hasRole(role, STAFF_ROLES);
}

/**
 * Permission check for restoring archived properties.
 * Allowed: SUPER_ADMIN, ADMIN, PROPERTY_MANAGER, FIELD_AGENT
 */
export function canRestoreProperties(role: UserRole | undefined | null): boolean {
  return hasRole(role, STAFF_ROLES);
}

/**
 * Permission check for PERMANENT destructive deletion of database records.
 * STRICT: Only SUPER_ADMIN can perform permanent deletion.
 */
export function canPermanentDelete(role: UserRole | undefined | null): boolean {
  return role === UserRole.SUPER_ADMIN;
}

/**
 * Checks if a user is SUPER_ADMIN.
 */
export function isSuperAdmin(role: UserRole | undefined | null): boolean {
  return role === UserRole.SUPER_ADMIN;
}

/**
 * Checks if a role can access the internal /admin portal.
 */
export function canAccessAdminPortal(role: UserRole | undefined | null): boolean {
  return hasRole(role, STAFF_ROLES);
}

/**
 * Server-side guard that ensures a user is authenticated. Throws an error if not.
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required. Please log in.");
  }
  return user;
}

/**
 * Server-side guard that ensures a user has one of the required roles.
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<SessionUser> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Unauthorized: Insufficient permissions for this action.");
  }
  return user;
}

/**
 * Server-side guard specifically for SuperAdmin operations (Permanent Deletes, System Config).
 */
export async function requireSuperAdmin(): Promise<SessionUser> {
  return requireRole(SUPER_ADMIN_ROLES);
}

/**
 * Server-side guard specifically for Admin / SuperAdmin operations (Team & User Management).
 */
export async function requireAdmin(): Promise<SessionUser> {
  return requireRole(ADMIN_ROLES);
}

/**
 * Server-side guard for Submission Reviewers (SuperAdmin, Admin, Property Manager).
 */
export async function requireSubmissionReviewer(): Promise<SessionUser> {
  return requireRole(SUBMISSION_REVIEW_ROLES);
}

export async function requirePropertyManager(): Promise<SessionUser> {
  return requireRole(SUBMISSION_REVIEW_ROLES);
}

/**
 * Server-side guard for all Staff / Operations access (Direct Publishing, Mark Sold, Archive).
 */
export async function requireStaff(): Promise<SessionUser> {
  return requireRole(STAFF_ROLES);
}
