"use client";

import {
  LoaderCircle,
  PackageSearch,
  Search,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import {
  getPublicProducts,
} from "../api/products";
import type {
  Product,
  ProductSort,
} from "../types/product.types";
import {
  PublicProductCard,
} from "./public-product-card";

const CATEGORIES = [
  "all",
  "electronics",
  "home",
  "sports",
  "fashion",
  "beauty",
  "books",
] as const;

export function ProductCatalog() {
  const [products, setProducts] = useState<
    Product[]
  >([]);

  const [search, setSearch] =
    useState("");

  const [submittedSearch, setSubmittedSearch] =
    useState("");

  const [category, setCategory] =
    useState("all");

  const [sort, setSort] =
    useState<ProductSort>("newest");

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function initializeProducts(): Promise<void> {
      try {
        const data =
          await getPublicProducts({
            sort,

            ...(submittedSearch
              ? {
                  search: submittedSearch,
                }
              : {}),

            ...(category !== "all"
              ? {
                  category,
                }
              : {}),
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
  }, [
    category,
    sort,
    submittedSearch,
  ]);

  function handleSearch(
    event: React.FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    setIsLoading(true);
    setSubmittedSearch(search.trim());
  }

  function handleCategoryChange(
    nextCategory: string,
  ): void {
    setIsLoading(true);
    setCategory(nextCategory);
  }

  function handleSortChange(
    nextSort: ProductSort,
  ): void {
    setIsLoading(true);
    setSort(nextSort);
  }

  return (
    <section>
      <div className="flex flex-col gap-5 border-b border-neutral-200 pb-7 dark:border-neutral-800 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">
            MarketHub catalog
          </p>

          <h1 className="mt-1 text-3xl font-semibold">
            Products
          </h1>

          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Discover products from approved sellers.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="flex w-full max-w-lg gap-2"
        >
          <div className="relative flex-1">
            <Search
              aria-hidden={true}
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search products"
              className="h-11 w-full rounded-lg border border-neutral-300 bg-white pl-10 pr-3 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:focus:border-white"
            />
          </div>

          <button
            type="submit"
            className="h-11 rounded-lg bg-neutral-900 px-5 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900"
          >
            Search
          </button>
        </form>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(
            (categoryOption) => {
              const isActive =
                categoryOption === category;

              return (
                <button
                  key={categoryOption}
                  type="button"
                  onClick={() =>
                    handleCategoryChange(
                      categoryOption,
                    )
                  }
                  className={
                    isActive
                      ? "rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium capitalize text-white dark:bg-white dark:text-neutral-900"
                      : "rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium capitalize dark:border-neutral-700"
                  }
                >
                  {categoryOption}
                </button>
              );
            },
          )}
        </div>

        <select
          value={sort}
          onChange={(event) =>
            handleSortChange(
              event.target
                .value as ProductSort,
            )
          }
          className="h-10 rounded-lg border border-neutral-300 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-950"
        >
          <option value="newest">
            Newest
          </option>

          <option value="price-low">
            Price: Low to high
          </option>

          <option value="price-high">
            Price: High to low
          </option>
        </select>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="flex min-h-80 items-center justify-center">
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
          <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 px-6 text-center dark:border-neutral-700">
            <PackageSearch
              aria-hidden={true}
              size={42}
              className="text-neutral-400"
            />

            <h2 className="mt-4 text-xl font-semibold">
              No products found
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              Try another search or category.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <PublicProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}