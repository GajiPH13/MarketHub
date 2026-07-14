import type {
  Metadata,
} from "next";

import {
  OrderSuccess,
} from "@/features/orders/components/order-success";

interface OrderSuccessPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export const metadata: Metadata = {
  title:
    "Order Confirmation | MarketHub",
};

export default async function OrderSuccessPage({
  params,
}: OrderSuccessPageProps) {
  const { orderId } = await params;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <OrderSuccess
        orderId={orderId}
      />
    </main>
  );
}