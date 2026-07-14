"use client";

import {
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  getCart,
} from "@/features/cart/api/cart";
import type {
  Cart,
} from "@/features/cart/types/cart.types";
import {
  createOrder,
} from "../api/orders";

interface CheckoutFormState {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  customerNote: string;
}

const INITIAL_FORM: CheckoutFormState = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Germany",
  customerNote: "",
};

export function CheckoutForm() {
  const router = useRouter();

  const [form, setForm] =
    useState<CheckoutFormState>(
      INITIAL_FORM,
    );

  const [cart, setCart] =
    useState<Cart | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function initializeCheckout(): Promise<void> {
      try {
        const result =
          await getCart();

        if (!isCancelled) {
          setCart(result);
        }
      } catch (error) {
        if (!isCancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to load checkout.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void initializeCheckout();

    return () => {
      isCancelled = true;
    };
  }, []);

  function updateField(
    field: keyof CheckoutFormState,
    value: string,
  ): void {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!cart || cart.items.length === 0) {
      toast.error(
        "Your cart is empty.",
      );

      return;
    }

    try {
      setIsSubmitting(true);

      const order =
        await createOrder({
          shippingAddress: {
            fullName:
              form.fullName.trim(),

            phone:
              form.phone.trim(),

            addressLine1:
              form.addressLine1.trim(),

            city:
              form.city.trim(),

            postalCode:
              form.postalCode.trim(),

            country:
              form.country.trim(),

            ...(form.addressLine2.trim()
              ? {
                  addressLine2:
                    form.addressLine2.trim(),
                }
              : {}),

            ...(form.state.trim()
              ? {
                  state:
                    form.state.trim(),
                }
              : {}),
          },

          ...(form.customerNote.trim()
            ? {
                customerNote:
                  form.customerNote.trim(),
              }
            : {}),
        });

      toast.success(
        "Order created successfully.",
      );

      router.push(
        `/orders/${order._id}/success`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create the order.",
      );
    } finally {
      setIsSubmitting(false);
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

  if (!cart || cart.items.length === 0) {
    return (
      <section className="py-20 text-center">
        <h1 className="text-2xl font-semibold">
          Your cart is empty
        </h1>

        <p className="mt-2 text-neutral-500">
          Add products before starting checkout.
        </p>
      </section>
    );
  }

  return (
    <form
      onSubmit={(event) =>
        void handleSubmit(event)
      }
      className="grid gap-8 lg:grid-cols-[1fr_360px]"
    >
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-sm font-medium text-neutral-500">
          Delivery information
        </p>

        <h1 className="mt-1 text-3xl font-semibold">
          Checkout
        </h1>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <FormField
            label="Full name"
            value={form.fullName}
            required
            onChange={(value) =>
              updateField(
                "fullName",
                value,
              )
            }
          />

          <FormField
            label="Phone"
            value={form.phone}
            required
            onChange={(value) =>
              updateField(
                "phone",
                value,
              )
            }
          />

          <div className="sm:col-span-2">
            <FormField
              label="Address line 1"
              value={form.addressLine1}
              required
              onChange={(value) =>
                updateField(
                  "addressLine1",
                  value,
                )
              }
            />
          </div>

          <div className="sm:col-span-2">
            <FormField
              label="Address line 2"
              value={form.addressLine2}
              onChange={(value) =>
                updateField(
                  "addressLine2",
                  value,
                )
              }
            />
          </div>

          <FormField
            label="City"
            value={form.city}
            required
            onChange={(value) =>
              updateField(
                "city",
                value,
              )
            }
          />

          <FormField
            label="State"
            value={form.state}
            onChange={(value) =>
              updateField(
                "state",
                value,
              )
            }
          />

          <FormField
            label="Postal code"
            value={form.postalCode}
            required
            onChange={(value) =>
              updateField(
                "postalCode",
                value,
              )
            }
          />

          <FormField
            label="Country"
            value={form.country}
            required
            onChange={(value) =>
              updateField(
                "country",
                value,
              )
            }
          />
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-medium">
            Order note
          </span>

          <textarea
            value={form.customerNote}
            onChange={(event) =>
              updateField(
                "customerNote",
                event.target.value,
              )
            }
            rows={4}
            maxLength={500}
            className="mt-2 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:focus:border-white"
          />
        </label>
      </section>

      <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="text-lg font-semibold">
          Order summary
        </h2>

        <div className="mt-5 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between gap-4 text-sm"
            >
              <span className="text-neutral-600 dark:text-neutral-400">
                {item.name} × {item.quantity}
              </span>

              <span className="font-medium">
                {formatCurrency(
                  item.lineTotal,
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-neutral-200 pt-5 dark:border-neutral-800">
          <div className="flex justify-between">
            <span className="font-medium">
              Total
            </span>

            <span className="text-xl font-semibold">
              {formatCurrency(
                cart.subtotal,
              )}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900"
        >
          {isSubmitting ? (
            <LoaderCircle
              aria-hidden={true}
              className="animate-spin"
              size={18}
            />
          ) : (
            <LockKeyhole
              aria-hidden={true}
              size={18}
            />
          )}

          {isSubmitting
            ? "Creating order..."
            : "Place order"}
        </button>

        <p className="mt-3 text-center text-xs text-neutral-500">
          Payment will be added in a later step.
        </p>
      </aside>
    </form>
  );
}

interface FormFieldProps {
  label: string;
  value: string;
  required?: boolean;
  onChange: (
    value: string,
  ) => void;
}

function FormField({
  label,
  value,
  required = false,
  onChange,
}: FormFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium">
        {label}
      </span>

      <input
        type="text"
        value={value}
        required={required}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="mt-2 h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:focus:border-white"
      />
    </label>
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