"use client";

import {
  LoaderCircle,
} from "lucide-react";
import Link from "next/link";
import {
  useParams,
} from "next/navigation";
import {
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import {
  getSellerProductById,
} from "@/features/products/api/products";
import {
  EditProductForm,
} from "@/features/products/components/edit-product-form";
import type {
  Product,
} from "@/features/products/types/product.types";

export default function EditProductPage() {
  const params = useParams<{
    productId: string;
  }>();

  const [product, setProduct] =
    useState<Product | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function initializeProduct(): Promise<void> {
      try {
        const result =
          await getSellerProductById(
            params.productId,
          );

        if (!isCancelled) {
          setProduct(result);
        }
      } catch (error) {
        if (!isCancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to load the product.",
          );
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
  }, [params.productId]);

  if (isLoading) {
    return (
      <main className="flex min-h-72 items-center justify-center">
        <LoaderCircle
          aria-hidden={true}
          className="animate-spin"
          size={30}
        />

        <span className="sr-only">
          Loading product
        </span>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold">
          Product not found
        </h1>

        <Link
          href="/dashboard/seller/products"
          className="mt-4 inline-block text-sm font-medium underline"
        >
          Return to products
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <Link
          href="/dashboard/seller/products"
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          ← Back to products
        </Link>

        <h1 className="mt-4 text-3xl font-semibold">
          Edit product
        </h1>

        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Update {product.name}.
        </p>
      </div>

      <EditProductForm
        product={product}
      />
    </main>
  );
}