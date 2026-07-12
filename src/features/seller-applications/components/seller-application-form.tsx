"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";

import { submitSellerApplication } from "../api/seller-applications";
import {
  sellerApplicationSchema,
  type SellerApplicationFormValues,
} from "../schemas/seller-application.schema";

const CATEGORY_OPTIONS = [
  "electronics",
  "fashion",
  "home",
  "beauty",
  "sports",
  "books",
] as const;

export function SellerApplicationForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<SellerApplicationFormValues>({
    resolver: zodResolver(sellerApplicationSchema),
    defaultValues: {
      businessName: "",
      businessEmail: "",
      businessPhone: "",
      businessAddress: "",
      sellerBio: "",
      categoryFocus: [],
      logoUrl: "",
      documentUrl: "",
    },
  });

  const onSubmit: SubmitHandler<
    SellerApplicationFormValues
  > = async (values) => {
    try {
      await submitSellerApplication(values);

      toast.success(
        "Your seller application was submitted.",
      );

      reset();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to submit your application.",
      );
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="businessName"
          className="mb-1.5 block text-sm font-medium"
        >
          Business name
        </label>

        <input
          id="businessName"
          type="text"
          autoComplete="organization"
          placeholder="MarketHub Demo Store"
          aria-invalid={Boolean(errors.businessName)}
          aria-describedby={
            errors.businessName
              ? "business-name-error"
              : undefined
          }
          {...register("businessName")}
          className="h-11 w-full rounded-lg border border-neutral-300 px-3 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white"
        />

        {errors.businessName && (
          <p
            id="business-name-error"
            className="mt-1 text-sm text-red-600"
          >
            {errors.businessName.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="businessEmail"
          className="mb-1.5 block text-sm font-medium"
        >
          Business email
        </label>

        <input
          id="businessEmail"
          type="email"
          autoComplete="email"
          placeholder="store@example.com"
          aria-invalid={Boolean(errors.businessEmail)}
          aria-describedby={
            errors.businessEmail
              ? "business-email-error"
              : undefined
          }
          {...register("businessEmail")}
          className="h-11 w-full rounded-lg border border-neutral-300 px-3 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white"
        />

        {errors.businessEmail && (
          <p
            id="business-email-error"
            className="mt-1 text-sm text-red-600"
          >
            {errors.businessEmail.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="businessPhone"
          className="mb-1.5 block text-sm font-medium"
        >
          Business phone
        </label>

        <input
          id="businessPhone"
          type="tel"
          autoComplete="tel"
          placeholder="+49 123 4567890"
          aria-invalid={Boolean(errors.businessPhone)}
          aria-describedby={
            errors.businessPhone
              ? "business-phone-error"
              : undefined
          }
          {...register("businessPhone")}
          className="h-11 w-full rounded-lg border border-neutral-300 px-3 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white"
        />

        {errors.businessPhone && (
          <p
            id="business-phone-error"
            className="mt-1 text-sm text-red-600"
          >
            {errors.businessPhone.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="businessAddress"
          className="mb-1.5 block text-sm font-medium"
        >
          Business address
        </label>

        <textarea
          id="businessAddress"
          rows={3}
          placeholder="Street, city, postal code, country"
          aria-invalid={Boolean(errors.businessAddress)}
          aria-describedby={
            errors.businessAddress
              ? "business-address-error"
              : undefined
          }
          {...register("businessAddress")}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white"
        />

        {errors.businessAddress && (
          <p
            id="business-address-error"
            className="mt-1 text-sm text-red-600"
          >
            {errors.businessAddress.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="sellerBio"
          className="mb-1.5 block text-sm font-medium"
        >
          Seller bio
        </label>

        <textarea
          id="sellerBio"
          rows={5}
          placeholder="Describe your business, products, and experience."
          aria-invalid={Boolean(errors.sellerBio)}
          aria-describedby={
            errors.sellerBio
              ? "seller-bio-error"
              : undefined
          }
          {...register("sellerBio")}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white"
        />

        {errors.sellerBio && (
          <p
            id="seller-bio-error"
            className="mt-1 text-sm text-red-600"
          >
            {errors.sellerBio.message}
          </p>
        )}
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">
          Product categories
        </legend>

        <div className="grid gap-3 sm:grid-cols-2">
          {CATEGORY_OPTIONS.map((category) => (
            <label
              key={category}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 px-3 py-2 text-sm capitalize dark:border-neutral-700"
            >
              <input
                type="checkbox"
                value={category}
                {...register("categoryFocus")}
                className="size-4 rounded border-neutral-300"
              />

              {category}
            </label>
          ))}
        </div>

        {errors.categoryFocus && (
          <p className="mt-1 text-sm text-red-600">
            {errors.categoryFocus.message}
          </p>
        )}
      </fieldset>

      <div>
        <label
          htmlFor="logoUrl"
          className="mb-1.5 block text-sm font-medium"
        >
          Logo URL{" "}
          <span className="text-neutral-500">
            (optional)
          </span>
        </label>

        <input
          id="logoUrl"
          type="url"
          placeholder="https://example.com/logo.png"
          aria-invalid={Boolean(errors.logoUrl)}
          aria-describedby={
            errors.logoUrl
              ? "logo-url-error"
              : undefined
          }
          {...register("logoUrl")}
          className="h-11 w-full rounded-lg border border-neutral-300 px-3 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white"
        />

        {errors.logoUrl && (
          <p
            id="logo-url-error"
            className="mt-1 text-sm text-red-600"
          >
            {errors.logoUrl.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="documentUrl"
          className="mb-1.5 block text-sm font-medium"
        >
          Business document URL{" "}
          <span className="text-neutral-500">
            (optional)
          </span>
        </label>

        <input
          id="documentUrl"
          type="url"
          placeholder="https://example.com/document.pdf"
          aria-invalid={Boolean(errors.documentUrl)}
          aria-describedby={
            errors.documentUrl
              ? "document-url-error"
              : undefined
          }
          {...register("documentUrl")}
          className="h-11 w-full rounded-lg border border-neutral-300 px-3 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white"
        />

        {errors.documentUrl && (
          <p
            id="document-url-error"
            className="mt-1 text-sm text-red-600"
          >
            {errors.documentUrl.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        {isSubmitting ? (
          <LoaderCircle
            aria-hidden="true"
            className="animate-spin"
            size={18}
          />
        ) : (
          <Store
            aria-hidden="true"
            size={18}
          />
        )}

        {isSubmitting
          ? "Submitting application..."
          : "Apply to become a seller"}
      </button>
    </form>
  );
}