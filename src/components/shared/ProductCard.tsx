import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
  Heart,
  Star,
  ShoppingCart,
  Eye,
  Package,
  Check,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/services/wishlistApi";
import { useAddItemToCartMutation } from "@/services/cartApi";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

/* ───────────────── CONTEXT ───────────────── */

interface ProductCardContextType {
  id: string;
  slug: string;
  image: string;
  name: string;
  price: string;
  discountPrice?: string;
  category: string;
  rating: number;
  stock: number;
  vendor?: string;
  storeSlug?: string;
  avatar?: string;
  colors?: { id: string; name: string; hex: string }[];
  sizes?: string[];
  isOnSale?: boolean;

  isFavorited: boolean;
  toggleFavorite: () => void;
  addToCart: () => void;
  isAddingToCart: boolean;
}

interface ProductCardRootProps {
  id: string;
  slug: string;
  image: string;
  name: string;
  price: string;
  discountPrice?: string;
  category?: string;
  rating?: number;
  stock?: number;
  vendor?: string;
  storeSlug?: string;
  avatar?: string;
  colors?: { id: string; name: string; hex: string }[];
  sizes?: string[];
  isOnSale?: boolean;

  /** 🔹 backend-driven */
  isFavorite?: boolean;

  children: ReactNode;
  className?: string;
}

const ProductCardContext = createContext<ProductCardContextType | null>(null);

const useProductCard = () => {
  const ctx = useContext(ProductCardContext);
  if (!ctx)
    throw new Error(
      "ProductCard components must be used inside <ProductCard.Root>",
    );
  return ctx;
};

/* ───────────────── ROOT ───────────────── */

