export interface CartItem {
  productId: string;
  quantity: number;

  name: string;
  slug: string;
  imageUrl: string | null;

  price: number;
  stock: number;

  lineTotal: number;
}

export interface Cart {
  _id: string | null;
  userId: string;
  items: CartItem[];

  totalItems: number;
  subtotal: number;

  createdAt: string | null;
  updatedAt: string | null;
}

export interface CartResponse {
  success: true;
  message: string;
  data: {
    cart: Cart;
  };
}