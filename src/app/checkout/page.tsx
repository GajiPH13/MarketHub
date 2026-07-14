import type {
  Metadata,
} from "next";

import {
  CheckoutForm,
} from "@/features/orders/components/checkout-form";

export const metadata: Metadata = {
  title: "Checkout | MarketHub",
};

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <CheckoutForm />
    </main>
  );
}