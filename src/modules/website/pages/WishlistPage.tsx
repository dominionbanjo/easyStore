import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Search, ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  useGetMyWishlistQuery,
  useMoveAllToCartMutation,
} from "@/services/wishlistApi";
import { ProductCard } from "@/components/shared/ProductCard";
import { WishlistSkeleton } from "../components/skeletons/WishlistSkeleton";

export default function WishlistPage() {
  /* ───────────────── mutations ───────────────── */
  const [moveAllToCart, { isLoading: isMoving }] = useMoveAllToCartMutation();

  /* ───────────────── API ───────────────── */

  const { data, isLoading, isError } = useGetMyWishlistQuery();

  const wishlist = data?.data.wishlist ?? [];

  /* ───────────────── UI STATE ───────────────── */

  const [searchTerm, setSearchTerm] = useState("");

  /* ───────────────── ACTIONS ───────────────── */

  const handleMoveAllToCart = async () => {
    try {
      await moveAllToCart().unwrap();
      toast.success("All items moved to cart successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to move items to cart.");
    }
  };

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
    <section className="min-h-screen py-2 px-4 sm:px-8 mt-[40px] bg-white dark:bg-neutral-950 transition-colors duration-300">
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
                    slug={item.product_id}
                    name={item.name}
                    price={`₦${Number(item.product?.price || item.price).toLocaleString("en-NG")}`}
                    discountPrice={
                      item.product?.on_sale && item.product?.discount_price
                        ? `₦${Number(item.product.discount_price).toLocaleString("en-NG")}`
                        : undefined
                    }
                    image={item.image || ""}
                    category="Wishlist"
                    rating={item.product?.rating_average ?? 0}
                    stock={item.product?.stock ?? 0}
                    isOnSale={item.product?.on_sale}
                    isFavorite={true}
                    colors={item.product?.colors}
                    sizes={item.product?.sizes}
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

            <Button
              onClick={handleMoveAllToCart}
              disabled={isMoving}
              className="mt-4 sm:mt-0 bg-primary text-white rounded-full px-6 min-w-[160px]"
            >
              {isMoving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ShoppingCart className="h-4 w-4 mr-2" />
              )}
              {isMoving ? "Moving..." : "Move to Cart"}
            </Button>
          </Card>
        )}
      </div>
    </section>
  );
}
