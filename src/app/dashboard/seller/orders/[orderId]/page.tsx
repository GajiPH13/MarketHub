import type {
  Metadata,
} from "next";
import Link from "next/link";

import {
  SellerOrderDetails,
} from "@/features/orders/components/seller-order-details";

interface SellerOrderPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export const metadata: Metadata = {
  title:
    "Manage Seller Order | MarketHub",
};

export default async function SellerOrderPage({
  params,
}: SellerOrderPageProps) {
  const { orderId } = await params;

  return (
    <>
      <Link
        href="/dashboard/seller/orders"
        className="mb-6 inline-block text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
      >
        ← Back to orders
      </Link>

      <SellerOrderDetails
        orderId={orderId}
      />
    </>
  );
}