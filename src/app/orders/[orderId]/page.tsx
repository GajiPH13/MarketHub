import type {
  Metadata,
} from "next";
import Link from "next/link";

import {
  CustomerOrderDetails,
} from "@/features/orders/components/customer-order-details";

interface CustomerOrderDetailsPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export const metadata: Metadata = {
  title:
    "Order Details | MarketHub",
};

export default async function CustomerOrderDetailsPage({
  params,
}: CustomerOrderDetailsPageProps) {
  const { orderId } =
    await params;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/orders"
        className="mb-6 inline-block text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
      >
        ← Back to orders
      </Link>

      <CustomerOrderDetails
        orderId={orderId}
      />
    </main>
  );
}