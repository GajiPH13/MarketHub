import type { ReactNode } from "react";

import { requireRole } from "@/lib/auth/server-auth";

interface CustomerDashboardLayoutProps {
  children: ReactNode;
}

export default async function CustomerDashboardLayout({
  children,
}: CustomerDashboardLayoutProps) {
  await requireRole(["customer"]);

  return children;
}