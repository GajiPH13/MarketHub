import type {
  Metadata,
} from "next";

import {
  CartView,
} from "@/features/cart/components/cart-view";

export const metadata: Metadata = {
  title: "Shopping Cart | MarketHub",
};

export default function CartPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <CartView />
    </main>
  );
}