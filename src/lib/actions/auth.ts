"use server";

import prisma from "@/lib/db/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/passwords";
import { createSessionToken, setSessionCookie, clearSessionCookie, getCurrentUser } from "@/lib/auth/session";
import { loginSchema, customerSignupSchema, changePasswordSchema, forgotPasswordSchema, resetPasswordSchema } from "@/lib/validators/auth";
import { AuthResult } from "@/types/auth";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { UserRole, UserStatus } from "@prisma/client";

/**
 * Server Action: Authenticate user & issue session cookie
 */
export async function loginAction(prevState: unknown, formData: FormData): Promise<AuthResult> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validation = loginSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Please correct the errors in the form.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validation.data;

  // Rate limiting check
  const rateLimit = checkRateLimit(`login_${email.toLowerCase()}`, { limit: 5, windowSeconds: 60 });
  if (!rateLimit.allowed) {
    return {
      success: false,
      message: `Too many login attempts. Please wait ${rateLimit.retryAfterSeconds} seconds before trying again.`,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    if (user.status === UserStatus.SUSPENDED || user.status === UserStatus.INACTIVE) {
      return {
        success: false,
        message: "Your account is inactive or suspended. Please contact support.",
      };
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    // Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Create session token and set httpOnly cookie
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await setSessionCookie(token);

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_LOGGED_IN",
        entity: "User",
        entityId: user.id,
        details: { role: user.role },
      },
    });

    return {
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        avatarUrl: user.avatarUrl,
      },
    };
  } catch (error) {
    console.error("Login server error:", error);
    return {
      success: false,
      message: "An unexpected server error occurred. Please try again.",
    };
  }
}

/**
 * Server Action: Register a new customer
 * SECURITY: Public signups are strictly forced to UserRole.CUSTOMER.
 */
export async function signupCustomerAction(prevState: unknown, formData: FormData): Promise<AuthResult> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const validation = customerSignupSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Please correct the errors in the form.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { name, email, phone, password } = validation.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email address already exists. Please log in.",
      };
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        passwordHash,
        role: UserRole.CUSTOMER, // HARD-CODED: Public signup can ONLY be CUSTOMER
        status: UserStatus.ACTIVE,
      },
    });

    const token = await createSessionToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });

    await setSessionCookie(token);

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: newUser.id,
        action: "CUSTOMER_REGISTERED",
        entity: "User",
        entityId: newUser.id,
        details: { email: newUser.email },
      },
    });

    return {
      success: true,
      message: "Account created successfully.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        avatarUrl: newUser.avatarUrl,
      },
    };
  } catch (error) {
    console.error("Signup server error:", error);
    return {
      success: false,
      message: "An error occurred while creating your account. Please try again.",
    };
  }
}

/**
 * Server Action: Log out the current user
 */
export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
}

/**
 * Server Action: Authenticated User Password Change
 * Requirements:
 * - Verify current password
 * - Validate new password (min 8 chars, uppercase, number)
 * - Confirm new password match
 * - Prevent same-password reuse
 * - Hash password with bcrypt
 * - Increment sessionVersion to invalidate other active sessions
 * - Audit PASSWORD_CHANGED
 */
export async function changePasswordAction(prevState: unknown, formData: FormData): Promise<AuthResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "Authentication required. Please log in." };
  }

  const rawData = {
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const validation = changePasswordSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Please correct the errors in the form.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { currentPassword, newPassword } = validation.data;

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return { success: false, message: "User account not found." };
    }

    // 1. Verify current password
    const isMatch = await verifyPassword(currentPassword, dbUser.passwordHash);
    if (!isMatch) {
      return {
        success: false,
        message: "The current password you entered is incorrect.",
        errors: { currentPassword: ["Current password is incorrect"] },
      };
    }

    // 2. Prevent same-password reuse
    const isSameAsOld = await verifyPassword(newPassword, dbUser.passwordHash);
    if (isSameAsOld) {
      return {
        success: false,
        message: "New password cannot be the same as your current password.",
        errors: { newPassword: ["New password cannot be identical to your current password"] },
      };
    }

    // 3. Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // 4. Update password and increment sessionVersion
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        sessionVersion: { increment: 1 },
      },
    });

    // 5. Issue fresh session cookie with incremented sessionVersion for current device
    const newToken = await createSessionToken({
      userId: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      sessionVersion: updatedUser.sessionVersion,
    });
    await setSessionCookie(newToken);

    // 6. Secure audit log (NEVER log password or hash)
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "PASSWORD_CHANGED",
        entity: "User",
        entityId: user.id,
        details: { method: "SELF_SERVICE_CHANGE" },
      },
    });

    return {
      success: true,
      message: "Your password has been changed successfully. All other active sessions have been securely signed out.",
    };
  } catch (error) {
    console.error("Change password error:", error);
    return {
      success: false,
      message: "Failed to update password due to a server error. Please try again.",
    };
  }
}

