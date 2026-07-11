import type { Metadata } from "next";

import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Sign In | MarketHub",
  description:
    "Sign in to your MarketHub customer, seller, or administrator account.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12 dark:bg-neutral-950">
      <LoginForm />
    </main>
  );
}