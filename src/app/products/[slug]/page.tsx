import type {
  Metadata,
} from "next";
import Link from "next/link";

import {
  ProductDetails,
} from "@/features/products/components/product-details";

interface ProductDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const metadata: Metadata = {
  title: "Product Details | MarketHub",
};

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { slug } = await params;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/products"
        className="mb-8 inline-block text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
      >
        ← Back to products
      </Link>

      <ProductDetails slug={slug} />
    </main>
  );
}