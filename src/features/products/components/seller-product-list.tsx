"use client";

import {
  Edit3,
  ExternalLink,
  LoaderCircle,
  Package,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import {
  deleteSellerProduct,
  getSellerProducts,
} from "../api/products";
import type {
  Product,
  ProductStatus,
} from "../types/product.types";

type ProductStatusFilter =
  | "all"
  | ProductStatus;

interface StatusOption {
  label: string;
  value: ProductStatusFilter;
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Draft",
    value: "draft",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
];

const STATUS_CLASSES: Record<
  ProductStatus,
  string
> = {
  active:
    "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  draft:
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  inactive:
    "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
};

export function SellerProductList() {
  const [status, setStatus] =
    useState<ProductStatusFilter>("all");

  const [products, setProducts] = useState<
    Product[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    deletingProductId,
    setDeletingProductId,
  ] = useState<string | null>(null);

  const loadProducts =
    useCallback(async (): Promise<void> => {
      try {
        setIsLoading(true);

        const data =
          status === "all"
            ? await getSellerProducts()
            : await getSellerProducts({
                status,
              });

        setProducts(data.items);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load products.",
        );
      } finally {
        setIsLoading(false);
      }
    }, [status]);

  useEffect(() => {
    let isCancelled = false;

    async function initializeProducts(): Promise<void> {
      try {
        const data =
          status === "all"
            ? await getSellerProducts()
            : await getSellerProducts({
                status,
              });

        if (!isCancelled) {
          setProducts(data.items);
        }
      } catch (error) {
        if (!isCancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to load products.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void initializeProducts();

    return () => {
      isCancelled = true;
    };
  }, [status]);

  async function handleDeleteProduct(
    product: Product,
  ): Promise<void> {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingProductId(product._id);

      await deleteSellerProduct(
        product._id,
      );

      setProducts((currentProducts) =>
        currentProducts.filter(
          (currentProduct) =>
            currentProduct._id !==
            product._id,
        ),
      );

      toast.success(
        `${product.name} was deleted.`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete the product.",
      );
    } finally {
      setDeletingProductId(null);
    }
  }

  return (
    <section>
      <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">
            Store inventory
          </p>

          <h1 className="mt-1 text-3xl font-semibold">
            Products
          </h1>

          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            View and manage products in your store.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={() =>
              void loadProducts()
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 text-sm font-medium transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            <RefreshCw
              aria-hidden={true}
              size={16}
              className={
                isLoading
                  ? "animate-spin"
                  : undefined
              }
            />

            Refresh
          </button>

          <Link
            href="/dashboard/seller/products/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            <Plus
              aria-hidden={true}
              size={16}
            />

            Add product
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((option) => {
          const isActive =
            option.value === status;

          return (
            <button
              key={option.value}
              type="button"
              disabled={
                isLoading ||
                deletingProductId !== null
              }
              onClick={() =>
                setStatus(option.value)
              }
              className={
                isActive
                  ? "rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-neutral-900"
                  : "rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-60 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <LoaderCircle
              aria-hidden={true}
              className="animate-spin"
              size={30}
            />

            <span className="sr-only">
              Loading products
            </span>
          </div>
        ) : products.length === 0 ? (
          <EmptyProductState
            status={status}
          />
        ) : (
          <div className="grid gap-5">
            {products.map((product) => (
              <SellerProductCard
                key={product._id}
                product={product}
                deletingProductId={
                  deletingProductId
                }
                onDelete={
                  handleDeleteProduct
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

interface EmptyProductStateProps {
  status: ProductStatusFilter;
}

function EmptyProductState({
  status,
}: EmptyProductStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 px-6 text-center dark:border-neutral-700">
      <Package
        aria-hidden={true}
        size={40}
        className="text-neutral-400"
      />

      <h2 className="mt-4 text-xl font-semibold">
        {status === "all"
          ? "No products yet"
          : `No ${status} products`}
      </h2>

      <p className="mt-2 max-w-md text-sm text-neutral-500">
        Add your first product to start building your
        MarketHub store.
      </p>

      <Link
        href="/dashboard/seller/products/new"
        className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
      >
        <Plus
          aria-hidden={true}
          size={16}
        />

        Add product
      </Link>
    </div>
  );
}

interface SellerProductCardProps {
  product: Product;
  deletingProductId: string | null;
  onDelete: (
    product: Product,
  ) => Promise<void>;
}

function SellerProductCard({
  product,
  deletingProductId,
  onDelete,
}: SellerProductCardProps) {
  const isDeleting =
    deletingProductId === product._id;

  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
          {product.imageUrls[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrls[0]}
              alt={product.name}
              className="size-full object-cover"
            />
          ) : (
            <Package
              aria-hidden={true}
              size={30}
              className="text-neutral-400"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">
                {product.name}
              </h2>

              <p className="mt-1 text-sm capitalize text-neutral-500">
                {product.category}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_CLASSES[product.status]}`}
            >
              {product.status}
            </span>
          </div>

          <dl className="mt-4 grid gap-4 sm:grid-cols-3">
            <ProductDetail
              label="Price"
              value={formatCurrency(
                product.price,
              )}
            />

            <ProductDetail
              label="Stock"
              value={String(product.stock)}
            />

            <ProductDetail
              label="Sales"
              value={String(
                product.totalSales,
              )}
            />
          </dl>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={`/dashboard/seller/products/${product._id}/edit`}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-neutral-300 px-3 text-sm font-medium dark:border-neutral-700"
            >
              <Edit3
                aria-hidden={true}
                size={15}
              />

              Edit
            </Link>

            <Link
              href={`/products/${product.slug}`}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-neutral-300 px-3 text-sm font-medium dark:border-neutral-700"
            >
              <ExternalLink
                aria-hidden={true}
                size={15}
              />

              View
            </Link>

            <button
              type="button"
              disabled={
                deletingProductId !== null
              }
              onClick={() =>
                void onDelete(product)
              }
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-red-300 px-3 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              {isDeleting ? (
                <LoaderCircle
                  aria-hidden={true}
                  className="animate-spin"
                  size={15}
                />
              ) : (
                <Trash2
                  aria-hidden={true}
                  size={15}
                />
              )}

              {isDeleting
                ? "Deleting..."
                : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

interface ProductDetailProps {
  label: string;
  value: string;
}

function ProductDetail({
  label,
  value,
}: ProductDetailProps) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {label}
      </dt>

      <dd className="mt-1 text-sm font-medium">
        {value}
      </dd>
    </div>
  );
}

function formatCurrency(
  value: number,
): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}