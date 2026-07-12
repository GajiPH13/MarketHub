export type UserRole = "customer" | "seller" | "admin";

export type UserStatus =
  | "active"
  | "suspended"
  | "blocked";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;

  role: UserRole;
  status: UserStatus;
  isBlocked: boolean;

  phone?: string | null;
  address?: string | null;
  sellerProfileId?: string | null;

  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface AuthSession {
  id: string;
  userId: string;
  expiresAt: Date | string;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CurrentUserResponse {
  success: true;
  message: string;
  data: {
    user: AuthenticatedUser;
    session: AuthSession;
  };
}