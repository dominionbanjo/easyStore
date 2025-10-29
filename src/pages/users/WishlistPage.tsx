"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Search, Filter, Trash2, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ProductCard from "@/components/shared/ProductCard";

import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
} from "@/services/wishlistApi";

export default function WishlistPage() {
  // ✅ Query & Mutations
  const { data, isLoading, isError } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [clearWishlist] = useClearWishlistMutation();

  // ✅ Normalize wishlist into array (since backend returns single item)
  const wishlist = data?.wishlist ? [data.wishlist] : [];

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // ✅ Computed filtered results
  const filteredWishlist = useMemo(() => {
    let result = wishlist;

    if (searchTerm.trim() !== "") {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== "All") {
      result = result.filter(
        (item: any) => (item.product_type ?? "Wishlist") === filterCategory
      );
    }

    return result;
  }, [wishlist, searchTerm, filterCategory]);

  // ✅ Unique filter categories
  const categories = [
    "All",
    ...new Set(wishlist.map((w: any) => w.product_type ?? "Wishlist")),
  ];

  // ✅ Handlers
  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlist(productId).unwrap();
    } catch (err) {
      console.error("❌ Failed to remove from wishlist:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearWishlist().unwrap();
    } catch (err) {
      console.error("❌ Failed to clear wishlist:", err);
    }
  };

  // ✅ Loading / Error UI
  if (isLoading) {
    return (
      <section className="h-screen flex justify-center items-center text-gray-500">
        Loading wishlist...
      </section>
    );
  }

  if (isError) {
    return (
      <section className="h-screen flex justify-center items-center text-red-500">
        Failed to load wishlist.
      </section>
    );
  }

  // ✅ Main UI
  return (
    <section className="min-h-screen bg-neutral-50 py-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* 🧭 Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Heart className="h-7 w-7 text-primary" />
              My Wishlist
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved
            </p>
          </div>

          {wishlist.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="text-red-500 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        <Separator />

        {/* 🔍 Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search wishlist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-gray-500" />
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={filterCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory(cat)}
                className={
                  filterCategory === cat ? "bg-primary text-white" : ""
                }
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* ❤️ Wishlist Items */}
        {filteredWishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Heart className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-lg font-semibold text-gray-700">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Start exploring our collection and save your favorite items.
            </p>
            <Button className="rounded-full bg-primary text-white px-6 py-2">
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredWishlist.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={`₦${Number(product.price).toLocaleString()}`}
                    image={product.image || ""}
                    category={product.product_type ?? "Wishlist"}
                    rating={4.5}
                  />

                  {/* Remove button */}
                  <div className="flex justify-end mt-2">
                    <Button
                      onClick={() => handleRemove(product.product_id)}
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* 🛍️ Summary Card */}
        {wishlist.length > 0 && (
          <Card className="p-6 flex flex-col sm:flex-row items-center justify-between mt-10 shadow-sm border rounded-2xl bg-white">
            <div className="text-gray-700 text-center sm:text-left">
              <p className="text-sm">
                You have <strong>{wishlist.length}</strong> item
                {wishlist.length !== 1 ? "s" : ""} in your wishlist.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Add it to your cart before it’s gone!
              </p>
            </div>

            <Button className="mt-4 sm:mt-0 bg-primary text-white rounded-full px-6 hover:bg-primary/90">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Move to Cart
            </Button>
          </Card>
        )}
      </div>
    </section>
  );
}