/**
 * Server Action: Forgot Password / Password Recovery Request
 * SECURITY: Returns a generic message to prevent user enumeration.
 * Tokens are stored as SHA-256 hashes with 1-hour expiry.
 */
export async function forgotPasswordAction(prevState: unknown, formData: FormData): Promise<AuthResult<{ resetLink?: string }>> {
  const rawData = {
    email: formData.get("email"),
  };

  const validation = forgotPasswordSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Please enter a valid email address.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { email } = validation.data;

  // Rate limiting check
  const rateLimit = checkRateLimit(`forgot_pass_${email}`, { limit: 3, windowSeconds: 300 });
  if (!rateLimit.allowed) {
    return {
      success: false,
      message: `Too many password reset requests. Please wait ${rateLimit.retryAfterSeconds} seconds before trying again.`,
    };
  }

  try {
    const crypto = await import("crypto");
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    let generatedResetUrl: string | undefined = undefined;

    if (user && user.status === UserStatus.ACTIVE) {
      // Generate 32-byte cryptographically random token
      const rawToken = crypto.randomBytes(32).toString("hex");
      // Hash token for database storage
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
      // 1 hour expiry
      const expires = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetTokenHash: tokenHash,
          passwordResetExpires: expires,
        },
      });

      // Audit log (NEVER log the token)
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "PASSWORD_RESET_REQUESTED",
          entity: "User",
          entityId: user.id,
          details: { email: user.email },
        },
      });

      // In development / local environment, provide the reset URL for direct testing
      generatedResetUrl = `/reset-password?token=${rawToken}`;
    }

    return {
      success: true,
      message: "If an account exists with this email address, you will receive password reset instructions shortly.",
      data: generatedResetUrl ? { resetLink: generatedResetUrl } : undefined,
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Server Action: Reset Password with Token
 */
export async function resetPasswordAction(prevState: unknown, formData: FormData): Promise<AuthResult> {
  const rawData = {
    token: formData.get("token"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const validation = resetPasswordSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Please correct the errors in the form.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { token, newPassword } = validation.data;

  try {
    const crypto = await import("crypto");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        passwordResetTokenHash: tokenHash,
        passwordResetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      return {
        success: false,
        message: "This password reset link is invalid or has expired. Please request a new one.",
      };
    }

    const newPasswordHash = await hashPassword(newPassword);

    // Update password, clear token, and increment sessionVersion
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        passwordResetTokenHash: null,
        passwordResetExpires: null,
        sessionVersion: { increment: 1 },
      },
    });

    // Audit log (NEVER log password or token)
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "PASSWORD_RESET_COMPLETED",
        entity: "User",
        entityId: user.id,
        details: { email: user.email },
      },
    });

    return {
      success: true,
      message: "Your password has been successfully reset. You can now log in with your new password.",
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      message: "Failed to reset password. Please try again.",
    };
  }
}

/**
 * Server Action: Administrator initiates a Password Reset for Staff
 * SUPER_ADMIN and ADMIN users can send a reset link to staff members without viewing or setting plaintext passwords.
 */
export async function sendStaffPasswordResetAction(staffUserId: string): Promise<AuthResult<{ resetLink?: string }>> {
  const currentUser = await getCurrentUser();
  if (!currentUser || (currentUser.role !== UserRole.SUPER_ADMIN && currentUser.role !== UserRole.ADMIN)) {
    return { success: false, message: "Unauthorized. Admin access required." };
  }

  try {
    const crypto = await import("crypto");
    const targetUser = await prisma.user.findUnique({
      where: { id: staffUserId },
    });

    if (!targetUser) {
      return { success: false, message: "Staff member not found." };
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours for admin-initiated reset

    await prisma.user.update({
      where: { id: targetUser.id },
      data: {
        passwordResetTokenHash: tokenHash,
        passwordResetExpires: expires,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: currentUser.id,
        action: "PASSWORD_RESET_REQUESTED",
        entity: "User",
        entityId: targetUser.id,
        details: { initiatedBy: currentUser.email, targetEmail: targetUser.email },
      },
    });

    const resetLink = `/reset-password?token=${rawToken}`;

    return {
      success: true,
      message: `Password reset link generated for ${targetUser.name} (${targetUser.email}).`,
      data: { resetLink },
    };
  } catch (error) {
    console.error("Admin staff reset password error:", error);
    return {
      success: false,
      message: "Failed to initiate staff password reset.",
    };
  }
}
