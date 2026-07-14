import type {
  Cart,
  CartResponse,
} from "../types/cart.types";

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

async function parseCartResponse(
  response: Response,
): Promise<Cart> {
  const result = (await response.json()) as
    | CartResponse
    | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Unable to update the cart.",
    );
  }

  return (result as CartResponse)
    .data.cart;
}

export async function getCart(): Promise<Cart> {
  const response = await fetch(
    `${getApiUrl()}/cart/me`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  return parseCartResponse(response);
}

export async function addCartItem(
  productId: string,
  quantity = 1,
): Promise<Cart> {
  const response = await fetch(
    `${getApiUrl()}/cart/items`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        quantity,
      }),
    },
  );

  return parseCartResponse(response);
}

export async function updateCartItem(
  productId: string,
  quantity: number,
): Promise<Cart> {
  const response = await fetch(
    `${getApiUrl()}/cart/items/${productId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity,
      }),
    },
  );

  return parseCartResponse(response);
}

export async function removeCartItem(
  productId: string,
): Promise<Cart> {
  const response = await fetch(
    `${getApiUrl()}/cart/items/${productId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    },
  );

  return parseCartResponse(response);
}

export async function clearCart(): Promise<Cart> {
  const response = await fetch(
    `${getApiUrl()}/cart/me`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    },
  );

  return parseCartResponse(response);
}