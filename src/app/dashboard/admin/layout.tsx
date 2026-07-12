import type { ReactNode } from "react";

import { requireRole } from "@/lib/auth/server-auth";

interface AdminDashboardLayoutProps {
  children: ReactNode;
}

export default async function AdminDashboardLayout({
  children,
}: AdminDashboardLayoutProps) {
  await requireRole(["admin"]);

  return children;
}