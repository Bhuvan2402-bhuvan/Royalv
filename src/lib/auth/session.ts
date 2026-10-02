import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { AuthSessionPayload, SessionUser } from "@/types/auth";
import prisma from "@/lib/db/prisma";

function getEncodedSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET environment variable is missing in production environment.");
    }
    return new TextEncoder().encode("royalv_dev_session_key_local_only_min_32_chars");
  }
  return new TextEncoder().encode(secret);
}

export const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "royalv_session";
const SESSION_EXPIRY_HOURS = 24 * 7; // 7 days

/**
 * Signs and generates a secure session JWT.
 */
export async function createSessionToken(payload: Omit<AuthSessionPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_EXPIRY_HOURS}h`)
    .sign(getEncodedSecret());
}

/**
 * Verifies a session JWT token and returns its decoded payload.
 */
export async function verifySessionToken(token: string): Promise<AuthSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getEncodedSecret(), {
      algorithms: ["HS256"],
    });
    return payload as unknown as AuthSessionPayload;
  } catch {
    return null;
  }
}

/**
 * Sets the authentication session cookie with secure, httpOnly attributes.
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  });
}

/**
 * Clears the session cookie upon logout.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Retrieves the currently authenticated user from the database based on the active session token.
 * Returns null if no valid session or user is suspended/inactive.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload?.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatarUrl: true,
        sessionVersion: true,
      },
    });

    if (!user || user.status !== "ACTIVE") {
      return null;
    }

    // Invalidate session if sessionVersion in token does not match user's current version (e.g. after password change/reset)
    if (payload.sessionVersion !== undefined && payload.sessionVersion !== user.sessionVersion) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}
