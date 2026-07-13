import type {
  Metadata,
} from "next";
import Link from "next/link";

import {
  CreateProductForm,
} from "@/features/products/components/create-product-form";

export const metadata: Metadata = {
  title: "Add Product | MarketHub",
};

export default function NewProductPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <Link
          href="/dashboard/seller"
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          ← Back to seller dashboard
        </Link>

        <h1 className="mt-4 text-3xl font-semibold">
          Add product
        </h1>

        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Add a new product to your MarketHub store.
        </p>
      </div>

      <CreateProductForm />
    </main>
  );
}