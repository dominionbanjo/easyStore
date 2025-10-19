"use client";

import OrderCard from "@/components/shared/OrderCard";

export default function Orders() {
  const orders = [
    {
      id: 1,
      productId: 1,
      name: "Leather Handbag",
      price: "$120",
      image:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=800",
      status: "Delivered" as const,
      date: "Oct 12, 2025",
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Orders</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {orders.map((order) => (
          <OrderCard key={order.id} {...order} />
        ))}
      </div>
    </div>
  );
}
