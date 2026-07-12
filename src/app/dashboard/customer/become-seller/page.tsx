import type { Metadata } from "next";

import { SellerApplicationForm } from "@/features/seller-applications/components/seller-application-form";

export const metadata: Metadata = {
  title: "Become a Seller | MarketHub",
};

export default function BecomeSellerPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
        <p className="text-sm font-medium text-neutral-500">
          Seller application
        </p>

        <h1 className="mt-2 text-3xl font-semibold">
          Start selling on MarketHub
        </h1>

        <p className="mt-3 text-neutral-600 dark:text-neutral-400">
          Tell us about your business. An administrator will
          review your application.
        </p>

        <div className="mt-8">
          <SellerApplicationForm />
        </div>
      </section>
    </main>
  );
}