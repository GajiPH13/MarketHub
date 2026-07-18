export type OrderStatus =
  "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type SellerOrderItemStatus =
  "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  sellerId: string;
  sellerUserId: string;

  name: string;
  slug: string;
  imageUrl: string | null;
  sku: string | null;

  price: number;
  quantity: number;
  lineTotal: number;

  fulfillmentStatus: SellerOrderItemStatus;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerUserId: string;

  items: OrderItem[];
  shippingAddress: ShippingAddress;

  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  currency: "EUR";

  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;

  customerNote: string | null;

  cancellationReason: string | null;
  cancelledAt: string | null;
  cancelledBy: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    state?: string | null;
    postalCode: string;
    country: string;
  };

  customerNote?: string | null;
}

export interface OrderResponse {
  success: true;
  message: string;
  data: {
    order: Order;
  };
}

export interface OrderPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CustomerOrdersResponse {
  success: true;
  message: string;
  data: {
    items: Order[];
    pagination: OrderPagination;
  };
}
export interface SellerOrder {
  _id: string;
  orderNumber: string;
  customerUserId: string;

  items: OrderItem[];

  shippingAddress: ShippingAddress;

  sellerSubtotal: number;
  currency: "EUR";

  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;

  customerNote: string | null;

  cancellationReason: string | null;
  cancelledAt: string | null;
  cancelledBy: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface SellerOrdersResponse {
  success: true;
  message: string;

  data: {
    items: SellerOrder[];
    pagination: OrderPagination;
  };
}

export interface SellerOrderResponse {
  success: true;
  message: string;

  data: {
    order: SellerOrder;
  };
}
export interface AdminOrder {
  _id: string;

  orderNumber: string;
  customerUserId: string;

  items: OrderItem[];
  shippingAddress: ShippingAddress;

  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;

  currency: "EUR";

  orderStatus: OrderStatus;

  paymentStatus: PaymentStatus;

  customerNote: string | null;

  cancellationReason: string | null;
  cancelledAt: string | null;
  cancelledBy: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface AdminOrdersResponse {
  success: true;
  message: string;

  data: {
    items: AdminOrder[];
    pagination: OrderPagination;
  };
}

export interface AdminOrderResponse {
  success: true;
  message: string;

  data: {
    order: AdminOrder;
  };
}
export interface CancelOrderPayload {
  reason?: string;
}