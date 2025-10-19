// import ProductCard from "@/components/cards/ProductCard";
import ProductCard from "@/components/shared/ProductCard";
import { useState } from "react";
import HomepageLayout from "@/components/layout/homepage/HomePageLayout";
import { Input } from "@/components/ui/input";

export default function Shop() {
  const [query, setQuery] = useState("");

  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: "$59",
      image:
        "https://images.unsplash.com/photo-1585386959984-a41552231693?w=800",
      category: "Electronics",
      rating: 4.2,
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
      name: "Wrist Watch",
      price: "$80",
      image:
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800",
      category: "Accessories",
      rating: 4.5,
    },
  ];

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <HomepageLayout>
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-3xl font-bold">Shop All Products</h1>
          <Input
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-sm rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
      </main>
    </HomepageLayout>
  );
}
