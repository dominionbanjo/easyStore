import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SmartLink from "@/components/shared/SmartLink";
import type { RootState } from "@/store";
import { buildRoute } from "@/routes/index";
import {
  getBaseDomain,
  getSubdomain,
  areSubdomainsDisabled,
} from "@/utils/subdomain";
import { useStartConversationMutation, useSendDirectMessageMutation } from "@/services/messagingApi";

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
  MessageSquare,
  Loader2,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { extractErrorMessage } from "@/utils/errorHandler";
import { ProductShareButton } from "./ProductShareButton";

import { useAddItemToCartMutation } from "@/services/cartApi";
import { useGetInstallmentConfigQuery } from "@/services/installmentsApi";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/services/wishlistApi";
import { addToLocalCart } from "@/features/cartSlice";

/* ── Types ── */

interface ProductVariant {
  id: string;
  combinations?: Record<string, string>;
  price: number;
  stock: number;
  discount_price?: number;
  image_url?: string;
  size?: string;
}

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
    /* New variant options system */
    options?: { name: string; values: string[] }[] | null;
    variants?: ProductVariant[] | null;
    image?: string | null;
    is_in_wishlist?: boolean;
    slug: string;
    vendor_id?: string;
    installment_enabled?: boolean;
    installment_presets?: string[];
  };
}

