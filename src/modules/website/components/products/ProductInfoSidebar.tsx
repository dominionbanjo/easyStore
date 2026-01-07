import { useState } from "react";
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

interface ProductInfoSidebarProps {
  product: {
    id: string | number;
    name: string;
    price: string;
    description: string;
    category: string;
    vendor: string;
    rating: number;
    stock: number;
    highlights: string[];
    sizes?: string[];
    colors?: string[];
  };
}

export default function ProductInfoSidebar({
  product,
}: ProductInfoSidebarProps) {
  const [liked, setLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const toggleLike = () => {
    setLiked(!liked);
    toast.info(!liked ? "Added to wishlist" : "Removed from wishlist");
  };

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length) {
      toast.error("Please select a size");
      return;
    }
    if (!selectedColor && product.colors?.length) {
      toast.error("Please select a color");
      return;
    }
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="space-y-7">
      {/* ─── Product Title + Meta ─── */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        <div className="flex items-center flex-wrap gap-3 mt-3">
          <Badge variant="outline">{product.category}</Badge>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="h-4 w-4 fill-yellow-500" />
            <span>{product.rating}</span>
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
      <div className="text-3xl font-semibold text-primary">{product.price}</div>

      {/* ─── Description ─── */}
      <p className="text-gray-700 leading-relaxed">{product.description}</p>

      {/* ─── Highlights ─── */}
      <ul className="space-y-1 text-gray-600 list-disc pl-5">
        {product.highlights.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>

      {/* ─── Sizes ─── */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Select Size</h4>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((size) => (
              <Button
                key={size}
                type="button"
                variant={selectedSize === size ? "default" : "outline"}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition-all",
                  selectedSize === size && "bg-primary text-white"
                )}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Colors ─── */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Select Color</h4>
          <div className="flex gap-3 flex-wrap">
            {product.colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "relative w-9 h-9 rounded-full border-2 transition-all duration-200 flex items-center justify-center",
                  selectedColor === color
                    ? "ring-2 ring-primary border-primary"
                    : "border-gray-300 hover:border-gray-400"
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
      )}

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
          disabled={product.stock <= 0}
          className="rounded-full bg-primary text-white flex items-center gap-2"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-5 w-5" /> Add to Cart
        </Button>
        <Button
          size="icon"
          variant="outline"
          className={cn(
            "rounded-full border transition-all",
            liked ? "bg-red-50 border-red-300" : ""
          )}
          onClick={toggleLike}
        >
          <Heart
            className={cn(
              "h-5 w-5",
              liked ? "fill-red-500 text-red-500" : "text-gray-500"
            )}
          />
        </Button>
      </div>

      {/* ─── Vendor Info ─── */}
      <div className="flex items-center text-sm text-gray-500 gap-1">
        <Store className="h-4 w-4" />
        Sold by{" "}
        <span className="font-medium text-gray-800 ml-1">{product.vendor}</span>
      </div>
    </div>
  );
}
