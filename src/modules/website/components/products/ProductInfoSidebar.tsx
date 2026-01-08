import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

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
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useAddItemToCartMutation } from "@/services/cartApi";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/services/wishlistApi";

interface ProductInfoSidebarProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    vendor: string;
    rating: number;
    stock: number;
    highlights: string[];
    sizes?: string[];
    colors?: string[];
    image?: string | null;

    /** 🔹 backend flag */
    is_in_wishlist?: boolean;
  };
}

export default function ProductInfoSidebar({
  product,
}: ProductInfoSidebarProps) {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  const [quantity, setQuantity] = useState(1);

  /** ⭐ optimistic wishlist state */
  const [liked, setLiked] = useState<boolean>(Boolean(product.is_in_wishlist));

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const [addToCart, { isLoading: addingToCart }] = useAddItemToCartMutation();

  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  /* ───────────────── ACTIONS ───────────────── */

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    // 🔒 FORCE OPTION SELECTION
    if (product.sizes?.length && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (product.colors?.length && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    try {
      await addToCart({
        product_id: product.id,
        quantity,
        size: selectedSize,
        color: selectedColor,
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

    // ✅ optimistic UI
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
      // ❌ revert on failure
      setLiked(prev);
      toast.error(
        err?.data?.message || err?.message || "Wishlist action failed"
      );
    }
  };

  /* ───────────────── RENDER ───────────────── */

  return (
    <div className="space-y-7">
      {/* ─── Title + Meta ─── */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

        <div className="flex items-center flex-wrap gap-3 mt-3">
          <Badge variant="outline">{product.category}</Badge>

          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="h-4 w-4 fill-yellow-500" />
            <span>{product.rating.toFixed(1)}</span>
          </div>

          <p
            className={cn(
              "text-sm",
              product.stock > 0 ? "text-gray-500" : "text-red-500 font-medium"
            )}
          >
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
        </div>
      </div>

      {/* ─── Price ─── */}
      <div className="text-3xl font-semibold text-primary">
        ₦
        {Number(product.price).toLocaleString("en-NG", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}
      </div>

      {/* ─── Description ─── */}
      <p className="text-gray-700 leading-relaxed">{product.description}</p>

      {/* ─── Highlights ─── */}
      {product.highlights?.length > 0 && (
        <ul className="space-y-1 text-gray-600 list-disc pl-5">
          {product.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}

      {/* ─── Sizes ─── */}
      {product.sizes?.length ? (
        <div>
          <h4 className="font-medium mb-2">Select Size</h4>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((size) => (
              <Button
                key={size}
                type="button"
                variant={selectedSize === size ? "default" : "outline"}
                onClick={() => setSelectedSize(size)}
                className="rounded-full px-4 py-2 text-sm"
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      {/* ─── Colors ─── */}
      {product.colors?.length ? (
        <div>
          <h4 className="font-medium mb-2">Select Color</h4>
          <div className="flex gap-3 flex-wrap">
            {product.colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "relative w-9 h-9 rounded-full border-2 flex items-center justify-center",
                  selectedColor === color
                    ? "ring-2 ring-primary border-primary"
                    : "border-gray-300"
                )}
                style={{ backgroundColor: color }}
              >
                {selectedColor === color && (
                  <Check className="h-4 w-4 text-white" strokeWidth={3} />
                )}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* ─── Quantity ─── */}
      <div>
        <h4 className="font-medium mb-2">Quantity</h4>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>

          <span className="font-medium text-lg w-6 text-center">
            {quantity}
          </span>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setQuantity((q) => q + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ─── Actions ─── */}
      <div className="flex items-center gap-2 pt-2">
        <Button
          size="lg"
          disabled={product.stock <= 0 || addingToCart}
          onClick={handleAddToCart}
          className="rounded-full bg-primary text-white flex items-center gap-2"
        >
          <ShoppingCart className="h-5 w-5" />
          {addingToCart ? "Adding…" : "Add to Cart"}
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={toggleWishlist}
          className={cn(
            "rounded-full border",
            liked && "bg-red-50 border-red-300"
          )}
        >
          <Heart
            className={cn(
              "h-5 w-5",
              liked ? "fill-red-500 text-red-500" : "text-gray-500"
            )}
          />
        </Button>
      </div>

      {/* ─── Vendor ─── */}
      <div className="flex items-center text-sm text-gray-500 gap-1">
        <Store className="h-4 w-4" />
        Sold by
        <span className="font-medium text-gray-800 ml-1">{product.vendor}</span>
      </div>
    </div>
  );
}
