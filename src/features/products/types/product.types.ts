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
export type ProductSort =
  | "newest"
  | "price-low"
  | "price-high";

export interface PublicProductQuery {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSort;
  page?: number;
  limit?: number;
}

export interface PublicProductsResponse {
  success: true;
  message: string;
  data: {
    items: Product[];
    pagination: ProductPagination;
  };
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
export interface ProductResponse {
  success: true;
  message: string;
  data: {
    product: Product;
  };
}

export interface DeleteProductResponse {
  success: true;
  message: string;
  data: null;
}