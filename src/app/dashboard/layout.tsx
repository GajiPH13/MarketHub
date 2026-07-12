import type { ReactNode } from "react";

import { requireAuthenticatedUser } from "@/lib/auth/server-auth";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  await requireAuthenticatedUser();

  return children;
}