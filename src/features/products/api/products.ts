import type {
  CreateProductPayload,
  CreateProductResponse,
  DeleteProductResponse,
  Product,
  ProductResponse,
  ProductStatus,
  PublicProductQuery,
  PublicProductsResponse,
  SellerProductsResponse,
} from "../types/product.types";

interface ApiErrorResponse {
  success?: false;
  message?: string;
  code?: string;
}
interface GetSellerProductsOptions {
  status?: ProductStatus;
  page?: number;
  limit?: number;
}

export async function getSellerProducts({
  status,
  page = 1,
  limit = 10,
}: GetSellerProductsOptions = {}) {
  const searchParams =
    new URLSearchParams();

  searchParams.set(
    "page",
    String(page),
  );

  searchParams.set(
    "limit",
    String(limit),
  );

  if (status) {
    searchParams.set(
      "status",
      status,
    );
  }

  const response = await fetch(
    `${getApiUrl()}/products/seller/me?${searchParams.toString()}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  const result = (await response.json()) as
    | SellerProductsResponse
    | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Unable to retrieve seller products.",
    );
  }

  return (
    result as SellerProductsResponse
  ).data;
}
const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

function getApiUrl(): string {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured.",
    );
  }

  return API_URL.replace(/\/$/, "");
}

export async function createProduct(
  payload: CreateProductPayload,
): Promise<Product> {
  const response = await fetch(
    `${getApiUrl()}/products`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const result = (await response.json()) as
    | CreateProductResponse
    | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Unable to create the product.",
    );
  }

  return (result as CreateProductResponse)
    .data.product;
}
export type UpdateProductPayload =
  Partial<CreateProductPayload>;

export async function getSellerProductById(
  productId: string,
): Promise<Product> {
  const response = await fetch(
    `${getApiUrl()}/products/seller/me/${productId}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  const result = (await response.json()) as
    | ProductResponse
    | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Unable to retrieve the product.",
    );
  }

  return (result as ProductResponse)
    .data.product;
}

export async function updateSellerProduct(
  productId: string,
  payload: UpdateProductPayload,
): Promise<Product> {
  const response = await fetch(
    `${getApiUrl()}/products/seller/me/${productId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const result = (await response.json()) as
    | ProductResponse
    | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Unable to update the product.",
    );
  }

  return (result as ProductResponse)
    .data.product;
}

export async function deleteSellerProduct(
  productId: string,
): Promise<void> {
  const response = await fetch(
    `${getApiUrl()}/products/seller/me/${productId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const result = (await response.json()) as
    | DeleteProductResponse
    | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Unable to delete the product.",
    );
  }
}
export async function getPublicProducts(
  query: PublicProductQuery = {},
) {
  const searchParams =
    new URLSearchParams();

  if (query.search) {
    searchParams.set(
      "search",
      query.search,
    );
  }

  if (query.category) {
    searchParams.set(
      "category",
      query.category,
    );
  }

  if (query.minPrice !== undefined) {
    searchParams.set(
      "minPrice",
      String(query.minPrice),
    );
  }

  if (query.maxPrice !== undefined) {
    searchParams.set(
      "maxPrice",
      String(query.maxPrice),
    );
  }

  if (query.sort) {
    searchParams.set(
      "sort",
      query.sort,
    );
  }

  searchParams.set(
    "page",
    String(query.page ?? 1),
  );

  searchParams.set(
    "limit",
    String(query.limit ?? 12),
  );

  const response = await fetch(
    `${getApiUrl()}/products?${searchParams.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  const result = (await response.json()) as
    | PublicProductsResponse
    | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Unable to retrieve products.",
    );
  }

  return (
    result as PublicProductsResponse
  ).data;
}

export async function getPublicProductBySlug(
  slug: string,
): Promise<Product> {
  const response = await fetch(
    `${getApiUrl()}/products/slug/${encodeURIComponent(slug)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  const result = (await response.json()) as
    | ProductResponse
    | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Unable to retrieve the product.",
    );
  }

  return (result as ProductResponse)
    .data.product;
}