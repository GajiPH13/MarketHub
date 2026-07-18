import type {
  Metadata,
} from "next";
import Link from "next/link";
import {
  LogoutButton,
} from "@/../src/components/auth/logout-button";
import {
  SellerDashboardOverview,
} from "@/features/sellers/components/seller-dashboard-overview";
import { requireRole } from "@/lib/auth/server-auth";

export const metadata: Metadata = {
  title: "Seller Dashboard | MarketHub",
};

export default async function SellerDashboardPage() {
  await requireRole(["seller"]);
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex justify-end">
        <LogoutButton />
      </div>

      <SellerDashboardOverview />
      <nav className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/dashboard/seller/products"
          className="rounded-xl border p-5 transition hover:bg-neutral-50 dark:hover:bg-neutral-900"
        >
          Manage products
        </Link>

        <Link
          href="/dashboard/seller/products/new"
          className="rounded-xl border p-5 transition hover:bg-neutral-50 dark:hover:bg-neutral-900"
        >
          Add product
        </Link>

        <Link
          href="/dashboard/seller/orders"
          className="rounded-xl border p-5 transition hover:bg-neutral-50 dark:hover:bg-neutral-900"
        >
          View orders
        </Link>
      </nav>
    </main>
  );
}