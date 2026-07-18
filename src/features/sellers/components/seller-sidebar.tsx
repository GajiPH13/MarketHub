"use client";

import {
  BarChart3,
  LayoutDashboard,
  Package,
  PlusCircle,
  Settings,
  ShoppingBag,
  Store,
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

const SELLER_NAVIGATION_ITEMS:
  DashboardNavigationItem[] = [
    {
      label: "Overview",
      href: "/dashboard/seller",
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      href: "/dashboard/seller/products",
      icon: Package,
    },
    {
      label: "Add product",
      href: "/dashboard/seller/products/new",
      icon: PlusCircle,
    },
    {
      label: "Orders",
      href: "/dashboard/seller/orders",
      icon: ShoppingBag,
    },
    {
      label: "Analytics",
      href: "/dashboard/seller/analytics",
      icon: BarChart3,
    },
    {
      label: "Store profile",
      href: "/dashboard/seller/profile",
      icon: Store,
    },
    {
      label: "Settings",
      href: "/dashboard/seller/settings",
      icon: Settings,
    },
  ];

export function SellerSidebar() {
  return (
    <DashboardSidebar
      title="Seller Dashboard"
      subtitle="Manage your store"
      dashboardHomeHref="/dashboard/seller"
      navigationItems={
        SELLER_NAVIGATION_ITEMS
      }
      footer={
        <LogoutButton />
      }
    />
  );
}