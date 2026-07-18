"use client";

import {
  Heart,
  LayoutDashboard,
  MapPin,
  Settings,
  ShoppingBag,
  ShoppingCart,
  UserRound,
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

const CUSTOMER_NAVIGATION_ITEMS:
  DashboardNavigationItem[] = [
    {
      label: "Overview",
      href: "/dashboard/customer",
      icon: LayoutDashboard,
    },
    {
      label: "Orders",
      href: "/orders",
      icon: ShoppingBag,
    },
    {
      label: "Cart",
      href: "/cart",
      icon: ShoppingCart,
    },
    {
      label: "Wishlist",
      href: "/wishlist",
      icon: Heart,
    },
    {
      label: "Profile",
      href: "/dashboard/customer/profile",
      icon: UserRound,
    },
    {
      label: "Addresses",
      href: "/dashboard/customer/addresses",
      icon: MapPin,
    },
    {
      label: "Settings",
      href: "/dashboard/customer/settings",
      icon: Settings,
    },
  ];

export function CustomerSidebar() {
  return (
    <DashboardSidebar
      title="My MarketHub"
      subtitle="Customer dashboard"
      dashboardHomeHref="/dashboard/customer"
      navigationItems={
        CUSTOMER_NAVIGATION_ITEMS
      }
      footer={
        <LogoutButton />
      }
    />
  );
}