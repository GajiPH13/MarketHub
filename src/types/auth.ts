export type UserRole = "customer" | "seller" | "admin";

export type UserStatus = "active" | "suspended" | "blocked";

export interface MarketHubUser {
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

  createdAt: Date;
  updatedAt: Date;
}