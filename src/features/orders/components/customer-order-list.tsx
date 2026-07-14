"use client";

import {
  LoaderCircle,
  PackageSearch,
} from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import {
  getCustomerOrders,
} from "../api/orders";
import type {
  Order,
} from "../types/order.types";

export function CustomerOrderList() {
  const [orders, setOrders] =
    useState<Order[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function initializeOrders(): Promise<void> {
      try {
        const result =
          await getCustomerOrders();

        if (!isCancelled) {
          setOrders(result.items);
        }
      } catch (error) {
        if (!isCancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to load orders.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void initializeOrders();

    return () => {
      isCancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <LoaderCircle
          aria-hidden={true}
          className="animate-spin"
          size={30}
        />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 text-center dark:border-neutral-700">
        <PackageSearch
          aria-hidden={true}
          size={42}
          className="text-neutral-400"
        />

        <h1 className="mt-4 text-2xl font-semibold">
          No orders yet
        </h1>

        <Link
          href="/products"
          className="mt-5 rounded-lg bg-neutral-900 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900"
        >
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section>
      <p className="text-sm font-medium text-neutral-500">
        Purchase history
      </p>

      <h1 className="mt-1 text-3xl font-semibold">
        My orders
      </h1>

      <div className="mt-7 space-y-4">
        {orders.map((order) => (
          <article
            key={order._id}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-semibold">
                  {order.orderNumber}
                </p>

                <p className="mt-1 text-sm text-neutral-500">
                  {new Intl.DateTimeFormat(
                    "de-DE",
                    {
                      dateStyle: "medium",
                      timeStyle: "short",
                    },
                  ).format(
                    new Date(
                      order.createdAt,
                    ),
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold capitalize dark:bg-neutral-800">
                  {order.orderStatus}
                </span>

                <span className="font-semibold">
                  {formatCurrency(
                    order.totalAmount,
                  )}
                </span>

                <Link
                  href={`/orders/${order._id}/success`}
                  className="text-sm font-semibold underline"
                >
                  View
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatCurrency(
  value: number,
): string {
  return new Intl.NumberFormat(
    "de-DE",
    {
      style: "currency",
      currency: "EUR",
    },
  ).format(value);
}