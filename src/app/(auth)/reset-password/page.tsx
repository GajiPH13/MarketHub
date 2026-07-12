import type { Metadata } from "next";
import { Suspense } from "react";

import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password | MarketHub",
  description:
    "Set a new secure password for your MarketHub account.",
};

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12 dark:bg-neutral-950">
      <Suspense
        fallback={
          <p className="text-sm text-neutral-600">
            Loading password reset...
          </p>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}