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
  getAdminOrderById,
  updateAdminOrder,
} from "../api/orders";
import type {
  AdminOrder,
  OrderStatus,
  PaymentStatus,
} from "../types/order.types";

interface AdminOrderDetailsProps {
  orderId: string;
}

export function AdminOrderDetails({
  orderId,
}: AdminOrderDetailsProps) {
  const [order, setOrder] =
    useState<AdminOrder | null>(
      null,
    );

  const [
    selectedOrderStatus,
    setSelectedOrderStatus,
  ] =
    useState<OrderStatus>(
      "pending",
    );

  const [
    selectedPaymentStatus,
    setSelectedPaymentStatus,
  ] =
    useState<PaymentStatus>(
      "pending",
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [isUpdating, setIsUpdating] =
    useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function initializeOrder(): Promise<void> {
      try {
        const result =
          await getAdminOrderById(
            orderId,
          );

        if (!isCancelled) {
          setOrder(result);

          setSelectedOrderStatus(
            result.orderStatus,
          );

          setSelectedPaymentStatus(
            result.paymentStatus,
          );
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

  async function handleUpdate(): Promise<void> {
    if (!order) {
      return;
    }

    const input: {
      orderStatus?: OrderStatus;
      paymentStatus?: PaymentStatus;
    } = {};

    if (
      selectedOrderStatus !==
      order.orderStatus
    ) {
      input.orderStatus =
        selectedOrderStatus;
    }

    if (
      selectedPaymentStatus !==
      order.paymentStatus
    ) {
      input.paymentStatus =
        selectedPaymentStatus;
    }

    if (
      input.orderStatus === undefined &&
      input.paymentStatus === undefined
    ) {
      toast.info(
        "No status changes selected.",
      );

      return;
    }

    try {
      setIsUpdating(true);

      const updatedOrder =
        await updateAdminOrder(
          order._id,
          input,
        );

      setOrder(updatedOrder);

      setSelectedOrderStatus(
        updatedOrder.orderStatus,
      );

      setSelectedPaymentStatus(
        updatedOrder.paymentStatus,
      );

      toast.success(
        "Order updated successfully.",
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

  return (
    <section>
      <div className="flex flex-col justify-between gap-5 border-b border-neutral-200 pb-6 dark:border-neutral-800 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm text-neutral-500">
            {order.orderNumber}
          </p>

          <h1 className="mt-1 text-3xl font-semibold">
            Admin order
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Created{" "}
            {formatDate(
              order.createdAt,
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={
              selectedOrderStatus
            }
            onChange={(event) =>
              setSelectedOrderStatus(
                event.target
                  .value as OrderStatus,
              )
            }
            className="h-10 rounded-lg border border-neutral-300 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-950"
          >
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
            value={
              selectedPaymentStatus
            }
            onChange={(event) =>
              setSelectedPaymentStatus(
                event.target
                  .value as PaymentStatus,
              )
            }
            className="h-10 rounded-lg border border-neutral-300 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-950"
          >
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

          <button
            type="button"
            disabled={isUpdating}
            onClick={() =>
              void handleUpdate()
            }
            className="h-10 rounded-lg bg-neutral-900 px-5 text-sm font-semibold text-white disabled:opacity-60 dark:bg-white dark:text-neutral-900"
          >
            {isUpdating
              ? "Updating..."
              : "Save changes"}
          </button>
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
                      className="text-neutral-400"
                    />
                  )}
                </div>

                <div className="flex-1">
                  <h2 className="font-semibold">
                    {item.name}
                  </h2>

                  <p className="mt-1 text-sm text-neutral-500">
                    Quantity:{" "}
                    {item.quantity}
                  </p>

                  <p className="mt-1 text-sm text-neutral-500">
                    Seller:{" "}
                    {
                      item.sellerUserId
                    }
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
                  order
                    .shippingAddress
                    .fullName
                }
              </p>

              <p>
                {
                  order
                    .shippingAddress
                    .addressLine1
                }
              </p>

              {order
                .shippingAddress
                .addressLine2 && (
                <p>
                  {
                    order
                      .shippingAddress
                      .addressLine2
                  }
                </p>
              )}

              <p>
                {
                  order
                    .shippingAddress
                    .postalCode
                }{" "}
                {
                  order
                    .shippingAddress
                    .city
                }
              </p>

              <p>
                {
                  order
                    .shippingAddress
                    .country
                }
              </p>

              <p className="mt-3">
                {
                  order
                    .shippingAddress
                    .phone
                }
              </p>
            </address>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="font-semibold">
              Order totals
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
        </aside>
      </div>
    </section>
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