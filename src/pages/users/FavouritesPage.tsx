"use client";

import HomepageLayout from "@/components/layout/homepage/HomePageLayout";
import { useState } from "react";
import ProductCard from "@/components/shared/ProductCard";
import { Heart } from "lucide-react";

export default function FavouritesPage() {
  const [favourites] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      price: "$99.99",
      image:
        "https://images.unsplash.com/photo-1585386959984-a41552231693?w=800",
      category: "Electronics",
      rating: 4.7,
    },
    {
      id: 2,
      name: "Leather Handbag",
      price: "$120",
      image:
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=800",
      category: "Fashion",
      rating: 4.8,
    },
    {
      id: 3,
      name: "Smart Watch",
      price: "$149.99",
      image:
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800",
      category: "Accessories",
      rating: 4.5,
    },
  ]);

  return (
    <HomepageLayout>
      <main className="min-h-screen bg-emerald-50 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-10">
            <Heart className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-3xl font-bold text-center">Your Favourites</h1>
          </div>

          {favourites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {favourites.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground mt-20">
              <p className="text-lg">You haven’t liked any products yet.</p>
            </div>
          )}
        </div>
      </main>
    </HomepageLayout>
  );
}
