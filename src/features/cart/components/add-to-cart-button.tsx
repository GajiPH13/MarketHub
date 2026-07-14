"use client";

import {
  LoaderCircle,
  ShoppingCart,
} from "lucide-react";
import {
  useState,
} from "react";
import { toast } from "sonner";

import {
  addCartItem,
} from "../api/cart";

interface AddToCartButtonProps {
  productId: string;
  stock: number;
}

export function AddToCartButton({
  productId,
  stock,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] =
    useState(false);

  async function handleAddToCart(): Promise<void> {
    try {
      setIsAdding(true);

      await addCartItem(
        productId,
        1,
      );

      toast.success(
        "Product added to cart.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to add the product to your cart.",
      );
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <button
      type="button"
      disabled={
        stock <= 0 ||
        isAdding
      }
      onClick={() =>
        void handleAddToCart()
      }
      className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-neutral-900 px-7 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
    >
      {isAdding ? (
        <LoaderCircle
          aria-hidden={true}
          className="animate-spin"
          size={18}
        />
      ) : (
        <ShoppingCart
          aria-hidden={true}
          size={18}
        />
      )}

      {stock <= 0
        ? "Out of stock"
        : isAdding
          ? "Adding..."
          : "Add to cart"}
    </button>
  );
}