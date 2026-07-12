import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthErrorCard } from "@/features/auth/components/auth-error-card";

export const metadata: Metadata = {
  title: "Authentication Error | MarketHub",
  description:
    "MarketHub could not complete your authentication request.",
};

export default function AuthenticationErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12 dark:bg-neutral-950">
      <Suspense
        fallback={
          <section className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Loading authentication error...
            </p>
          </section>
        }
      >
        <AuthErrorCard />
      </Suspense>
    </main>
  );
}