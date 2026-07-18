import type {
  ReactNode,
} from "react";

import {
  DashboardLayout,
} from "@/components/dashboard/dashboard-layout";
import {
  SellerSidebar,
} from "@/features/sellers/components/seller-sidebar";

interface SellerLayoutProps {
  children: ReactNode;
}

export default function SellerLayout({
  children,
}: SellerLayoutProps) {
  return (
    <DashboardLayout
      sidebar={<SellerSidebar />}
    >
      {children}
    </DashboardLayout>
  );
}