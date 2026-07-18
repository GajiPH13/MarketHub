import type {
  Metadata,
} from "next";

import {
  AdminOrderList,
} from "@/features/orders/components/admin-order-list";

export const metadata: Metadata = {
  title:
    "Admin Orders | MarketHub",
};

export default function AdminOrdersPage() {
  return <AdminOrderList />;
}