import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Star, Store } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

//
// ─── Context ─────────────────────────────────────────────────────────────
//
interface ProductCardContextType {
  id: string | number;
  name: string;
  vendor?: string;
  price: string;
  image: string;
  category: string;
  rating: number;
  stock: number;
  liked: boolean;
  toggleLike: (e?: React.MouseEvent) => void;
  addToCart: (e?: React.MouseEvent) => void;
  options: ProductCardOptions;
}

interface ProductCardOptions {
  image?: { showFavorite?: boolean };
  info?: { showVendor?: boolean };
  actions?: { showStock?: boolean };
}

const ProductCardContext = createContext<ProductCardContextType | null>(null);
const useProductCard = () => {
  const ctx = useContext(ProductCardContext);
  if (!ctx) throw new Error("useProductCard must be used within <ProductCard>");
  return ctx;
};

//
// ─── Image Section ─────────────────────────────────────────────────────────────
//
const Image = () => {
  const { image, liked, toggleLike, options } = useProductCard();
  const showFavorite = options.image?.showFavorite ?? true;

  return (
    <div className="relative w-full">
      <div
        className="h-64 bg-cover bg-center rounded-t-2xl overflow-hidden"
        style={{ backgroundImage: `url(${image})` }}
      />
      {showFavorite && (
        <button
          onClick={toggleLike}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 shadow-sm transition-all"
        >
          <Heart
            className={cn(
              "h-5 w-5",
              liked ? "fill-primary text-primary" : "text-gray-600"
            )}
          />
        </button>
      )}
    </div>
  );
};

//
// ─── Info Section ──────────────────────────────────────────────────────────────
//
const Info = () => {
  const { name, price, stock, vendor, category, rating, options } =
    useProductCard();
  const showVendor = options.info?.showVendor ?? true;
  const showStock = options.actions?.showStock ?? true;
  const outOfStock = stock <= 0;

  const displayVendor =
    vendor && vendor.length > 7 ? `${vendor.slice(0, 7)}...` : vendor;

  return (
    <div className="p-4 pt-3 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 leading-tight line-clamp-1">
          {name}
        </h3>
        {showVendor && displayVendor && (
          <div className="flex items-center gap-1 text-sm text-gray-500 truncate max-w-[40%]">
            <Store className="h-4 w-4 text-gray-400" />
            <span>{displayVendor}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-xs px-2 py-0.5 font-medium text-gray-700 border-gray-200"
          >
            {category}
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span className="text-sm">{rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900">{price}</p>
          {showStock && (
            <p
              className={cn(
                "text-xs",
                outOfStock ? "text-red-500" : "text-gray-500"
              )}
            >
              {outOfStock ? "Out of Stock" : `${stock} left`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

//
// ─── Actions Section ───────────────────────────────────────────────────────────
//
const Actions = () => {
  const { stock, addToCart } = useProductCard();
  const outOfStock = stock <= 0;

  return (
    <div className="px-4 pb-4">
      <Button
        size="sm"
        disabled={outOfStock}
        onClick={addToCart}
        className={cn(
          "w-full rounded-full flex items-center justify-center gap-2 transition-all",
          outOfStock
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-black text-white hover:bg-gray-900"
        )}
      >
        <Eye className="h-4 w-4" />
        View Product
      </Button>
    </div>
  );
};

//
// ─── Root ProductCard ───────────────────────────────────────────────────────────
//
interface ProductCardProps {
  id: string | number;
  name: string;
  vendor?: string;
  price: string;
  image: string;
  category: string;
  rating?: number;
  stock?: number;
  options?: ProductCardOptions;
  children?: ReactNode;
}

const ProductCardRoot = ({
  id,
  name,
  vendor,
  price,
  image,
  category,
  rating = 4.5,
  stock = 0,
  options = {},
  children,
}: ProductCardProps) => {
  const [liked, setLiked] = useState(false);

  const toggleLike = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    setLiked((l) => !l);
    toast.info(!liked ? "Added to favorites" : "Removed from favorites");
  };

  const addToCart = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (stock <= 0) return toast.error("Out of stock");
    toast.success(`${name} added to cart`);
  };

  const value: ProductCardContextType = {
    id,
    name,
    vendor,
    price,
    image,
    category,
    rating,
    stock,
    liked,
    toggleLike,
    addToCart,
    options,
  };

  return (
    <ProductCardContext.Provider value={value}>
      <Link to={`/product/${id}`} className="block w-full">
        <motion.div
          whileHover={{ scale: 1.015 }}
          transition={{ duration: 0.25 }}
        >
          <Card
            className={cn(
              "overflow-hidden rounded-2xl border hover:shadow-lg bg-white max-w-[520px] mx-auto p-0" // ✅ no padding inside card
            )}
          >
            {children}
          </Card>
        </motion.div>
      </Link>
    </ProductCardContext.Provider>
  );
};

//
// ─── Export with Slots ──────────────────────────────────────────────────────────
//
export const ProductCard = Object.assign(ProductCardRoot, {
  Image,
  Info,
  Actions,
});

export default ProductCard;
