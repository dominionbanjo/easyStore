import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SmartLink from "@/components/shared/SmartLink";
import type { RootState } from "@/store";
import { motion, AnimatePresence } from "framer-motion";
import { buildRoute } from "@/routes/index";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Heart,
  ShoppingCart,
  Store,
  Minus,
  Plus,
  Check,
  ShieldCheck,
  Truck,
  PackageCheck,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useAddItemToCartMutation } from "@/services/cartApi";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/services/wishlistApi";
import { addToLocalCart } from "@/features/cartSlice";

interface ProductInfoSidebarProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number | null;
    description: string;
    category: string;
    vendor: string;
    storeSlug: string;
    rating: number;
    stock: number;
    highlights: string[];
    sizes?: string[];
    variants?: {
      size: string;
      price: number;
      stock: number;
      discount_price?: number;
    }[];
    colors?: {
      id: string;
      name: string;
      hex: string;
    }[];
    image?: string | null;
    is_in_wishlist?: boolean;
  };
}

export default function ProductInfoSidebar({
  product,
}: ProductInfoSidebarProps) {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState<boolean>(Boolean(product.is_in_wishlist));
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<{
    id: string;
    name: string;
    hex: string;
  } | null>(null);

  const [addToCart, { isLoading: addingToCart }] = useAddItemToCartMutation();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const handleAddToCart = async () => {
    if (product.sizes?.length && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (product.colors?.length && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    // Check stock for variant
    if (activeVariant && quantity > activeVariant.stock) {
      toast.error(
        `Only ${activeVariant.stock} items left in stock for this size`,
      );
      return;
    }

    // Check main stock if no variant?
    if (!activeVariant && quantity > product.stock) {
      toast.error(`Only ${product.stock} items left in stock`);
      return;
    }

    // Check main stock if no variant?
    if (!activeVariant && quantity > product.stock) {
      toast.error(`Only ${product.stock} items left in stock`);
      return;
    }

    if (!isAuthenticated) {
      dispatch(
        addToLocalCart({
          product_id: product.id,
          vendor_id: "local",
          name: product.name,
          slug: product.name.toLowerCase().replace(/\s+/g, "-"),
          price: activeVariant ? activeVariant.price : product.price,
          discount_price: activeVariant
            ? activeVariant.discount_price
            : product.originalPrice
              ? product.price
              : null,
          quantity,
          size: selectedSize,
          color: selectedColor?.name,
          color_hex: selectedColor?.hex,
          image: product.image,
        }),
      );
      toast.success(`${product.name} added to cart`);
      return;
    }

    try {
      await addToCart({
        product_id: product.id,
        quantity,
        size: selectedSize,
        color: selectedColor?.id,
      }).unwrap();

      toast.success(`${product.name} added to cart`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add product to cart");
    }
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to manage wishlist");
      return;
    }

    const prev = liked;
    setLiked(!prev);

    try {
      if (prev) {
        await removeFromWishlist({ productId: product.id }).unwrap();
      } else {
        await addToWishlist({
          product_id: product.id,
          name: product.name,
          price: product.price,
          image: product.image ?? null,
        }).unwrap();
      }
    } catch (err: any) {
      setLiked(prev);
      toast.error(
        err?.data?.message || err?.message || "Wishlist action failed",
      );
    }
  };

  const getActiveVariant = () => {
    if (!product.variants?.length || !selectedSize) return null;
    return product.variants.find((v) => v.size === selectedSize);
  };

  const activeVariant = getActiveVariant();

  const displayPrice = activeVariant
    ? activeVariant.discount_price || activeVariant.price
    : product.price;

  const displayOriginalPrice = activeVariant?.discount_price
    ? activeVariant.price
    : product.originalPrice;

  const currentStock = activeVariant ? activeVariant.stock : product.stock;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-8 w-full max-w-[550px]"
    >
      {/* ─── Product Header ─── */}
      <div className="space-y-4 px-1">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0">
              {product.category}
            </Badge>
            <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-950/30 px-2.5 py-1 rounded-full border border-yellow-200 dark:border-yellow-900/50 shrink-0">
              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
              <span className="text-sm font-black text-yellow-700 dark:text-yellow-400">
                {product.rating.toFixed(1)}
              </span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground leading-[1.1]">
            {product.name}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-primary">
              ₦{Number(displayPrice).toLocaleString()}
            </span>
            {displayOriginalPrice && (
              <span className="text-xl font-medium text-muted-foreground line-through decoration-rose-500/30">
                ₦{Number(displayOriginalPrice).toLocaleString()}
              </span>
            )}
          </div>
          {currentStock > 0 ? (
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/50">
              <PackageCheck className="w-4 h-4" />
              In Stock {activeVariant && `(${currentStock})`}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold text-sm bg-rose-50 dark:bg-rose-950/30 px-3 py-1 rounded-full border border-rose-100 dark:border-rose-900/50">
              Out of Stock
            </div>
          )}
        </div>
      </div>

      {/* ─── Description ─── */}
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {product.description}
        </p>
        {product.highlights?.length > 0 && (
          <div className="grid grid-cols-1 gap-2">
            {product.highlights.slice(0, 3).map((h, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs font-medium text-foreground/80"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                {h}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-px bg-border/50 dark:bg-white/10" />

      {/* ─── Varients Section ─── */}
      <div className="space-y-6">
        {/* Colors */}
        {product.colors?.length ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold uppercase tracking-widest text-muted-foreground/80 text-[10px]">
                Color:{" "}
                <span className="text-foreground">
                  {selectedColor?.name || "Select Color"}
                </span>
              </span>
            </div>
            <div className="flex gap-3 flex-wrap">
              {product.colors.map((color) => {
                const isSelected = selectedColor?.id === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "group relative w-10 h-10 rounded-full flex items-center justify-center p-0.5 transition-all duration-300",
                      isSelected
                        ? "ring-2 ring-primary ring-offset-2"
                        : "ring-1 ring-border ring-offset-0 hover:ring-2 hover:ring-primary/40 hover:ring-offset-1",
                    )}
                  >
                    <div
                      className="w-full h-full rounded-full border border-black/5"
                      style={{ backgroundColor: color.hex }}
                    />
                    {isSelected && (
                      <motion.div
                        layoutId="colorCheck"
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Check
                          className={cn(
                            "h-4 w-4",
                            color.hex.toLowerCase() === "#ffffff" ||
                              color.hex.toLowerCase() === "white"
                              ? "text-black"
                              : "text-white",
                          )}
                          strokeWidth={4}
                        />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Sizes */}
        {product.sizes?.length ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold uppercase tracking-widest text-muted-foreground/80 text-[10px]">
                Size:{" "}
                <span className="text-foreground">
                  {selectedSize || "Select Size"}
                </span>
              </span>
              <button className="text-[10px] font-bold text-primary underline underline-offset-4 uppercase tracking-wider">
                Size Guide
              </button>
            </div>
            <div className="flex gap-2.5 flex-wrap">
              {product.sizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "min-w-[50px] h-11 px-4 rounded-xl text-sm font-bold transition-all duration-200 border-2",
                      isSelected
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                        : "bg-background text-foreground border-border hover:border-primary/50",
                    )}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      {/* ─── Purchase Section ─── */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Quantity Selector */}
          <div className="bg-muted/50 dark:bg-neutral-800 rounded-2xl flex items-center justify-between p-1 border border-border/40 dark:border-white/10 h-14 sm:w-fit">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl h-12 w-12 hover:bg-background dark:hover:bg-neutral-700 shadow-xs text-muted-foreground"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-bold text-lg w-12 text-center text-foreground">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl h-12 w-12 hover:bg-background dark:hover:bg-neutral-700 shadow-xs text-muted-foreground"
              onClick={() => setQuantity((q) => q + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-1 gap-3">
            <Button
              size="lg"
              disabled={currentStock <= 0 || addingToCart}
              onClick={handleAddToCart}
              className="flex-1 rounded-[1.25rem] bg-emerald-600 text-white hover:bg-emerald-700 h-14 text-base font-black shadow-xl shadow-emerald-200/20 group relative overflow-hidden active:scale-95 transition-all"
            >
              <AnimatePresence mode="wait">
                {addingToCart ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Adding...
                  </motion.div>
                ) : (
                  <motion.div
                    key="normal"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>

            <Button
              size="icon"
              variant="outline"
              onClick={toggleWishlist}
              title={liked ? "Remove from Favorites" : "Add to Favorites"}
              className={cn(
                "h-14 w-14 shrink-0 rounded-[1.25rem] border-2 transition-all active:scale-90",
                liked
                  ? "bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/50 text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/50 shadow-lg shadow-rose-200/20 dark:shadow-rose-900/20"
                  : "hover:border-primary/50 text-muted-foreground",
              )}
            >
              <Heart
                className={cn(
                  "h-6 w-6 transition-transform duration-300",
                  liked && "fill-current scale-110",
                )}
              />
            </Button>
          </div>
        </div>

        {/* ─── Trust Factors ─── */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/40">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Sold by
              </p>
              <SmartLink
                to={buildRoute.storeDetails(product.storeSlug)}
                className="text-sm font-black text-foreground truncate max-w-[120px] hover:text-primary transition-colors cursor-pointer block"
              >
                {product.vendor}
              </SmartLink>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Security
              </p>
              <p className="text-sm font-black text-foreground">
                Verified Merchant
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-muted/30 dark:bg-neutral-800/50 border border-border/40 dark:border-white/10">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <Truck className="w-4 h-4 text-primary" />
            Standard Shipping Available
          </div>
          <div className="h-4 w-px bg-border/60" />
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Buyer Protection
          </div>
        </div>
      </div>
    </motion.div>
  );
}
