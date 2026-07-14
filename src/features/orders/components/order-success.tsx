"use client";

import {
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import {
  getCustomerOrderById,
} from "../api/orders";
import type {
  Order,
} from "../types/order.types";

interface OrderSuccessProps {
  orderId: string;
}

export function OrderSuccess({
  orderId,
}: OrderSuccessProps) {
  const [order, setOrder] =
    useState<Order | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function initializeOrder(): Promise<void> {
      try {
        const result =
          await getCustomerOrderById(
            orderId,
          );

        if (!isCancelled) {
          setOrder(result);
        }
      } catch (error) {
        if (!isCancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to load the order.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void initializeOrder();

    return () => {
      isCancelled = true;
    };
  }, [orderId]);

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

  if (!order) {
    return (
      <section className="py-20 text-center">
        <h1 className="text-2xl font-semibold">
          Order not found
        </h1>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <CheckCircle2
        aria-hidden={true}
        size={54}
        className="mx-auto text-green-600"
      />

      <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-green-700 dark:text-green-400">
        Order received
      </p>

      <h1 className="mt-2 text-3xl font-semibold">
        Thank you for your order
      </h1>

      <p className="mt-3 text-neutral-500">
        Your order number is{" "}
        <span className="font-semibold text-neutral-900 dark:text-white">
          {order.orderNumber}
        </span>
      </p>

      <div className="mt-7 rounded-xl bg-neutral-100 p-5 text-left dark:bg-neutral-800">
        <div className="flex justify-between">
          <span className="text-neutral-500">
            Order status
          </span>

          <span className="font-semibold capitalize">
            {order.orderStatus}
          </span>
        </div>

        <div className="mt-3 flex justify-between">
          <span className="text-neutral-500">
            Payment status
          </span>

          <span className="font-semibold capitalize">
            {order.paymentStatus}
          </span>
        </div>

        <div className="mt-3 flex justify-between">
          <span className="text-neutral-500">
            Total
          </span>

          <span className="font-semibold">
            {formatCurrency(
              order.totalAmount,
            )}
          </span>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href="/orders"
          className="inline-flex h-11 items-center rounded-lg bg-neutral-900 px-5 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900"
        >
          View orders
        </Link>

        <Link
          href="/products"
          className="inline-flex h-11 items-center rounded-lg border border-neutral-300 px-5 text-sm font-semibold dark:border-neutral-700"
        >
          Continue shopping
        </Link>
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