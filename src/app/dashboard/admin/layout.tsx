import type {
  ReactNode,
} from "react";

import {
  DashboardLayout,
} from "@/components/dashboard/dashboard-layout";
import {
  AdminSidebar,
} from "@/features/admin/components/admin-sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <DashboardLayout
      sidebar={<AdminSidebar />}
    >
      {children}
    </DashboardLayout>
  );
}