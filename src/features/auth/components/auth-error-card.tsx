"use client";

import {
  AlertTriangle,
  ArrowLeft,
  Headphones,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { getAuthErrorDetails } from "@/features/auth/utils/auth-error";

export function AuthErrorCard() {
  const searchParams = useSearchParams();

  const errorCode =
    searchParams.get("error") ??
    searchParams.get("code") ??
    searchParams.get("error_code");

  const errorDescription =
    searchParams.get("error_description") ??
    searchParams.get("message");

  const details = getAuthErrorDetails(errorCode);

  return (
    <section className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
        <AlertTriangle aria-hidden="true" size={26} />
      </div>

      <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
        Authentication error
      </p>

      <h1 className="mt-2 text-2xl font-semibold">
        {details.title}
      </h1>

      <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-400">
        {details.message}
      </p>

      {errorDescription && (
        <div className="mt-5 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-left dark:border-neutral-700 dark:bg-neutral-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Provider message
          </p>

          <p className="mt-1 break-words text-sm text-neutral-700 dark:text-neutral-300">
            {errorDescription}
          </p>
        </div>
      )}

      {errorCode && process.env.NODE_ENV === "development" && (
        <p className="mt-4 text-xs text-neutral-500">
          Error code:{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 dark:bg-neutral-800">
            {errorCode}
          </code>
        </p>
      )}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        {details.canRetry && (
          <Link
            href="/login"
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            <RotateCcw aria-hidden="true" size={17} />
            Try again
          </Link>
        )}

        <Link
          href="/"
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 font-medium transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          <ArrowLeft aria-hidden="true" size={17} />
          Return home
        </Link>
      </div>

      {!details.canRetry && (
        <Link
          href="/contact"
          className="mt-4 inline-flex items-center justify-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:underline dark:text-neutral-400 dark:hover:text-white"
        >
          <Headphones aria-hidden="true" size={16} />
          Contact MarketHub support
        </Link>
      )}
    </section>
  );
}