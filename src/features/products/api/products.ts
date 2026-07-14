import type {
  CreateProductPayload,
  CreateProductResponse,
  Product,
SellerProductsResponse,
  ProductStatus,
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