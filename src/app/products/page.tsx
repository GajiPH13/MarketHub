import type {
  Metadata,
} from "next";

import {
  ProductCatalog,
} from "@/features/products/components/product-catalog";

export const metadata: Metadata = {
  title: "Products | MarketHub",
  description:
    "Browse products from approved MarketHub sellers.",
};

export default function ProductsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <ProductCatalog />
    </main>
  );
}