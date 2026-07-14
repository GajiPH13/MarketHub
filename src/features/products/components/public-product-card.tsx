import {
  Package,
  Star,
} from "lucide-react";
import Link from "next/link";

import type {
  Product,
} from "../types/product.types";

interface PublicProductCardProps {
  product: Product;
}

export function PublicProductCard({
  product,
}: PublicProductCardProps) {
  const primaryImage =
    product.imageUrls[0];

  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <Link
        href={`/products/${product.slug}`}
        className="block"
      >
        <div className="flex aspect-square items-center justify-center overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          {primaryImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryImage}
              alt={product.name}
              className="size-full object-cover transition duration-300 hover:scale-105"
            />
          ) : (
            <Package
              aria-hidden={true}
              size={42}
              className="text-neutral-400"
            />
          )}
        </div>

        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {product.category}
          </p>

          <h2 className="mt-2 line-clamp-2 text-lg font-semibold">
            {product.name}
          </h2>

          <div className="mt-3 flex items-center gap-2 text-sm text-neutral-500">
            <Star
              aria-hidden={true}
              size={15}
            />

            <span>
              {product.reviewCount > 0
                ? product.averageRating.toFixed(1)
                : "New"}
            </span>

            <span>
              ({product.reviewCount})
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xl font-semibold">
              {formatCurrency(
                product.price,
              )}
            </span>

            {product.compareAtPrice !== null && (
              <span className="text-sm text-neutral-500 line-through">
                {formatCurrency(
                  product.compareAtPrice,
                )}
              </span>
            )}
          </div>

          <p
            className={
              product.stock > 0
                ? "mt-3 text-sm font-medium text-green-700 dark:text-green-400"
                : "mt-3 text-sm font-medium text-red-700 dark:text-red-400"
            }
          >
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Out of stock"}
          </p>
        </div>
      </Link>
    </article>
  );
}

function formatCurrency(
  value: number,
): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}