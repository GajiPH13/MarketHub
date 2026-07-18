"use client";

import {
  LoaderCircle,
  MapPin,
  Package,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import {
  getSellerOrderById,
  updateSellerOrderStatus,
} from "../api/orders";
import type {
  SellerOrder,
  SellerOrderItemStatus,
} from "../types/order.types";

interface SellerOrderDetailsProps {
  orderId: string;
}

const NEXT_STATUS: Partial<
  Record<
    SellerOrderItemStatus,
    SellerOrderItemStatus
  >
> = {
  pending: "processing",
  processing: "shipped",
  shipped: "delivered",
};

export function SellerOrderDetails({
  orderId,
}: SellerOrderDetailsProps) {
  const [order, setOrder] =
    useState<SellerOrder | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isUpdating, setIsUpdating] =
    useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function initializeOrder(): Promise<void> {
      try {
        const result =
          await getSellerOrderById(
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

  async function handleAdvanceStatus(): Promise<void> {
    if (!order) {
      return;
    }

    const currentStatus =
      order.items[0]
        ?.fulfillmentStatus ??
      "pending";

    const nextStatus =
      NEXT_STATUS[currentStatus];

    if (!nextStatus) {
      return;
    }

    try {
      setIsUpdating(true);

      const updatedOrder =
        await updateSellerOrderStatus(
          order._id,
          nextStatus,
        );

      setOrder(updatedOrder);

      toast.success(
        `Order marked as ${nextStatus}.`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update the order.",
      );
    } finally {
      setIsUpdating(false);
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
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-semibold">
          Order not found
        </h1>
      </div>
    );
  }

  const currentStatus =
    order.items[0]
      ?.fulfillmentStatus ??
    "pending";

  const nextStatus =
    NEXT_STATUS[currentStatus];

  return (
    <section>
      <div className="flex flex-col justify-between gap-5 border-b border-neutral-200 pb-6 dark:border-neutral-800 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-neutral-500">
            {order.orderNumber}
          </p>

          <h1 className="mt-1 text-3xl font-semibold">
            Seller order
          </h1>

          <p className="mt-2 text-sm capitalize text-neutral-500">
            Fulfillment: {currentStatus}
          </p>
        </div>

        {nextStatus && (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() =>
              void handleAdvanceStatus()
            }
            className="inline-flex h-11 items-center justify-center rounded-lg bg-neutral-900 px-5 text-sm font-semibold capitalize text-white disabled:opacity-60 dark:bg-white dark:text-neutral-900"
          >
            {isUpdating
              ? "Updating..."
              : `Mark as ${nextStatus}`}
          </button>
        )}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {order.items.map((item) => (
            <article
              key={item.productId}
              className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <Package
                    aria-hidden={true}
                    className="text-neutral-400"
                  />
                )}
              </div>

              <div className="flex-1">
                <h2 className="font-semibold">
                  {item.name}
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Quantity: {item.quantity}
                </p>

                <p className="mt-3 font-semibold">
                  {formatCurrency(
                    item.lineTotal,
                  )}
                </p>
              </div>
            </article>
          ))}
        </div>

        <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
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

          <div className="mt-6 border-t border-neutral-200 pt-5 dark:border-neutral-800">
            <div className="flex justify-between">
              <span className="text-neutral-500">
                Seller subtotal
              </span>

              <span className="font-semibold">
                {formatCurrency(
                  order.sellerSubtotal,
                )}
              </span>
            </div>
          </div>

          {order.customerNote && (
            <div className="mt-6">
              <p className="text-sm font-semibold">
                Customer note
              </p>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                {order.customerNote}
              </p>
            </div>
          )}
        </aside>
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