const Root = ({
  id,
  slug,
  image,
  name,
  price,
  discountPrice,
  category = "Category",
  rating = 0,
  stock = 0,
  vendor = "Seller",
  storeSlug,
  avatar,
  colors = [],
  sizes = [],
  isOnSale = false,
  isFavorite = false,
  children,
  className,
}: ProductCardRootProps) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const [isFavorited, setIsFavorited] = useState<boolean>(isFavorite);
  const navigate = useNavigate();

  /* ── API ── */
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addItemToCart, { isLoading: isAddingToCart }] =
    useAddItemToCartMutation();

  /* ── STATE ── */
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  /* ── HANDLERS ── */
  const toggleFavorite = async () => {
    const prev = isFavorited;
    setIsFavorited(!prev);

    try {
      if (!prev) {
        await addToWishlist({
          product_id: id,
          name,
          image,
          price: Number(price.replace(/[^\d]/g, "")),
        }).unwrap();
        toast.success("Added to wishlist ✨");
      } else {
        await removeFromWishlist({ productId: id }).unwrap();
        toast.info("Removed from wishlist");
      }
    } catch (err: any) {
      setIsFavorited(prev);
      toast.error(
        err?.data?.message || err?.message || "Failed to update wishlist",
      );
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    // If product has variants, require selection
    const hasVariants =
      (colors && colors.length > 0) || (sizes && sizes.length > 0);

    if (hasVariants && !showVariantModal) {
      // Initialize defaults if only 1 option available
      if (sizes?.length === 1) setSelectedSize(sizes[0]);
      if (colors?.length === 1) setSelectedColor(colors[0].id);

      setShowVariantModal(true);
      return;
    }

    // Validate selection if modal is open
    if (showVariantModal) {
      if (sizes?.length && !selectedSize) {
        toast.error("Please select a size");
        return;
      }
      if (colors?.length && !selectedColor) {
        toast.error("Please select a color");
        return;
      }
    }

    try {
      await addItemToCart({
        product_id: id,
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
      }).unwrap();

      toast.success("Added to cart! 🛒");
      setShowVariantModal(false);
      setSelectedSize(null);
      setSelectedColor(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add to cart");
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${encodeURIComponent(slug)}`);
  };

  const value = useMemo(
    () => ({
      id,
      slug,
      image,
      name,
      price,
      discountPrice,
      category,
      rating,
      stock,
      vendor,
      storeSlug,
      avatar,
      colors,
      sizes,
      isOnSale,
      isFavorited,
      toggleFavorite,
      addToCart: handleAddToCart,
      isAddingToCart,
    }),
    [
      id,
      slug,
      image,
      name,
      price,
      discountPrice,
      category,
      rating,
      stock,
      vendor,
      avatar,
      isFavorited,
      colors,
      sizes,
      isOnSale,
      isAddingToCart,
      selectedSize,
      selectedColor,
      showVariantModal,
    ],
  );

  return (
    <ProductCardContext.Provider value={value}>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -8 }}
        onClick={handleCardClick}
        className={cn(
          "group relative w-full bg-white dark:bg-neutral-900 rounded-3xl p-1 shadow-sm border border-zinc-100 dark:border-white/5 transition-all hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer overflow-hidden flex flex-col h-full",
          className,
        )}
      >
        {children}

        {/* ─── VARIANT SELECTION DIALOG ─── */}
        <Dialog open={showVariantModal} onOpenChange={setShowVariantModal}>
          <DialogContent
            className="rounded-3xl sm:max-w-[400px]"
            onClick={(e) => e.stopPropagation()}
          >
            <DialogHeader>
              <DialogTitle>Select Options</DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <img
                  src={image}
                  className="w-10 h-10 rounded-md object-cover border"
                />
                <span className="font-medium text-zinc-900">{name}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-6">
              {/* Sizes */}
              {sizes && sizes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-zinc-500 font-medium">Size</Label>
                    {selectedSize && (
                      <span className="text-xs font-bold text-emerald-600">
                        {selectedSize}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                          selectedSize === s
                            ? "bg-zinc-900 text-white border-zinc-900 shadow-md scale-105"
                            : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400",
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {colors && colors.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-zinc-500 font-medium">Color</Label>
                    {selectedColor && (
                      <span className="text-xs font-bold text-zinc-900">
                        {colors.find((c) => c.id === selectedColor)?.name}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedColor(c.id)}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 transition-all relative flex items-center justify-center shadow-sm",
                          selectedColor === c.id
                            ? "border-emerald-500 ring-2 ring-emerald-500/20 scale-110"
                            : "border-transparent hover:scale-110 hover:shadow-md",
                        )}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {selectedColor === c.id && (
                          <Check className="w-4 h-4 text-white drop-shadow-md" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...
                  </>
                ) : (
                  "Add to Cart"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </ProductCardContext.Provider>
  );
};

/* ───────────────── IMAGE ───────────────── */

const Image = () => {
  const {
    image,
    isFavorited,
    toggleFavorite,
    name,
    discountPrice,
    stock,
    price,
    isOnSale,
  } = useProductCard();
  const isOutOfStock = stock <= 0;

  // 📝 Calculate percentage discount
  const calculateDiscount = () => {
    if (!price || !discountPrice) return 0;
    const p = parseFloat(price.replace(/[^0-9.]/g, ""));
    const d = parseFloat(discountPrice.replace(/[^0-9.]/g, ""));
    if (isNaN(p) || isNaN(d) || p === 0) return 0;
    return Math.round(((p - d) / p) * 100);
  };

  const discountPercentage = calculateDiscount();

  return (
    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-800 group-hover:shadow-inner transition-all duration-500">
      {/* 🏷️ Status Badges (Now on Right) */}
      <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-2">
        {isOutOfStock ? (
          <div className="px-3 py-1 bg-zinc-900/90 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg border border-white/10">
            Sold Out
          </div>
        ) : (
          isOnSale &&
          discountPrice &&
          discountPercentage > 0 && (
            <div className="px-3 py-1.5 bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-black rounded-xl flex items-center gap-1 shadow-xl shadow-emerald-500/20 uppercase tracking-tighter border border-white/20 scale-110 origin-top-right">
              {discountPercentage}% OFF
            </div>
          )
        )}
      </div>

      {/* ❤️ Wishlist Trigger (Now on Left) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite();
        }}
        aria-label="Toggle wishlist"
        className="absolute top-3 left-3 z-10 rounded-full bg-white/90 p-2 shadow-sm hover:scale-110 transition active:scale-95 backdrop-blur-sm border border-zinc-200/50"
      >
        <Heart
          className={cn(
            "w-4 h-4 transition-colors",
            isFavorited
              ? "fill-rose-500 stroke-rose-500"
              : "stroke-zinc-600 hover:stroke-rose-500",
          )}
        />
      </button>

      {/* 🖼️ The Actual Image */}
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
        loading="lazy"
      />

      {/* 👁️ Quick Action Overlay */}
      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none sm:pointer-events-auto">
        <div className="flex gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] items-center">
          <div className="p-3 bg-white/95 text-zinc-900 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2 font-medium text-xs hover:bg-emerald-500 hover:text-white transition-colors">
            <Eye className="w-4 h-4" />
            <span>Quick View</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ───────────────── INFO ───────────────── */

const Info = () => {
  const {
    name,
    price,
    discountPrice,
    category,
    rating,
    stock,
    addToCart,
    isAddingToCart,
    isOnSale,
  } = useProductCard();
  const isOutOfStock = stock <= 0;

  return (
    <div className="px-1.5 pt-2 flex flex-col flex-1">
      {/* Category & Rating Row */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">
          {category}
        </span>
        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 dark:bg-amber-500/10 rounded-md border border-amber-100/50 dark:border-amber-400/20">
          <Star className="w-2.5 h-2.5 fill-amber-500 stroke-amber-500" />
          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
            {Number(rating || 0).toFixed(1)}
          </span>
        </div>
      </div>

      {/* Name */}
      <h3 className="text-zinc-900 dark:text-zinc-100 font-bold text-sm sm:text-base leading-tight line-clamp-2 mb-1 group-hover:text-emerald-600 transition-colors">
        {name}
      </h3>

      {/* Price Section */}
      <div className="mt-auto pt-0 flex items-center justify-between">
        <div className="flex flex-col">
          {isOnSale && discountPrice && (
            <span className="text-[10px] text-zinc-400 line-through decoration-rose-500/30">
              {price}
            </span>
          )}
          <span className="text-lg font-extrabold text-zinc-900 dark:text-white tracking-tight">
            {isOnSale && discountPrice ? discountPrice : price}
          </span>
        </div>

        {/* Mini Shopping Cart Action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart();
          }}
          disabled={isOutOfStock || isAddingToCart}
          className={cn(
            "p-2 rounded-2xl transition-all shadow-md group/btn relative overflow-hidden",
            isOutOfStock
              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
              : "bg-zinc-900 text-white hover:bg-emerald-500 hover:shadow-emerald-500/40 active:scale-95",
          )}
        >
          {isAddingToCart ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ShoppingCart className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
          )}
        </button>
      </div>

      {/* Stock Footer */}
      <div className="mt-1.5 flex items-center gap-2">
        <div className="flex-1 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-1000",
              isOutOfStock ? "bg-zinc-300 w-0" : "bg-emerald-500",
              stock <= 5 && !isOutOfStock ? "bg-amber-500 w-[20%]" : "w-[75%]",
            )}
          />
        </div>
        <span
          className={cn(
            "text-[10px] font-bold uppercase tracking-tight",
            isOutOfStock
              ? "text-zinc-400"
              : stock <= 5
                ? "text-amber-600"
                : "text-zinc-500",
          )}
        >
          {isOutOfStock
            ? "Out of Stock"
            : stock <= 5
              ? `${stock} Left!`
              : "In Stock"}
        </span>
      </div>
    </div>
  );
};

/* ───────────────── FOOTER ───────────────── */

const Footer = () => {
  const { vendor, avatar, storeSlug } = useProductCard();

  return (
    <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
      <Link
        to={storeSlug ? `/stores/${storeSlug}` : `/vendor/${vendor}`}
        className="flex items-center gap-2.5 truncate relative z-10 group/vendor"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-8 w-8 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm overflow-hidden ring-1 ring-zinc-100 dark:ring-zinc-800">
          <img
            src={
              avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            }
            alt={vendor}
            className="h-full w-full object-cover group-hover/vendor:scale-110 transition-transform"
          />
        </div>
        <div className="flex flex-col truncate">
          <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider leading-none mb-0.5">
            Seller
          </span>
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-200 truncate group-hover/vendor:text-emerald-500 transition-colors">
            {vendor}
          </span>
        </div>
      </Link>

      <div className="px-2 py-1 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex items-center gap-1.5 border border-zinc-100 dark:border-zinc-700/50">
        <Package className="w-3 h-3 text-zinc-400" />
        <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
          Brand
        </span>
      </div>
    </div>
  );
};

/* ───────────────── ACTIONS ───────────────── */

const Actions = () => {
  return null;
};

/* ───────────────── EXPORT ───────────────── */

export const ProductCard = {
  Root,
  Image,
  Info,
  Footer,
  Actions,
};

export default ProductCard;
