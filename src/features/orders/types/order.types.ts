export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

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