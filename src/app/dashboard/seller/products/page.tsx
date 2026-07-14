import type {
  Metadata,
} from "next";
import Link from "next/link";

import {
  SellerProductList,
} from "@/features/products/components/seller-product-list";

export const metadata: Metadata = {
  title: "Seller Products | MarketHub",
};

export default function SellerProductsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <Link
          href="/dashboard/seller"
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          ← Back to seller dashboard
        </Link>
      </div>

      <SellerProductList />
    </main>
  );
}