export default function ProductInfoSidebar({
  product,
}: ProductInfoSidebarProps) {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState<boolean>(Boolean(product.is_in_wishlist));

  /* New option selection state – e.g. { Color: "Red", Size: "L" } */
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  const [addToCart, { isLoading: addingToCart }] = useAddItemToCartMutation();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [startConversation] = useStartConversationMutation();
  const [sendDirect] = useSendDirectMessageMutation();
  const [isContactingVendor, setIsContactingVendor] = useState(false);

  const { data: installmentConfig } = useGetInstallmentConfigQuery();

  const installmentPlanNames = useMemo(() => {
    if (!product.installment_enabled) return [];
    const offered = product.installment_presets ?? [];
    if (offered.length === 0) return [];
    const all = installmentConfig?.presets ?? [];
    return offered
      .map((id) => all.find((p) => p.id === id))
      .filter((p): p is (typeof all)[number] => Boolean(p))
      .map((p) => p.name);
  }, [product.installment_enabled, product.installment_presets, installmentConfig]);

  const handleMessageVendor = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to message the vendor");
      return;
    }

    if (!product.vendor_id) {
      toast.error("Vendor information is missing for this product");
      return;
    }

    setIsContactingVendor(true);
    try {
      const convResponse = await startConversation({ recipient_id: product.vendor_id }).unwrap();
      const conversationId = convResponse.data.id;

      // Automatically send initial interest message with product attached
      await sendDirect({
        id: conversationId,
        content: `Hi, I'm interested in this product: ${product.name}`,
        product_id: product.id,
        product_name: product.name,
        product_slug: product.slug,
        product_image: product.image || undefined
      }).unwrap();

      toast.success("Initial message sent to vendor!");
      
      const conversationPath = buildRoute.messages(conversationId);
      if (areSubdomainsDisabled()) {
        navigate(conversationPath);
      } else {
        const subdomain = getSubdomain();
        if (subdomain && subdomain !== "vendor" && subdomain !== "admin") {
          window.location.href = `${window.location.protocol}//${getBaseDomain()}${conversationPath}`;
        } else {
          navigate(conversationPath);
        }
      }
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to contact vendor"));
    } finally {
      setIsContactingVendor(false);
    }
  };

  /* ── Determine mode ── */
  const hasNewOptions = (product.options?.length ?? 0) > 0;

  /* ── Matched variant from combinations ── */
  const matchedVariant = useMemo<ProductVariant | null>(() => {
    if (!hasNewOptions || !product.variants?.length) return null;
    const optionKeys = product.options?.map((o) => o.name) ?? [];
    if (!optionKeys.every((k) => selectedOptions[k])) return null;

    return (
      product.variants.find((v) => {
        if (!v.combinations) return false;
        return optionKeys.every(
          (k) => v.combinations![k] === selectedOptions[k],
        );
      }) ?? null
    );
  }, [selectedOptions, product.variants, product.options, hasNewOptions]);

  const activeVariant = matchedVariant;

  /* ── Derived display values ── */
  const displayPrice = activeVariant
    ? (activeVariant.discount_price ?? activeVariant.price)
    : product.price;

  const displayOriginalPrice = activeVariant?.discount_price
    ? activeVariant.price
    : product.originalPrice;

  const currentStock = activeVariant ? activeVariant.stock : product.stock;

  /* ─── Check if all required options are selected ─── */
  const allOptionsSelected = hasNewOptions
    ? (product.options ?? []).every((o) => selectedOptions[o.name])
    : true;

  /* ─── Handlers ─── */

  const selectOption = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  };

  const handleAddToCart = async () => {
    if (hasNewOptions) {
      if (!allOptionsSelected) {
        const missing = (product.options ?? []).find(
          (o) => !selectedOptions[o.name],
        );
        toast.error(`Please select a ${missing?.name ?? "option"}`);
        return;
      }
      if (!matchedVariant) {
        toast.error("Selected combination is not available");
        return;
      }
      if (matchedVariant.stock <= 0) {
        toast.error("This combination is out of stock");
        return;
      }
      if (quantity > matchedVariant.stock) {
        toast.error(
          `Only ${matchedVariant.stock} items left for this combination`,
        );
        return;
      }
    } else {
      if (!activeVariant && quantity > product.stock) {
        toast.error(`Only ${product.stock} items left in stock`);
        return;
      }
    }

    if (!isAuthenticated) {
      dispatch(
        addToLocalCart({
          product_id: product.id,
          vendor_id: "local",
          name: product.name,
          slug: product.name.toLowerCase().replace(/\s+/g, "-"),
          price: displayPrice,
          discount_price: displayOriginalPrice ? displayPrice : null,
          quantity,
          variant_id: activeVariant?.id,
          variant_options:
            hasNewOptions && Object.keys(selectedOptions).length > 0
              ? selectedOptions
              : undefined,
          image: activeVariant?.image_url ?? product.image,
        }),
      );
      toast.success(`${product.name} added to cart`);
      return;
    }

    try {
      await addToCart({
        product_id: product.id,
        quantity,
        variant_id: activeVariant?.id,
      }).unwrap();

      toast.success(`${product.name} added to cart`);
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to add product to cart"));
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
    } catch (err: unknown) {
      setLiked(prev);
      toast.error(extractErrorMessage(err, "Wishlist action failed"));
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full"
    >
      {/* ─── Product Header ─── */}
      <div className="space-y-4 px-1">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider shrink-0">
              {product.category}
            </Badge>
            <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-950/30 px-2.5 py-1 rounded-sm border border-yellow-200 dark:border-yellow-900/50 shrink-0">
              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
              <span className="text-sm font-black text-yellow-700 dark:text-yellow-400">
                {product.rating.toFixed(1)}
              </span>
            </div>
            
            <div className="ms-auto flex items-center justify-end border-l border-border/40 pl-4 ml-2">
              <ProductShareButton product={product} />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground leading-[1.1]">
            {product.name}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl md:text-4xl font-black text-primary">
              ₦{Number(displayPrice).toLocaleString()}
            </span>
            {displayOriginalPrice && (
              <span className="text-base sm:text-xl font-medium text-muted-foreground line-through decoration-rose-500/30">
                ₦{Number(displayOriginalPrice).toLocaleString()}
              </span>
            )}
          </div>
          {currentStock > 0 ? (
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-sm border border-emerald-100 dark:border-emerald-900/50">
              <PackageCheck className="w-4 h-4" />
              In Stock {activeVariant && `(${currentStock} left)`}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold text-sm bg-rose-50 dark:bg-rose-950/30 px-3 py-1 rounded-sm border border-rose-100 dark:border-rose-900/50">
              Out of Stock
            </div>
          )}
        </div>

        {installmentPlanNames.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mt-2">
            <Wallet className="w-3.5 h-3.5 text-primary/70" />
            <span>
              or pay in installments
              <span className="text-muted-foreground/70">
                {" "}
                — {installmentPlanNames.join(", ")}
              </span>
            </span>
          </div>
        )}
      </div>

      {/* ─── Description ─── */}
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {product.description}
        </p>
        {(product.highlights?.length ?? 0) > 0 && (
          <div className="grid grid-cols-1 gap-2">
            {product.highlights.slice(0, 3).map((h, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs font-medium text-foreground/80"
              >
                <div className="w-1.5 h-1.5 rounded-sm bg-primary" />
                {h}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-px bg-border/50 dark:bg-white/10" />

      {/* ─── Variants Section ─── */}
      <div className="space-y-6">
        {/* NEW: Options-based variants (combinations) */}
        {hasNewOptions &&
          product.options?.map((option) => (
            <div key={option.name} className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold uppercase tracking-widest text-muted-foreground/80 text-[10px]">
                  {option.name}:{" "}
                  <span className="text-foreground">
                    {selectedOptions[option.name] || `Select ${option.name}`}
                  </span>
                </span>
              </div>
              <div className="flex gap-2.5 flex-wrap">
                {option.values.map((value) => {
                  /* Check if any variant matching this value (and current other selections) has stock */
                  const hasStock =
                    product.variants?.some((v) => {
                      if (v.combinations?.[option.name] !== value) return false;
                      return Object.entries(selectedOptions).every(
                        ([k, val]) =>
                          k === option.name
                            ? true
                            : v.combinations?.[k] === val,
                      );
                    }) ?? true;

                  const isSelected = selectedOptions[option.name] === value;
                  return (
                    <button
                      key={value}
                      onClick={() =>
                        hasStock && selectOption(option.name, value)
                      }
                      disabled={!hasStock}
                      className={cn(
                        "min-w-[50px] h-11 px-4 rounded-sm text-sm font-bold transition-all duration-200 border-2 relative",
                        isSelected
                          ? "bg-primary text-white border-primary   scale-105"
                          : hasStock
                            ? "bg-background text-foreground border-border hover:border-primary/50"
                            : "bg-muted text-muted-foreground border-border cursor-not-allowed opacity-40 line-through",
                      )}
                    >
                      {value}
                      {isSelected && (
                        <Check className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-primary text-white rounded-sm p-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
      </div>

      {/* ─── Stock Status (Single placement below all selections) ─── */}
        {allOptionsSelected && activeVariant && (
          <div className="px-1 -mt-2">
            {activeVariant.stock <= 0 ? (
              <p className="text-rose-500 text-xs font-black flex items-center gap-1.5 bg-rose-500/5 py-1.5 px-3 rounded-sm border border-rose-500/10 w-fit">
                <span className="w-1.5 h-1.5 rounded-sm bg-rose-500 animate-pulse" />
                This combination is out of stock
              </p>
            ) : activeVariant.stock <= 5 ? (
              <div className="flex flex-col gap-1">
                <p className="text-amber-600 dark:text-amber-400 text-xs font-black flex items-center gap-2 bg-amber-500/5 py-2 px-3 rounded-sm border border-amber-500/20 w-fit ">
                  <span className="flex items-center justify-center">
                    <PackageCheck className="w-4 h-4" />
                  </span>
                  Only {activeVariant.stock} pieces left in stock!
                </p>
              </div>
            ) : (
              <p className="text-emerald-600 dark:text-emerald-400 text-xs font-black flex items-center gap-2 bg-emerald-500/5 py-2 px-3 rounded-sm border border-emerald-500/10 w-fit">
                <PackageCheck className="w-4 h-4" />
                {activeVariant.stock} items available in stock
              </p>
            )}
          </div>
        )}

      {/* ─── Purchase Section ─── */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Quantity Selector */}
          <div className="bg-muted/50 dark:bg-neutral-800 rounded-sm flex items-center justify-between p-1 border border-border/40 dark:border-white/10 h-12 sm:w-fit">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-sm h-10 w-10 hover:bg-background dark:hover:bg-neutral-700  text-muted-foreground"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-bold text-base w-12 text-center text-foreground">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-sm h-10 w-10 hover:bg-background dark:hover:bg-neutral-700  text-muted-foreground"
              onClick={() =>
                setQuantity((q) => Math.min(q + 1, currentStock || 999))
              }
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-1 gap-3 min-w-0">
            <Button
              size="lg"
              disabled={
                currentStock <= 0 ||
                addingToCart ||
                (hasNewOptions &&
                  (!allOptionsSelected || (matchedVariant?.stock ?? 0) <= 0))
              }
              onClick={handleAddToCart}
              className="flex-1 min-w-0 rounded-sm bg-emerald-600 text-white hover:bg-emerald-700 h-12 text-sm sm:text-base font-black group relative overflow-hidden active:scale-95 transition-all"
            >
                {addingToCart ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-sm animate-spin" />
                    Adding...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                    <span className="truncate">
                      {hasNewOptions && !allOptionsSelected
                        ? "Select Options First"
                        : "Add to Cart"}
                    </span>
                  </div>
                )}
            </Button>

            <Button
              size="icon"
              variant="outline"
              onClick={toggleWishlist}
              title={liked ? "Remove from Favorites" : "Add to Favorites"}
              className={cn(
                "h-12 w-12 shrink-0 rounded-sm border-2 transition-all active:scale-90",
                liked
                  ? "bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/50 text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/50"
                  : "hover:border-primary/50 text-muted-foreground",
              )}
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  liked && "fill-current scale-110",
                )}
              />
            </Button>

            <Button
              size="icon"
              variant="outline"
              onClick={handleMessageVendor}
              disabled={isContactingVendor}
              title="Message Vendor"
              className="h-12 w-12 shrink-0 rounded-sm border-2 transition-all active:scale-90 hover:border-primary/50 text-muted-foreground"
            >
              <div>
                {isContactingVendor ? (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                ) : (
                  <MessageSquare className="h-5 w-5" />
                )}
              </div>
            </Button>
          </div>
        </div>

        {/* ─── Trust Factors ─── */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/40">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-sm bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400">
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
            <div className="p-2 rounded-sm bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
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

        <div className="flex items-center justify-between px-4 py-3 rounded-sm bg-muted/30 dark:bg-neutral-800/50 border border-border/40 dark:border-white/10">
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
    </div>
  );
}
