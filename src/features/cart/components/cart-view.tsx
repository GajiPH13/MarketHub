"use client";

import { LoaderCircle, Minus, Package, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { clearCart, getCart, removeCartItem, updateCartItem } from "../api/cart";
import type { Cart, CartItem } from "../types/cart.types";

export function CartView() {
  const [cart, setCart] = useState<Cart | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [actionProductId, setActionProductId] = useState<string | null>(null);

  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function initializeCart(): Promise<void> {
      try {
        const result = await getCart();

        if (!isCancelled) {
          setCart(result);
        }
      } catch (error) {
        if (!isCancelled) {
          toast.error(error instanceof Error ? error.message : "Unable to load your cart.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void initializeCart();

    return () => {
      isCancelled = true;
    };
  }, []);

  async function changeQuantity(item: CartItem, nextQuantity: number): Promise<void> {
    if (nextQuantity < 1) {
      return;
    }

    try {
      setActionProductId(item.productId);

      const updatedCart = await updateCartItem(item.productId, nextQuantity);

      setCart(updatedCart);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update the quantity.");
    } finally {
      setActionProductId(null);
    }
  }

  async function handleRemove(item: CartItem): Promise<void> {
    try {
      setActionProductId(item.productId);

      const updatedCart = await removeCartItem(item.productId);

      setCart(updatedCart);

      toast.success(`${item.name} was removed.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to remove the product.");
    } finally {
      setActionProductId(null);
    }
  }

  async function handleClear(): Promise<void> {
    const confirmed = window.confirm("Clear all products from your cart?");

    if (!confirmed) {
      return;
    }

    try {
      setIsClearing(true);

      const updatedCart = await clearCart();

      setCart(updatedCart);

      toast.success("Your cart was cleared.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to clear the cart.");
    } finally {
      setIsClearing(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <LoaderCircle aria-hidden={true} className="animate-spin" size={30} />

        <span className="sr-only">Loading cart</span>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <section className="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 px-6 text-center dark:border-neutral-700">
        <ShoppingBag aria-hidden={true} size={44} className="text-neutral-400" />

        <h1 className="mt-5 text-2xl font-semibold">Your cart is empty</h1>

        <p className="mt-2 text-neutral-500">Browse the catalog and add something you like.</p>

        <Link
          href="/products"
          className="mt-6 inline-flex h-11 items-center rounded-lg bg-neutral-900 px-5 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900"
        >
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-end justify-between border-b border-neutral-200 pb-6 dark:border-neutral-800">
        <div>
          <p className="text-sm font-medium text-neutral-500">MarketHub checkout</p>

          <h1 className="mt-1 text-3xl font-semibold">Shopping cart</h1>

          <p className="mt-2 text-neutral-500">{cart.totalItems} item(s)</p>
        </div>

        <button
          type="button"
          disabled={isClearing}
          onClick={() => void handleClear()}
          className="text-sm font-medium text-red-700 disabled:opacity-60 dark:text-red-400"
        >
          {isClearing ? "Clearing..." : "Clear cart"}
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {cart.items.map((item) => {
            const isUpdating = actionProductId === item.productId;

            return (
              <article
                key={item.productId}
                className="flex flex-col gap-5 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:flex-row dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt={item.name} className="size-full object-cover" />
                  ) : (
                    <Package aria-hidden={true} size={30} className="text-neutral-400" />
                  )}
                </div>

                <div className="flex-1">
                  <Link
                    href={`/products/${item.slug}`}
                    className="text-lg font-semibold hover:underline"
                  >
                    {item.name}
                  </Link>

                  <p className="mt-2 text-sm text-neutral-500">{formatCurrency(item.price)} each</p>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="inline-flex items-center rounded-lg border border-neutral-300 dark:border-neutral-700">
                      <button
                        type="button"
                        aria-label={`Decrease ${item.name} quantity`}
                        disabled={isUpdating || item.quantity <= 1}
                        onClick={() => void changeQuantity(item, item.quantity - 1)}
                        className="flex size-9 items-center justify-center disabled:opacity-40"
                      >
                        <Minus aria-hidden={true} size={15} />
                      </button>

                      <span className="min-w-10 text-center text-sm font-medium">
                        {isUpdating ? "…" : item.quantity}
                      </span>

                      <button
                        type="button"
                        aria-label={`Increase ${item.name} quantity`}
                        disabled={isUpdating || item.quantity >= item.stock}
                        onClick={() => void changeQuantity(item, item.quantity + 1)}
                        className="flex size-9 items-center justify-center disabled:opacity-40"
                      >
                        <Plus aria-hidden={true} size={15} />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-semibold">{formatCurrency(item.lineTotal)}</span>

                      <button
                        type="button"
                        aria-label={`Remove ${item.name}`}
                        disabled={isUpdating}
                        onClick={() => void handleRemove(item)}
                        className="text-red-700 disabled:opacity-40 dark:text-red-400"
                      >
                        {isUpdating ? (
                          <LoaderCircle aria-hidden={true} className="animate-spin" size={17} />
                        ) : (
                          <Trash2 aria-hidden={true} size={17} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-lg font-semibold">Order summary</h2>

          <div className="mt-5 flex justify-between text-sm">
            <span className="text-neutral-500">Subtotal</span>

            <span className="font-semibold">{formatCurrency(cart.subtotal)}</span>
          </div>

          <p className="mt-4 text-xs leading-5 text-neutral-500">
            Shipping and taxes will be calculated during checkout.
          </p>

          <Link
            href="/checkout"
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg bg-neutral-900 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900"
          >
            Continue to checkout
          </Link>
        </aside>
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
