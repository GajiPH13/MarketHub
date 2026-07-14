export type ProductStatus =
  | "draft"
  | "active"
  | "inactive";

export interface Product {
  _id: string;

  sellerId: string;
  sellerUserId: string;

  name: string;
  slug: string;
  description: string;

  category: string;
  brand: string | null;

  price: number;
  compareAtPrice: number | null;

  stock: number;
  sku: string | null;

  imageUrls: string[];

  status: ProductStatus;
  isFeatured: boolean;

  averageRating: number;
  reviewCount: number;
  totalSales: number;

  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  category: string;
  brand?: string | null;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  sku?: string | null;
  imageUrls: string[];
  status: ProductStatus;
}

export interface CreateProductResponse {
  success: true;
  message: string;
  data: {
    product: Product;
  };
}

export interface ProductPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SellerProductsResponse {
  success: true;
  message: string;
  data: {
    items: Product[];
    pagination: ProductPagination;
  };
}