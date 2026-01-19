import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Search, ShoppingCart } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useGetMyWishlistQuery } from "@/services/wishlistApi";
import { ProductCard } from "@/components/shared/ProductCard";

export default function WishlistPage() {
  /* ───────────────── API ───────────────── */

  const { data, isLoading, isError } = useGetMyWishlistQuery();

  const wishlist = data?.data.wishlist ?? [];

  /* ───────────────── UI STATE ───────────────── */

  const [searchTerm, setSearchTerm] = useState("");

  /* ───────────────── FILTERING ───────────────── */

  const filteredWishlist = useMemo(() => {
    if (!searchTerm.trim()) return wishlist;

    return wishlist.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [wishlist, searchTerm]);

  /* ───────────────── LOADING / ERROR ───────────────── */
  if (isLoading) {
    return <WishlistSkeleton />;
  }

  if (isError) {
    return (
      <section className="h-screen flex items-center justify-center text-red-500">
        Failed to load wishlist.
      </section>
    );
  }

  /* ───────────────── RENDER ───────────────── */

  return (
    <section className="min-h-screen bg-neutral-50 py-2 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* ─── Header ─── */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Heart className="h-7 w-7 text-primary" />
              My Wishlist
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved
            </p>
          </div>
        </div>

        <Separator />

        {/* ─── Search ─── */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search wishlist…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 rounded-full"
            />
          </div>
        </div>

        {/* ─── Wishlist Items ─── */}
        {filteredWishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Heart className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-lg font-semibold text-gray-700">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Start exploring and save products you love.
            </p>
            <Button className="rounded-full bg-primary text-white px-6">
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredWishlist.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ProductCard.Root
                    id={item.product_id}
                    name={item.name}
                    price={`₦${Number(item.price).toLocaleString("en-NG")}`}
                    image={item.image || ""}
                    category="Wishlist"
                    rating={0}
                    stock={1}
                    isFavorite={true}
                  >
                    <ProductCard.Image />
                    <ProductCard.Info />
                    {/* <ProductCard.Footer /> */}
                  </ProductCard.Root>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ─── Summary ─── */}
        {wishlist.length > 0 && (
          <Card className="p-6 flex flex-col sm:flex-row justify-between items-center mt-10 rounded-2xl">
            <div className="text-sm text-gray-700">
              You have <strong>{wishlist.length}</strong> item
              {wishlist.length !== 1 ? "s" : ""} in your wishlist.
            </div>

            <Button className="mt-4 sm:mt-0 bg-primary text-white rounded-full px-6">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Move to Cart
            </Button>
          </Card>
        )}
      </div>
    </section>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

function WishlistSkeleton() {
  return (
    <section className="min-h-screen bg-neutral-50 py-2 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Search */}
        <Skeleton className="h-10 w-full sm:w-80 rounded-full" />

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>

        {/* Footer card */}
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    </section>
  );
}
