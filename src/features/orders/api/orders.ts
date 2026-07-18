import type {
  AdminOrder,
  AdminOrderResponse,
  AdminOrdersResponse,
  CreateOrderPayload,
  CustomerOrdersResponse,
  Order,
  OrderResponse,
  OrderStatus,
  PaymentStatus,
  SellerOrder,
  SellerOrderItemStatus,
  SellerOrderResponse,
  SellerOrdersResponse,
} from "../types/order.types";

interface ApiErrorResponse {
  success?: false;
  message?: string;
  code?: string;
}
interface GetAdminOrdersOptions {
  search?: string;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  page?: number;
  limit?: number;
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

export async function getSellerOrders(
  status?: SellerOrderItemStatus,
) {
  const searchParams =
    new URLSearchParams();

  if (status) {
    searchParams.set(
      "status",
      status,
    );
  }

  const query =
    searchParams.toString();

  const response = await fetch(
    `${getApiUrl()}/orders/seller/me${query ? `?${query}` : ""}`,
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
    | SellerOrdersResponse
    | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Unable to retrieve seller orders.",
    );
  }

  return (
    result as SellerOrdersResponse
  ).data;
}

export async function getSellerOrderById(
  orderId: string,
): Promise<SellerOrder> {
  const response = await fetch(
    `${getApiUrl()}/orders/seller/me/${encodeURIComponent(orderId)}`,
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
    | SellerOrderResponse
    | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Unable to retrieve the order.",
    );
  }

  return (
    result as SellerOrderResponse
  ).data.order;
}

export async function updateSellerOrderStatus(
  orderId: string,
  status: SellerOrderItemStatus,
): Promise<SellerOrder> {
  const response = await fetch(
    `${getApiUrl()}/orders/seller/me/${encodeURIComponent(orderId)}/status`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    },
  );

  const result = (await response.json()) as
    | SellerOrderResponse
    | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Unable to update the order.",
    );
  }

  return (
    result as SellerOrderResponse
  ).data.order;
}

export async function getAdminOrders(
  options: GetAdminOrdersOptions = {},
) {
  const searchParams =
    new URLSearchParams();

  if (options.search) {
    searchParams.set(
      "search",
      options.search,
    );
  }

  if (options.orderStatus) {
    searchParams.set(
      "orderStatus",
      options.orderStatus,
    );
  }

  if (options.paymentStatus) {
    searchParams.set(
      "paymentStatus",
      options.paymentStatus,
    );
  }

  searchParams.set(
    "page",
    String(options.page ?? 1),
  );

  searchParams.set(
    "limit",
    String(options.limit ?? 20),
  );

  const response = await fetch(
    `${getApiUrl()}/orders/admin?${searchParams.toString()}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept:
          "application/json",
      },
      cache: "no-store",
    },
  );

  const result = (await response.json()) as
    | AdminOrdersResponse
    | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Unable to retrieve admin orders.",
    );
  }

  return (
    result as AdminOrdersResponse
  ).data;
}
export async function getAdminOrderById(
  orderId: string,
): Promise<AdminOrder> {
  const response = await fetch(
    `${getApiUrl()}/orders/admin/${encodeURIComponent(orderId)}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept:
          "application/json",
      },
      cache: "no-store",
    },
  );

  const result = (await response.json()) as
    | AdminOrderResponse
    | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Unable to retrieve the order.",
    );
  }

  return (
    result as AdminOrderResponse
  ).data.order;
}
export async function updateAdminOrder(
  orderId: string,
  input: {
    orderStatus?: OrderStatus;
    paymentStatus?: PaymentStatus;
  },
): Promise<AdminOrder> {
  const response = await fetch(
    `${getApiUrl()}/orders/admin/${encodeURIComponent(orderId)}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        Accept:
          "application/json",

        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(input),
    },
  );

  const result = (await response.json()) as
    | AdminOrderResponse
    | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Unable to update the order.",
    );
  }

  return (
    result as AdminOrderResponse
  ).data.order;
}
export async function cancelCustomerOrder(
  orderId: string,
  reason?: string,
): Promise<Order> {
  const response = await fetch(
    `${getApiUrl()}/orders/me/${encodeURIComponent(orderId)}/cancel`,
    {
      method: "PATCH",

      credentials:
        "include",

      headers: {
        Accept:
          "application/json",

        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        reason
          ? {
              reason,
            }
          : {},
      ),
    },
  );

  return parseOrderResponse(
    response,
  );
}