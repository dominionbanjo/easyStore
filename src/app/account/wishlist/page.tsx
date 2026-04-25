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
import { WishlistSkeleton } from "@/modules/website/components/skeletons/WishlistSkeleton";
import SmartLink from "@/components/shared/SmartLink";
import { WEBSITE_ROUTES } from "@/routes/index";

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
    <section className="min-h-screen py-2 px-4 sm:px-8 mt-[10px] bg-white dark:bg-neutral-950 transition-colors duration-300">
      <div className="w-full mx-auto space-y-6">
        {/* ─── Header ─── */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Heart className="h-7 w-7 text-primary" />
              My Wishlist
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
              {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved
            </p>
          </div>
        </div>

        <Separator className="bg-zinc-100 dark:bg-white/5" />

        {/* ─── Search ─── */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 h-4 w-4" />
            <Input
              placeholder="Search wishlist…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 rounded-sm bg-zinc-50 dark:bg-neutral-900 border-zinc-200 dark:border-white/10"
            />
          </div>
        </div>

        {/* ─── Wishlist Items ─── */}
        {filteredWishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Heart className="h-16 w-16 text-zinc-200 dark:text-neutral-800 mb-4" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Your wishlist is empty
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6 text-center">
              Start exploring and save products you love.
            </p>
            <Button asChild className="rounded-sm bg-primary text-white px-6">
              <SmartLink to={WEBSITE_ROUTES.DISCOVERY}>
                Discover Products
              </SmartLink>
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
                    options={item.product?.options}
                    variants={item.product?.variants?.map((v) => ({
                      ...v,
                      image_url: v.image_url ?? undefined,
                    }))}
                  >
                    <ProductCard.Image />
                    <ProductCard.Info />
                    <ProductCard.Footer />
                  </ProductCard.Root>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ─── Summary ─── */}
        {wishlist.length > 0 && (
          <Card className="p-6 flex flex-col sm:flex-row justify-between items-center mt-10 rounded-sm bg-zinc-50 dark:bg-neutral-900 border-zinc-100 dark:border-white/5">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              You have <strong>{wishlist.length}</strong> item
              {wishlist.length !== 1 ? "s" : ""} in your wishlist.
            </div>

            <Button
              onClick={handleMoveAllToCart}
              disabled={isMoving}
              className="mt-4 sm:mt-0 bg-primary text-white rounded-sm px-6 min-w-[160px]"
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
