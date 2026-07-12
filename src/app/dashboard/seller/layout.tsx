import type { ReactNode } from "react";

import { requireRole } from "@/lib/auth/server-auth";

interface SellerDashboardLayoutProps {
  children: ReactNode;
}

export default async function SellerDashboardLayout({
  children,
}: SellerDashboardLayoutProps) {
  await requireRole(["seller"]);

  return children;
}