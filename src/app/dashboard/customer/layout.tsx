import type {
  ReactNode,
} from "react";

import {
  DashboardLayout,
} from "@/components/dashboard/dashboard-layout";
import {
  CustomerSidebar,
} from "@/features/customers/components/customer-sidebar";

interface CustomerLayoutProps {
  children: ReactNode;
}

export default function CustomerLayout({
  children,
}: CustomerLayoutProps) {
  return (
    <DashboardLayout
      sidebar={<CustomerSidebar />}
    >
      {children}
    </DashboardLayout>
  );
}