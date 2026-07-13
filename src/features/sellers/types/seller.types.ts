export type SellerProfileStatus =
  | "approved"
  | "suspended";

export interface SellerProfile {
  _id: string;
  userId: string;

  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;

  bio: string;
  logoUrl?: string | null;
  categoryFocus: string[];

  averageRating: number;
  reviewCount: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;

  isApproved: boolean;
  status: SellerProfileStatus;

  approvedBy?: string | null;
  approvedAt?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface SellerProfileResponse {
  success: true;
  message: string;
  data: {
    sellerProfile: SellerProfile;
  };
}