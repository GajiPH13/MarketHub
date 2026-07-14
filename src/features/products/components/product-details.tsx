"use client";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import { LoaderCircle, Package, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getPublicProductBySlug } from "../api/products";
import type { Product } from "../types/product.types";

interface ProductDetailsProps {
  slug: string;
}

export function ProductDetails({ slug }: ProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function initializeProduct(): Promise<void> {
      try {
        const result = await getPublicProductBySlug(slug);

        if (!isCancelled) {
          setProduct(result);
        }
      } catch (error) {
        if (!isCancelled) {
          toast.error(error instanceof Error ? error.message : "Unable to load the product.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void initializeProduct();

    return () => {
      isCancelled = true;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <LoaderCircle aria-hidden={true} className="animate-spin" size={30} />
      </div>
    );
  }

  if (!product) {
    return (
      <section className="py-20 text-center">
        <h1 className="text-2xl font-semibold">Product not found</h1>
      </section>
    );
  }

  const primaryImage = product.imageUrls[0];

  return (
    <section className="grid gap-10 lg:grid-cols-2">
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
        {primaryImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={primaryImage} alt={product.name} className="size-full object-cover" />
        ) : (
          <Package aria-hidden={true} size={64} className="text-neutral-400" />
        )}
      </div>

      <div>
        <p className="text-sm font-semibold tracking-wide text-neutral-500 uppercase">
          {product.category}
        </p>

        <h1 className="mt-3 text-4xl font-semibold">{product.name}</h1>

        {product.brand && <p className="mt-2 text-neutral-500">By {product.brand}</p>}

        <div className="mt-5 flex items-center gap-2 text-sm text-neutral-500">
          <Star aria-hidden={true} size={17} />

          <span>{product.reviewCount > 0 ? product.averageRating.toFixed(1) : "New product"}</span>

          <span>({product.reviewCount} reviews)</span>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <span className="text-3xl font-semibold">{formatCurrency(product.price)}</span>

          {product.compareAtPrice !== null && (
            <span className="text-lg text-neutral-500 line-through">
              {formatCurrency(product.compareAtPrice)}
            </span>
          )}
        </div>

        <p className="mt-6 leading-8 text-neutral-700 dark:text-neutral-300">
          {product.description}
        </p>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
              Stock
            </dt>

            <dd className="mt-1 font-medium">
              {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">SKU</dt>

            <dd className="mt-1 font-medium">{product.sku ?? "Not available"}</dd>
          </div>
        </dl>

        {/* <button
          type="button"
          disabled={product.stock === 0}
          className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-neutral-900 px-7 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-neutral-900"
        >
          <AddToCartButton productId={product._id} stock={product.stock} />

          {product.stock > 0 ? "Add to cart" : "Out of stock"}
        </button> */}
        <AddToCartButton productId={product._id} stock={product.stock} />
      </div>
    </section>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}
