import type { Metadata } from "next";

import { ForgotPasswordForm } from "../../../features/auth/components/forget-password-form";

export const metadata: Metadata = {
  title: "Forgot Password | MarketHub",
  description:
    "Request a secure password reset link for your MarketHub account.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12 dark:bg-neutral-950">
      <ForgotPasswordForm />
    </main>
  );
}