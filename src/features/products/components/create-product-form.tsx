"use client";

import {
  LoaderCircle,
  Plus,
  Trash2,
} from "lucide-react";
import {
  useState,
} from "react";
import {
  useRouter,
} from "next/navigation";
import { toast } from "sonner";

import {
  createProduct,
} from "../api/products";
import type {
  ProductStatus,
} from "../types/product.types";

interface ProductFormState {
  name: string;
  description: string;
  category: string;
  brand: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  sku: string;
  imageUrls: string[];
  status: ProductStatus;
}

const INITIAL_STATE: ProductFormState = {
  name: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  compareAtPrice: "",
  stock: "0",
  sku: "",
  imageUrls: [""],
  status: "draft",
};

export function CreateProductForm() {
  const router = useRouter();

  const [form, setForm] =
    useState<ProductFormState>(
      INITIAL_STATE,
    );

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  function updateField<
    Key extends keyof ProductFormState,
  >(
    key: Key,
    value: ProductFormState[Key],
  ): void {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateImageUrl(
    index: number,
    value: string,
  ): void {
    setForm((current) => ({
      ...current,
      imageUrls:
        current.imageUrls.map(
          (url, currentIndex) =>
            currentIndex === index
              ? value
              : url,
        ),
    }));
  }

  function addImageField(): void {
    if (form.imageUrls.length >= 10) {
      toast.error(
        "A product can have at most 10 images.",
      );

      return;
    }

    setForm((current) => ({
      ...current,
      imageUrls: [
        ...current.imageUrls,
        "",
      ],
    }));
  }

  function removeImageField(
    index: number,
  ): void {
    setForm((current) => ({
      ...current,
      imageUrls:
        current.imageUrls.length === 1
          ? [""]
          : current.imageUrls.filter(
              (_, currentIndex) =>
                currentIndex !== index,
            ),
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const price = Number(form.price);
    const stock = Number(form.stock);

    const compareAtPrice =
      form.compareAtPrice.trim()
        ? Number(form.compareAtPrice)
        : null;

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      toast.error(
        "Enter a valid product price.",
      );

      return;
    }

    if (
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      toast.error(
        "Stock must be a non-negative whole number.",
      );

      return;
    }

    if (
      compareAtPrice !== null &&
      (
        !Number.isFinite(compareAtPrice) ||
        compareAtPrice <= price
      )
    ) {
      toast.error(
        "Compare-at price must be greater than the regular price.",
      );

      return;
    }

    try {
      setIsSubmitting(true);

      const product = await createProduct({
        name: form.name.trim(),
        description:
          form.description.trim(),
        category:
          form.category.trim(),
        brand:
          form.brand.trim() || null,
        price,
        compareAtPrice,
        stock,
        sku:
          form.sku.trim() || null,
        imageUrls:
          form.imageUrls
            .map((url) => url.trim())
            .filter(Boolean),
        status: form.status,
      });

      toast.success(
        `${product.name} was created successfully.`,
      );

      router.push(
        "/dashboard/seller/products",
      );

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create the product.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="text-lg font-semibold">
          Basic information
        </h2>

        <div className="mt-6 grid gap-5">
          <FormField
            label="Product name"
            htmlFor="name"
          >
            <input
              id="name"
              value={form.name}
              onChange={(event) =>
                updateField(
                  "name",
                  event.target.value,
                )
              }
              minLength={3}
              maxLength={120}
              required
              className={INPUT_CLASS}
            />
          </FormField>

          <FormField
            label="Description"
            htmlFor="description"
          >
            <textarea
              id="description"
              rows={7}
              value={form.description}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value,
                )
              }
              minLength={20}
              maxLength={5000}
              required
              className={INPUT_CLASS}
            />
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Category"
              htmlFor="category"
            >
              <input
                id="category"
                value={form.category}
                onChange={(event) =>
                  updateField(
                    "category",
                    event.target.value,
                  )
                }
                required
                className={INPUT_CLASS}
              />
            </FormField>

            <FormField
              label="Brand"
              htmlFor="brand"
              optional
            >
              <input
                id="brand"
                value={form.brand}
                onChange={(event) =>
                  updateField(
                    "brand",
                    event.target.value,
                  )
                }
                className={INPUT_CLASS}
              />
            </FormField>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="text-lg font-semibold">
          Price and inventory
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <FormField
            label="Price"
            htmlFor="price"
          >
            <input
              id="price"
              type="number"
              min="0.01"
              step="0.01"
              value={form.price}
              onChange={(event) =>
                updateField(
                  "price",
                  event.target.value,
                )
              }
              required
              className={INPUT_CLASS}
            />
          </FormField>

          <FormField
            label="Compare-at price"
            htmlFor="compareAtPrice"
            optional
          >
            <input
              id="compareAtPrice"
              type="number"
              min="0.01"
              step="0.01"
              value={
                form.compareAtPrice
              }
              onChange={(event) =>
                updateField(
                  "compareAtPrice",
                  event.target.value,
                )
              }
              className={INPUT_CLASS}
            />
          </FormField>

          <FormField
            label="Stock"
            htmlFor="stock"
          >
            <input
              id="stock"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={(event) =>
                updateField(
                  "stock",
                  event.target.value,
                )
              }
              required
              className={INPUT_CLASS}
            />
          </FormField>

          <FormField
            label="SKU"
            htmlFor="sku"
            optional
          >
            <input
              id="sku"
              value={form.sku}
              onChange={(event) =>
                updateField(
                  "sku",
                  event.target.value,
                )
              }
              className={INPUT_CLASS}
            />
          </FormField>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">
              Product images
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Add up to 10 image URLs.
            </p>
          </div>

          <button
            type="button"
            onClick={addImageField}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-neutral-300 px-4 text-sm font-medium dark:border-neutral-700"
          >
            <Plus
              aria-hidden={true}
              size={16}
            />

            Add image
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {form.imageUrls.map(
            (imageUrl, index) => (
              <div
                key={index}
                className="flex gap-3"
              >
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(event) =>
                    updateImageUrl(
                      index,
                      event.target.value,
                    )
                  }
                  placeholder="https://example.com/product.jpg"
                  className={INPUT_CLASS}
                />

                <button
                  type="button"
                  aria-label={`Remove image ${index + 1}`}
                  onClick={() =>
                    removeImageField(index)
                  }
                  className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-red-300 text-red-700 dark:border-red-900 dark:text-red-400"
                >
                  <Trash2
                    aria-hidden={true}
                    size={17}
                  />
                </button>
              </div>
            ),
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <FormField
          label="Product status"
          htmlFor="status"
        >
          <select
            id="status"
            value={form.status}
            onChange={(event) =>
              updateField(
                "status",
                event.target
                  .value as ProductStatus,
              )
            }
            className={INPUT_CLASS}
          >
            <option value="draft">
              Draft
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>
        </FormField>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-neutral-900 px-6 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          {isSubmitting && (
            <LoaderCircle
              aria-hidden={true}
              className="animate-spin"
              size={17}
            />
          )}

          {isSubmitting
            ? "Creating product..."
            : "Create product"}
        </button>
      </div>
    </form>
  );
}

interface FormFieldProps {
  label: string;
  htmlFor: string;
  optional?: boolean;
  children: React.ReactNode;
}

function FormField({
  label,
  htmlFor,
  optional = false,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium"
      >
        {label}

        {optional && (
          <span className="ml-1 text-neutral-500">
            (optional)
          </span>
        )}
      </label>

      <div className="mt-2">
        {children}
      </div>
    </div>
  );
}

const INPUT_CLASS =
  "h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:focus:border-white";