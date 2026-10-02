import { UserRole, UserStatus } from "@prisma/client";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string | null;
  sessionVersion?: number;
}

export interface AuthSessionPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
  sessionVersion?: number;
  iat?: number;
  exp?: number;
}

export interface AuthResult<T = unknown> {
  success: boolean;
  message?: string;
  user?: SessionUser;
  data?: T;
  errors?: Record<string, string[]>;
}
