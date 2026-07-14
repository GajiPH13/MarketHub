import type {
  Metadata,
} from "next";

import {
  CustomerOrderList,
} from "@/features/orders/components/customer-order-list";

export const metadata: Metadata = {
  title: "My Orders | MarketHub",
};

export default function OrdersPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <CustomerOrderList />
    </main>
  );
}