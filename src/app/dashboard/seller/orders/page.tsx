import type {
  Metadata,
} from "next";

import {
  SellerOrderList,
} from "@/features/orders/components/seller-order-list";

export const metadata: Metadata = {
  title: "Seller Orders | MarketHub",
};

export default function SellerOrdersPage() {
  return (
    <SellerOrderList />
  );
}