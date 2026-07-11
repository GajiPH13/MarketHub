import Link from "next/link";

export default function AccountBlockedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
      <section className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
          Account restricted
        </p>

        <h1 className="mt-3 text-2xl font-semibold">
          Your account is currently blocked
        </h1>

        <p className="mt-3 text-neutral-600 dark:text-neutral-400">
          Contact MarketHub support if you believe this
          restriction was applied by mistake.
        </p>

        <Link
          href="/contact"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-neutral-900 px-5 font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          Contact support
        </Link>
      </section>
    </main>
  );
}