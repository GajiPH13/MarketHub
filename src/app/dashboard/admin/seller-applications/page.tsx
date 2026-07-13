import type { Metadata } from "next";

import { AdminSellerApplications } from "@/features/seller-applications/components/admin-seller-applications";

export const metadata: Metadata = {
  title: "Seller Applications | MarketHub Admin",
  description:
    "Review and manage MarketHub seller applications.",
};

export default function AdminSellerApplicationsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <AdminSellerApplications />
    </main>
  );
}