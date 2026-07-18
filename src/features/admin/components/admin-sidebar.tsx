"use client";

import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  Users,
} from "lucide-react";

import {
  LogoutButton,
} from "@/components/auth/logout-button";
import {
  DashboardSidebar,
} from "@/components/dashboard/dashboard-sidebar";
import type {
  DashboardNavigationItem,
} from "@/components/dashboard/dashboard-sidebar";

const ADMIN_NAVIGATION_ITEMS:
  DashboardNavigationItem[] = [
    {
      label: "Overview",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Seller applications",
      href: "/dashboard/admin/seller-applications",
      icon: Store,
    },
    {
      label: "Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      label: "Products",
      href: "/dashboard/admin/products",
      icon: Package,
    },
    {
      label: "Orders",
      href: "/dashboard/admin/orders",
      icon: ShoppingBag,
    },
  ];

export function AdminSidebar() {
  return (
    <DashboardSidebar
      title="MarketHub Admin"
      subtitle="Marketplace management"
      dashboardHomeHref="/dashboard/admin"
      navigationItems={
        ADMIN_NAVIGATION_ITEMS
      }
      footer={
        <LogoutButton />
      }
    />
  );
}