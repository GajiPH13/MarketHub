import type {
  CreateOrderPayload,
  CustomerOrdersResponse,
  Order,
  OrderResponse,
} from "../types/order.types";

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

async function parseOrderResponse(
  response: Response,
): Promise<Order> {
  const result = (await response.json()) as
    | OrderResponse
    | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Unable to process the order.",
    );
  }

  return (result as OrderResponse)
    .data.order;
}

export async function createOrder(
  payload: CreateOrderPayload,
): Promise<Order> {
  const response = await fetch(
    `${getApiUrl()}/orders`,
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

  return parseOrderResponse(response);
}

export async function getCustomerOrders() {
  const response = await fetch(
    `${getApiUrl()}/orders/me`,
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
    | CustomerOrdersResponse
    | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Unable to retrieve orders.",
    );
  }

  return (
    result as CustomerOrdersResponse
  ).data;
}

export async function getCustomerOrderById(
  orderId: string,
): Promise<Order> {
  const response = await fetch(
    `${getApiUrl()}/orders/me/${encodeURIComponent(orderId)}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  return parseOrderResponse(response);
}