"use client";

import {
  LoaderCircle,
  MapPin,
  Package,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import {
  cancelCustomerOrder,
  getCustomerOrderById,
} from "../api/orders";
import type {
  Order,
} from "../types/order.types";

interface CustomerOrderDetailsProps {
  orderId: string;
}

export function CustomerOrderDetails({
  orderId,
}: CustomerOrderDetailsProps) {
  const [order, setOrder] =
    useState<Order | null>(
      null,
    );

  const [
    cancellationReason,
    setCancellationReason,
  ] = useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    isCancelling,
    setIsCancelling,
  ] = useState(false);

  useEffect(() => {
    let isCancelled =
      false;

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

  async function handleCancelOrder(): Promise<void> {
    if (!order) {
      return;
    }

    const confirmed =
      window.confirm(
        "Cancel this order? Product stock will be restored.",
      );

    if (!confirmed) {
      return;
    }

    try {
      setIsCancelling(true);

      const updatedOrder =
        await cancelCustomerOrder(
          order._id,
          cancellationReason.trim() ||
            undefined,
        );

      setOrder(
        updatedOrder,
      );

      toast.success(
        "Order cancelled successfully.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to cancel the order.",
      );
    } finally {
      setIsCancelling(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <LoaderCircle
          aria-hidden={true}
          className="animate-spin"
          size={30}
        />

        <span className="sr-only">
          Loading order
        </span>
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

  const canCancel =
    order.orderStatus ===
      "pending" ||
    order.orderStatus ===
      "confirmed";

  return (
    <section>
      <div className="flex flex-col justify-between gap-5 border-b border-neutral-200 pb-6 dark:border-neutral-800 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-neutral-500">
            {order.orderNumber}
          </p>

          <h1 className="mt-1 text-3xl font-semibold">
            Order details
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Placed{" "}
            {formatDate(
              order.createdAt,
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusBadge
            label="Order"
            value={
              order.orderStatus
            }
          />

          <StatusBadge
            label="Payment"
            value={
              order.paymentStatus
            }
          />
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {order.items.map(
            (item, index) => (
              <article
                key={`${item.productId}-${index}`}
                className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={
                        item.imageUrl
                      }
                      alt={item.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <Package
                      aria-hidden={true}
                      size={28}
                      className="text-neutral-400"
                    />
                  )}
                </div>

                <div className="flex-1">
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-semibold hover:underline"
                  >
                    {item.name}
                  </Link>

                  <p className="mt-1 text-sm text-neutral-500">
                    Quantity:{" "}
                    {item.quantity}
                  </p>

                  <p className="mt-1 text-sm capitalize text-neutral-500">
                    Fulfillment:{" "}
                    {item.fulfillmentStatus ??
                      "pending"}
                  </p>

                  <p className="mt-3 font-semibold">
                    {formatCurrency(
                      item.lineTotal,
                    )}
                  </p>
                </div>
              </article>
            ),
          )}

          {order.orderStatus ===
            "cancelled" && (
            <section className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <XCircle
                  aria-hidden={true}
                  size={19}
                />

                <h2 className="font-semibold">
                  Order cancelled
                </h2>
              </div>

              {order.cancellationReason && (
                <p className="mt-3 text-sm text-red-700 dark:text-red-300">
                  {
                    order.cancellationReason
                  }
                </p>
              )}

              {order.cancelledAt && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                  Cancelled{" "}
                  {formatDate(
                    order.cancelledAt,
                  )}
                </p>
              )}
            </section>
          )}
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center gap-2">
              <MapPin
                aria-hidden={true}
                size={18}
              />

              <h2 className="font-semibold">
                Shipping address
              </h2>
            </div>

            <address className="mt-4 not-italic leading-7 text-neutral-600 dark:text-neutral-400">
              <p className="font-medium text-neutral-900 dark:text-white">
                {
                  order.shippingAddress
                    .fullName
                }
              </p>

              <p>
                {
                  order.shippingAddress
                    .addressLine1
                }
              </p>

              {order.shippingAddress
                .addressLine2 && (
                <p>
                  {
                    order.shippingAddress
                      .addressLine2
                  }
                </p>
              )}

              <p>
                {
                  order.shippingAddress
                    .postalCode
                }{" "}
                {
                  order.shippingAddress
                    .city
                }
              </p>

              {order.shippingAddress
                .state && (
                <p>
                  {
                    order.shippingAddress
                      .state
                  }
                </p>
              )}

              <p>
                {
                  order.shippingAddress
                    .country
                }
              </p>

              <p className="mt-3">
                {
                  order.shippingAddress
                    .phone
                }
              </p>
            </address>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="font-semibold">
              Order summary
            </h2>

            <SummaryRow
              label="Subtotal"
              value={formatCurrency(
                order.subtotal,
              )}
            />

            <SummaryRow
              label="Shipping"
              value={formatCurrency(
                order.shippingFee,
              )}
            />

            <SummaryRow
              label="Tax"
              value={formatCurrency(
                order.taxAmount,
              )}
            />

            <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 dark:border-neutral-800">
              <span className="font-semibold">
                Total
              </span>

              <span className="text-lg font-semibold">
                {formatCurrency(
                  order.totalAmount,
                )}
              </span>
            </div>
          </section>

          {canCancel && (
            <section className="rounded-2xl border border-red-200 bg-white p-6 dark:border-red-900 dark:bg-neutral-900">
              <h2 className="font-semibold text-red-700 dark:text-red-400">
                Cancel order
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Cancellation is available before fulfillment begins.
              </p>

              <label className="mt-4 block">
                <span className="text-sm font-medium">
                  Reason
                </span>

                <textarea
                  value={
                    cancellationReason
                  }
                  onChange={(event) =>
                    setCancellationReason(
                      event.target.value,
                    )
                  }
                  rows={3}
                  maxLength={300}
                  placeholder="Optional cancellation reason"
                  className="mt-2 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-red-600 dark:border-neutral-700 dark:bg-neutral-950"
                />
              </label>

              <button
                type="button"
                disabled={
                  isCancelling
                }
                onClick={() =>
                  void handleCancelOrder()
                }
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-red-700 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCancelling && (
                  <LoaderCircle
                    aria-hidden={true}
                    className="animate-spin"
                    size={17}
                  />
                )}

                {isCancelling
                  ? "Cancelling..."
                  : "Cancel order"}
              </button>
            </section>
          )}
        </aside>
      </div>
    </section>
  );
}

function StatusBadge({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold capitalize dark:bg-neutral-800">
      {label}: {value}
    </span>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="mt-4 flex justify-between text-sm">
      <span className="text-neutral-500">
        {label}
      </span>

      <span className="font-medium">
        {value}
      </span>
    </div>
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