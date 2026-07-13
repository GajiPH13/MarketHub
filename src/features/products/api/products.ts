import type {
  CreateProductPayload,
  CreateProductResponse,
  Product,
} from "../types/product.types";

interface ApiErrorResponse {
  success?: false;
  message?: string;
  code?: string;
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