"use client";

import Link from "next/link";

import { authClient } from "@/lib/auth/auth-client";

export default function CustomerDashboardPage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <main className="p-8">
        <p>Loading your account...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="p-8">
        <p>You must sign in to access this page.</p>

        <Link href="/login">Go to login</Link>
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">
        Welcome, {session.user.name}
      </h1>

      <p className="mt-2 text-neutral-600">
        Your MarketHub customer dashboard is ready.
      </p>
    </main>
  );
}