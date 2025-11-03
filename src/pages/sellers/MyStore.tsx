"use client";

import StoreProductCard from "@/modules/sellerDashboard/components/StoreProductCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyStore() {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      name: "Classic Leather Bag",
      price: "$120",
      image:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=800",
      category: "Fashion",
      rating: 4.6,
    },
    {
      id: 2,
      name: "Wireless Headphones",
      price: "$99.99",
      image:
        "https://images.unsplash.com/photo-1585386959984-a41552231693?w=800",
      category: "Electronics",
      rating: 4.4,
    },
  ];

  return (
    <div className="space-y-8 fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Store</h2>
        <Button
          className="bg-primary text-white rounded-full"
          onClick={() => navigate("/dashboard/store/add-product")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <StoreProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
