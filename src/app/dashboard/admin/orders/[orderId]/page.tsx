import type {
  Metadata,
} from "next";
import Link from "next/link";

import {
  AdminOrderDetails,
} from "@/features/orders/components/admin-order-details";

interface AdminOrderPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export const metadata: Metadata = {
  title:
    "Manage Order | MarketHub",
};

export default async function AdminOrderPage({
  params,
}: AdminOrderPageProps) {
  const { orderId } =
    await params;

  return (
    <>
      <Link
        href="/dashboard/admin/orders"
        className="mb-6 inline-block text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
      >
        ← Back to orders
      </Link>

      <AdminOrderDetails
        orderId={orderId}
      />
    </>
  );
}