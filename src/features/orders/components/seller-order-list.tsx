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
  getSellerOrders,
} from "../api/orders";
import type {
  SellerOrder,
  SellerOrderItemStatus,
} from "../types/order.types";

type StatusFilter =
  | "all"
  | SellerOrderItemStatus;

const STATUS_OPTIONS: StatusFilter[] = [
  "all",
  "pending",
  "processing",
  "shipped",
  "delivered",
];

export function SellerOrderList() {
  const [orders, setOrders] =
    useState<SellerOrder[]>([]);

  const [status, setStatus] =
    useState<StatusFilter>("all");

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function initializeOrders(): Promise<void> {
      try {
        const result =
          status === "all"
            ? await getSellerOrders()
            : await getSellerOrders(
                status,
              );

        if (!isCancelled) {
          setOrders(result.items);
        }
      } catch (error) {
        if (!isCancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to load seller orders.",
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
  }, [status]);

  function handleStatusChange(
    nextStatus: StatusFilter,
  ): void {
    setIsLoading(true);
    setStatus(nextStatus);
  }

  return (
    <section>
      <div className="border-b border-neutral-200 pb-6 dark:border-neutral-800">
        <p className="text-sm font-medium text-neutral-500">
          Store fulfillment
        </p>

        <h1 className="mt-1 text-3xl font-semibold">
          Orders
        </h1>

        <p className="mt-2 text-neutral-500">
          Manage orders containing your products.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {STATUS_OPTIONS.map(
          (statusOption) => (
            <button
              key={statusOption}
              type="button"
              disabled={isLoading}
              onClick={() =>
                handleStatusChange(
                  statusOption,
                )
              }
              className={
                status === statusOption
                  ? "rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium capitalize text-white dark:bg-white dark:text-neutral-900"
                  : "rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium capitalize disabled:opacity-50 dark:border-neutral-700"
              }
            >
              {statusOption}
            </button>
          ),
        )}
      </div>

      <div className="mt-7">
        {isLoading ? (
          <div className="flex min-h-72 items-center justify-center">
            <LoaderCircle
              aria-hidden={true}
              className="animate-spin"
              size={30}
            />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 text-center dark:border-neutral-700">
            <PackageSearch
              aria-hidden={true}
              size={42}
              className="text-neutral-400"
            />

            <h2 className="mt-4 text-xl font-semibold">
              No orders found
            </h2>
          </div>
        ) : (
          <div className="space-y-4">
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
                      {formatDate(
                        order.createdAt,
                      )}
                    </p>

                    <p className="mt-2 text-sm">
                      {order.items.length} seller item(s)
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <span className="font-semibold">
                      {formatCurrency(
                        order.sellerSubtotal,
                      )}
                    </span>

                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold capitalize dark:bg-neutral-800">
                      {getSellerStatus(
                        order,
                      )}
                    </span>

                    <Link
                      href={`/dashboard/seller/orders/${order._id}`}
                      className="text-sm font-semibold underline"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function getSellerStatus(
  order: SellerOrder,
): SellerOrderItemStatus {
  return (
    order.items[0]
      ?.fulfillmentStatus ??
    "pending"
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

function formatDate(
  value: string,
): string {
  return new Intl.DateTimeFormat(
    "de-DE",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(new Date(value));
}