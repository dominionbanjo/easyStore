import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import {
  getDerivedOptions,
  getProductLink,
  getDiscountPercentage,
} from "./productCardUtils";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { Heart, Star, ShoppingCart, Check, Loader2 } from "lucide-react";
import SmartLink from "./SmartLink";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { addToLocalCart } from "@/features/cartSlice";
import { buildRoute } from "@/routes/index";

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
import { OptimizedImage } from "./OptimizedImage";

/* ───────────────── COMPONENT ───────────────── */

export interface ProductCardProps {
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
  options?: { name: string; values: string[] }[] | null;
  variants?:
    | {
        id: string;
        combinations?: Record<string, string>;
        price: number;
        stock: number;
        discount_price?: number;
        image_url?: string | null;
      }[]
    | null;
  isOnSale?: boolean;
  isFavorite?: boolean;
  showFooter?: boolean;
  className?: string;
  /** Full URL override — used to escape a subdomain context (e.g. zone subdomain → base domain) */
  href?: string;
}

const ProductCardComponent = ({
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
  options = null,
  variants = null,
  isOnSale = false,
  isFavorite = false,
  showFooter = true,
  className,
  href,
}: ProductCardProps) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const previewTemplate = searchParams.get("preview_template");
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [isFavorited, setIsFavorited] = useState<boolean>(isFavorite);

  /* ── API ── */
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addItemToCart, { isLoading: isAddingToCart }] =
    useAddItemToCartMutation();

  /* ── STATE ── */
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    setIsFavorited(isFavorite);
  }, [isFavorite]);

  const derivedOptions = useMemo(() => getDerivedOptions(options, variants), [options, variants]);

  /* ── HANDLERS ── */
  const toggleFavorite = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error("Please login to manage wishlist");
      return;
    }

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
    } catch (err: unknown) {
      setIsFavorited(prev);
      const message =
        typeof err === "object" && err !== null && "data" in err
          ? String(
              (err as { data?: { message?: string } }).data?.message ??
                (err as { message?: string }).message ??
                "Failed to update wishlist"
            )
          : "Failed to update wishlist";
      toast.error(message);
    }
  }, [id, name, image, price, isFavorited, isAuthenticated, addToWishlist, removeFromWishlist]);

  const handleAddToCart = useCallback(async () => {
    // If product has variants, require selection
    const hasNewVariants = derivedOptions.length > 0;
    const hasVariants = hasNewVariants;

    if (hasVariants && !showVariantModal) {
      if (hasNewVariants) {
        const initialSelections: Record<string, string> = {};
        derivedOptions.forEach((opt) => {
          if (opt.values.length === 1)
            initialSelections[opt.name] = opt.values[0];
        });
        setSelectedOptions(initialSelections);
      }
      setShowVariantModal(true);
      return;
    }

    // Validate selection if modal is open
    if (showVariantModal) {
      if (hasNewVariants) {
        const missingOptions = derivedOptions.filter(
          (o) => !selectedOptions[o.name],
        );
        if (missingOptions.length > 0) {
          toast.error(`Please select a ${missingOptions[0].name}`);
          return;
        }
      }
    }

    let variantId = undefined;
    let finalPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
    let finalDiscountPrice = discountPrice
      ? parseFloat(discountPrice.replace(/[^0-9.]/g, ""))
      : null;

    if (hasNewVariants && variants) {
      const matchedVariant = variants.find((v) => {
        if (!v.combinations) return false;
        return Object.entries(selectedOptions).every(
          ([k, val]) => v.combinations![k] === val,
        );
      });
      if (!matchedVariant) {
        toast.error("Selected combination is unavailable");
        return;
      }
      if (matchedVariant.stock <= 0) {
        toast.error("Selected combination is out of stock");
        return;
      }
      variantId = matchedVariant.id;
      if (matchedVariant.price !== undefined && matchedVariant.price !== null) {
        finalPrice = Number(matchedVariant.price);
        finalDiscountPrice = matchedVariant.discount_price
          ? Number(matchedVariant.discount_price)
          : null;
      }
    }

    if (!isAuthenticated) {
      // Local cart logic
      dispatch(
        addToLocalCart({
          product_id: id,
          vendor_id: "local",
          name,
          slug,
          price: finalPrice,
          discount_price: finalDiscountPrice,
          quantity: 1,
          variant_id: variantId,
          variant_options: selectedOptions,
          image,
        }),
      );
      toast.success(`${name} added to cart`);
      setShowVariantModal(false);
      setSelectedOptions({});
      return;
    }

    try {
      await addItemToCart({
        product_id: id,
        quantity: 1,
        variant_id: variantId,
      }).unwrap();

      toast.success(`${name} added to cart`);
      setShowVariantModal(false);
      setSelectedOptions({});
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error
          ? String(
              (error as { data?: { message?: string } }).data?.message ??
                "Failed to add to cart"
            )
          : "Failed to add to cart";
      toast.error(message);
    }
  }, [
    id,
    name,
    slug,
    image,
    price,
    discountPrice,
    variants,
    derivedOptions,
    selectedOptions,
    showVariantModal,
    isAuthenticated,
    dispatch,
    addItemToCart,
  ]);

  /* ── DERIVED UI ── */
  const productLink = useMemo(
    () =>
      href ??
      getProductLink(location.pathname, slug, storeSlug, previewTemplate),
    [location.pathname, storeSlug, slug, previewTemplate, href]
  );

  const isOutOfStock = stock <= 0;

  const discountPercentage = useMemo(
    () => getDiscountPercentage(price, discountPrice),
    [price, discountPrice]
  );

  return (
    <div
      className={cn(
        "group relative w-full bg-white dark:bg-neutral-900 rounded-sm p-1 border border-zinc-100 dark:border-white/5 hover:-translate-y-2 transition-transform duration-300 cursor-pointer overflow-hidden flex flex-col h-full",
        className,
      )}
    >
      <SmartLink
        to={productLink}
        className="absolute inset-0 z-[1]"
        aria-label={`View ${name}`}
      />

      {/* ───────────────── IMAGE SECTION ───────────────── */}
      <div className="relative aspect-square w-full rounded-sm overflow-hidden bg-zinc-50 dark:bg-zinc-800 group-hover: transition-all duration-500">
        {/* 🏷️ Status Badges (Now on Right) */}
        <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-2">
          {isOutOfStock ? (
            <div className="px-3 py-1 bg-zinc-900/90 backdrop-blur-md text-white text-[10px] font-bold rounded-sm uppercase tracking-widest border border-white/10">
              Sold Out
            </div>
          ) : (
            isOnSale &&
            discountPrice &&
            discountPercentage > 0 && (
              <div className="px-3 py-1.5 bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-black rounded-sm flex items-center gap-1 -emerald-500/20 uppercase tracking-tighter border border-white/20 scale-110 origin-top-right">
                {discountPercentage}% OFF
              </div>
            )
          )}
        </div>

        {/* ❤️ Wishlist Trigger (Now on Left) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite();
          }}
          aria-label="Toggle wishlist"
          className="absolute top-3 left-3 z-30 p-2 hover:scale-110 transition-transform active:scale-95 drop-"
        >
          <Heart
            className={cn(
              "w-[22px] h-[22px] transition-colors duration-300",
              isFavorited
                ? "fill-rose-500 stroke-rose-500"
                : "fill-transparent stroke-zinc-600 dark:stroke-zinc-300 hover:stroke-rose-500",
            )}
            strokeWidth={2}
          />
        </button>

        {/* 🖼️ The Actual Image */}
        <OptimizedImage
          src={image}
          alt={name}
          recipe="CARD"
          aspectRatio="1 / 1"
          className="transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
        />
      </div>

      {/* ───────────────── INFO SECTION ───────────────── */}
      <div className="px-1.5 pt-2 flex flex-col flex-1">
        {/* Category & Rating Row */}
        <div className="flex items-center justify-between gap-2 mb-2 min-w-0">
          <span
            title={category}
            className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-sm truncate overflow-hidden min-w-0 max-w-[60%]"
          >
            {category}
          </span>
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 dark:bg-amber-500/10 rounded-sm border border-amber-100/50 dark:border-amber-400/20 shrink-0">
            <Star className="w-2.5 h-2.5 fill-amber-500 stroke-amber-500" />
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
              {Number(rating || 0).toFixed(1)}
            </span>
          </div>
        </div>

        {/* Name */}
        <h3
          title={name}
          className="text-zinc-900 dark:text-zinc-100 font-bold text-xs sm:text-sm leading-tight line-clamp-2 break-words overflow-hidden mb-1 group-hover:text-emerald-600 transition-colors"
        >
          {name}
        </h3>

        {/* Price Section */}
        <div className="mt-auto pt-0 flex items-center justify-between gap-2 min-w-0">
          <div className="flex flex-col min-w-0">
            {isOnSale && discountPrice && (
              <span className="text-[10px] text-zinc-400 line-through decoration-rose-500/30 truncate">
                {price}
              </span>
            )}
            <span className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white tracking-tight truncate">
              {isOnSale && discountPrice ? discountPrice : price}
            </span>
          </div>

          {/* Mini Shopping Cart Action */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={isOutOfStock || isAddingToCart}
            className={cn(
              "p-1.5 rounded-sm transition-all group/btn relative z-10 overflow-hidden shrink-0",
              isOutOfStock
                ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                : "bg-zinc-900 text-white hover:bg-emerald-500 hover:-emerald-500/40 active:scale-95",
            )}
          >
            {isAddingToCart ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShoppingCart className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
            )}
          </button>
        </div>

        {/* Stock Footer */}
        <div className="mt-1.5 flex items-center gap-2">
          <div className="flex-1 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-sm overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-1000",
                isOutOfStock
                  ? "bg-zinc-300 w-0"
                  : stock <= 5 && !isOutOfStock
                    ? "bg-amber-500 w-[20%]"
                    : "bg-emerald-500 w-[75%]",
              )}
            />
          </div>
          <span
            className={cn(
              "text-[10px] font-bold uppercase tracking-tight shrink-0",
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

      {/* ───────────────── FOOTER SECTION ───────────────── */}
      {showFooter && (
        <div className="mt-2 pt-2 px-1 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3 min-w-0">
          <SmartLink
            to={
              storeSlug ? buildRoute.storeDetails(storeSlug) : `/vendor/${vendor}`
            }
            className="flex items-center gap-2.5 truncate relative z-10 group/vendor min-w-0"
          >
            <div className="h-8 w-8 rounded-sm border-2 border-white dark:border-zinc-800 overflow-hidden ring-1 ring-zinc-100 dark:ring-zinc-800">
              <OptimizedImage
                src={
                  avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                }
                alt={vendor}
                recipe="LOGO"
                aspectRatio="1 / 1"
                className="group-hover/vendor:scale-110 transition-transform"
              />
            </div>
            <div className="flex flex-col truncate min-w-0">
              <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider leading-none mb-0.5">
                Seller
              </span>
              <span
                title={vendor}
                className="text-xs font-bold text-zinc-900 dark:text-zinc-200 truncate group-hover/vendor:text-emerald-500 transition-colors"
              >
                {vendor}
              </span>
            </div>
          </SmartLink>
        </div>
      )}

      {/* ─── VARIANT SELECTION DIALOG ─── */}
      <Dialog open={showVariantModal} onOpenChange={setShowVariantModal}>
        <DialogContent
          className="rounded-sm sm:max-w-[440px]"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Select Options</DialogTitle>
            <DialogDescription className="flex items-center gap-3 mt-1">
              <OptimizedImage
                src={image}
                alt=""
                recipe="THUMBNAIL"
                aspectRatio="1 / 1"
                className="w-12 h-12 rounded-sm object-cover border"
              />
              <div className="flex flex-col flex-1">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm leading-tight line-clamp-1">
                  {name}
                </span>
                {(() => {
                  let displayPrice = "";
                  let displayDiscount = "";

                  if (derivedOptions.length > 0 && variants) {
                    const matched = variants.find((v) => {
                      if (!v.combinations) return false;
                      return Object.entries(selectedOptions).every(
                        ([k, val]) => v.combinations![k] === val,
                      );
                    });
                    if (
                      matched &&
                      matched.price !== undefined &&
                      matched.price !== null
                    ) {
                      displayPrice = `₦${Number(matched.price).toLocaleString("en-NG")}`;
                      if (matched.discount_price) {
                        displayDiscount = `₦${Number(matched.discount_price).toLocaleString("en-NG")}`;
                      }
                    }
                  }

                  if (!displayPrice) {
                    displayPrice = price;
                    displayDiscount = discountPrice || "";
                  }

                  return (
                    <div className="flex items-center gap-2 mt-0.5">
                      {displayDiscount && (
                        <span className="text-xs text-zinc-400 line-through decoration-rose-500/30">
                          {displayPrice}
                        </span>
                      )}
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {displayDiscount || displayPrice}
                      </span>
                    </div>
                  );
                })()}
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-5 max-h-[60vh] overflow-y-auto pr-1">
            {/* Options-based variants (Color, Size, etc.) */}
            {derivedOptions.length > 0
              ? derivedOptions.map((opt) => (
                  <div key={opt.name} className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <Label className="text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                        {opt.name}
                      </Label>
                      {selectedOptions[opt.name] && (
                        <span className="text-xs font-bold text-emerald-600">
                          {selectedOptions[opt.name]}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {opt.values.map((val) => {
                        const hasStock =
                          variants?.some((v) => {
                            if (v.combinations?.[opt.name] !== val)
                              return false;
                            return Object.entries(selectedOptions).every(
                              ([k, sel]) =>
                                k === opt.name
                                  ? true
                                  : v.combinations?.[k] === sel,
                            );
                          }) ?? true;

                        const isSelected = selectedOptions[opt.name] === val;
                        return (
                          <button
                            key={val}
                            onClick={() =>
                              hasStock &&
                              setSelectedOptions((prev) => ({
                                ...prev,
                                [opt.name]: val,
                              }))
                            }
                            disabled={!hasStock}
                            className={cn(
                              "px-4 py-2 rounded-sm text-sm font-medium transition-all border relative",
                              isSelected
                                ? "bg-zinc-900 text-white border-zinc-900 scale-105"
                                : hasStock
                                  ? "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700"
                                  : "bg-zinc-50 text-zinc-300 border-zinc-200 cursor-not-allowed opacity-50 line-through dark:bg-zinc-900 dark:text-zinc-600",
                            )}
                          >
                            {val}
                            {isSelected && (
                              <Check className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-emerald-600 text-white rounded-sm p-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              : null}
          </div>

          <DialogFooter>
            <Button
              className="w-full rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12"
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
    </div>
  );
};

const ProductCard = React.memo(ProductCardComponent);

export { ProductCard };
export default ProductCard;
