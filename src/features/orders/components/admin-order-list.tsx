"use client";

import {
  LoaderCircle,
  PackageSearch,
  Search,
} from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import {
  getAdminOrders,
} from "../api/orders";
import type {
  AdminOrder,
  OrderStatus,
  PaymentStatus,
} from "../types/order.types";

type OrderStatusFilter =
  | "all"
  | OrderStatus;

type PaymentStatusFilter =
  | "all"
  | PaymentStatus;

export function AdminOrderList() {
  const [orders, setOrders] =
    useState<AdminOrder[]>([]);

  const [search, setSearch] =
    useState("");

  const [
    submittedSearch,
    setSubmittedSearch,
  ] = useState("");

  const [
    orderStatus,
    setOrderStatus,
  ] =
    useState<OrderStatusFilter>(
      "all",
    );

  const [
    paymentStatus,
    setPaymentStatus,
  ] =
    useState<PaymentStatusFilter>(
      "all",
    );

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function initializeOrders(): Promise<void> {
      try {
        const result =
          await getAdminOrders({
            ...(submittedSearch
              ? {
                  search:
                    submittedSearch,
                }
              : {}),

            ...(orderStatus !== "all"
              ? {
                  orderStatus,
                }
              : {}),

            ...(paymentStatus !== "all"
              ? {
                  paymentStatus,
                }
              : {}),
          });

        if (!isCancelled) {
          setOrders(
            result.items,
          );
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
  }, [
    submittedSearch,
    orderStatus,
    paymentStatus,
  ]);

  function handleSearch(
    event: React.FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    setIsLoading(true);
    setSubmittedSearch(
      search.trim(),
    );
  }

  return (
    <section>
      <div className="border-b border-neutral-200 pb-6 dark:border-neutral-800">
        <p className="text-sm font-medium text-neutral-500">
          Marketplace operations
        </p>

        <h1 className="mt-1 text-3xl font-semibold">
          All orders
        </h1>

        <p className="mt-2 text-neutral-500">
          Review and manage every MarketHub order.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto_auto]">
        <form
          onSubmit={handleSearch}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search
              aria-hidden={true}
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search order number"
              className="h-10 w-full rounded-lg border border-neutral-300 bg-white pl-10 pr-3 text-sm dark:border-neutral-700 dark:bg-neutral-950"
            />
          </div>

          <button
            type="submit"
            className="h-10 rounded-lg bg-neutral-900 px-4 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900"
          >
            Search
          </button>
        </form>

        <select
          value={orderStatus}
          onChange={(event) => {
            setIsLoading(true);

            setOrderStatus(
              event.target
                .value as OrderStatusFilter,
            );
          }}
          className="h-10 rounded-lg border border-neutral-300 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-950"
        >
          <option value="all">
            All order statuses
          </option>
          <option value="pending">
            Pending
          </option>
          <option value="confirmed">
            Confirmed
          </option>
          <option value="processing">
            Processing
          </option>
          <option value="shipped">
            Shipped
          </option>
          <option value="delivered">
            Delivered
          </option>
          <option value="cancelled">
            Cancelled
          </option>
        </select>

        <select
          value={paymentStatus}
          onChange={(event) => {
            setIsLoading(true);

            setPaymentStatus(
              event.target
                .value as PaymentStatusFilter,
            );
          }}
          className="h-10 rounded-lg border border-neutral-300 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-950"
        >
          <option value="all">
            All payment statuses
          </option>
          <option value="pending">
            Payment pending
          </option>
          <option value="paid">
            Paid
          </option>
          <option value="failed">
            Failed
          </option>
          <option value="refunded">
            Refunded
          </option>
        </select>
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
          <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700">
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
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <p className="font-semibold">
                      {order.orderNumber}
                    </p>

                    <p className="mt-1 text-sm text-neutral-500">
                      {formatDate(
                        order.createdAt,
                      )}
                    </p>

                    <p className="mt-2 text-sm text-neutral-500">
                      {
                        order.items
                          .length
                      }{" "}
                      item(s)
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge
                      value={
                        order.orderStatus
                      }
                    />

                    <StatusBadge
                      value={
                        order.paymentStatus
                      }
                    />

                    <span className="font-semibold">
                      {formatCurrency(
                        order.totalAmount,
                      )}
                    </span>

                    <Link
                      href={`/dashboard/admin/orders/${order._id}`}
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

function StatusBadge({
  value,
}: {
  value: string;
}) {
  return (
    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold capitalize dark:bg-neutral-800">
      {value}
    </span>
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