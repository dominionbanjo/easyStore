import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { toast } from "sonner";
import { extractErrorMessage } from "@/utils/errorHandler";
import { useAddItemToCartMutation } from "@/services/cartApi";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/services/wishlistApi";
import { addToLocalCart } from "@/features/cartSlice";

export interface ProductVariant {
  id: string;
  combinations?: Record<string, string>;
  price: number;
  stock: number;
  discount_price?: number;
  image_url?: string;
  size?: string;
}

export interface ProductActionProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  stock: number;
  image?: string | null;
  storeSlug: string;
  slug: string;
  options?: { name: string; values: string[] }[] | null;
  variants?: ProductVariant[] | null;
  is_in_wishlist?: boolean;
}

export function useProductActions(product: ProductActionProps) {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState<boolean>(Boolean(product.is_in_wishlist));

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  const [addItemToCart, { isLoading: addingToCart }] =
    useAddItemToCartMutation();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const hasNewOptions = (product.options?.length ?? 0) > 0;

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

  const displayPrice = activeVariant
    ? (activeVariant.discount_price ?? activeVariant.price)
    : product.price;

  const displayOriginalPrice = activeVariant?.discount_price
    ? activeVariant.price
    : product.originalPrice;

  const currentStock = activeVariant ? activeVariant.stock : product.stock;

  const allOptionsSelected = hasNewOptions
    ? (product.options ?? []).every((o) => selectedOptions[o.name])
    : true;

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
      await addItemToCart({
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

  return {
    quantity,
    setQuantity,
    liked,
    selectedOptions,
    addingToCart,
    hasNewOptions,
    activeVariant,
    displayPrice,
    displayOriginalPrice,
    currentStock,
    allOptionsSelected,
    selectOption,
    handleAddToCart,
    toggleWishlist,
    isAuthenticated,
  };
}
