"use client";

import HomepageLayout from "@/components/layout/homepage/HomePageLayout";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import OrderCard from "@/components/shared/OrderCard";

export default function OrdersPage() {
  const [orders] = useState([
    {
      id: 1,
      productId: 1,
      name: "Leather Handbag",
      price: "$120",
      image:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=800",
      status: "Delivered",
      date: "Oct 12, 2025",
    },
    {
      id: 2,
      productId: 2,
      name: "Wireless Headphones",
      price: "$99.99",
      image:
        "https://images.unsplash.com/photo-1585386959984-a41552231693?w=800",
      status: "Shipped",
      date: "Oct 15, 2025",
    },
    {
      id: 3,
      productId: 3,
      name: "Smart Watch",
      price: "$149.99",
      image:
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800",
      status: "Pending",
      date: "Oct 18, 2025",
    },
  ] as const);

  return (
    <HomepageLayout>
      <main className="min-h-screen bg-emerald-50 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-10">
            <ShoppingBag className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-3xl font-bold text-center">Your Orders</h1>
          </div>

          {orders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {orders.map((order) => (
                <OrderCard key={order.id} {...order} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground mt-20">
              <p className="text-lg">You haven’t placed any orders yet.</p>
            </div>
          )}
        </div>
      </main>
    </HomepageLayout>
  );
}
