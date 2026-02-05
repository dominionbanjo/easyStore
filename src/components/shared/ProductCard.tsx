import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import { Heart, Star } from "lucide-react";
import { BuyNowButton } from "./BuyNowButton";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/services/wishlistApi";

/* ───────────────── CONTEXT ───────────────── */

interface ProductCardContextType {
  id: string;
  slug: string;
  image: string;
  name: string;
  price: string;
  category: string;
  rating: number;
  stock: number;
  vendor?: string;
  avatar?: string;

  isFavorited: boolean;
  toggleFavorite: () => void;
}

interface ProductCardRootProps {
  id: string;
  slug: string;
  image: string;
  name: string;
  price: string;
  category?: string;
  rating?: number;
  stock?: number;
  vendor?: string;
  avatar?: string;

  /** 🔹 backend-driven */
  isFavorite?: boolean;

  children: ReactNode;
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
  category = "Category",
  rating = 0,
  stock = 0,
  vendor = "Seller",
  avatar,
  isFavorite = false,
  children,
}: ProductCardRootProps) => {
  const [isFavorited, setIsFavorited] = useState<boolean>(isFavorite);
  const navigate = useNavigate();

  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const toggleFavorite = async () => {
    const prev = isFavorited;

    // ✅ optimistic update
    setIsFavorited(!prev);

    try {
      if (!prev) {
        await addToWishlist({
          product_id: id,
          name,
          image,
          price: Number(price.replace(/[^\d]/g, "")),
        }).unwrap();
      } else {
        await removeFromWishlist({ productId: id }).unwrap();
      }
    } catch (err: any) {
      // ❌ revert on failure
      setIsFavorited(prev);

      toast.error(
        err?.data?.message || err?.message || "Failed to update wishlist",
      );
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
      category,
      rating,
      stock,
      vendor,
      avatar,
      isFavorited,
      toggleFavorite,
    }),
    [
      id,
      slug,
      image,
      name,
      price,
      category,
      rating,
      stock,
      vendor,
      avatar,
      isFavorited,
    ],
  );

  return (
    <ProductCardContext.Provider value={value}>
      <div
        onClick={handleCardClick}
        className="w-full max-w-[375px] bg-white rounded-[24px] p-3 shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group/card"
      >
        {children}
      </div>
    </ProductCardContext.Provider>
  );
};

/* ───────────────── IMAGE ───────────────── */

const Image = () => {
  const { image, isFavorited, toggleFavorite, name } = useProductCard();

  return (
    <div className="relative rounded-[20px] overflow-hidden h-[260px] mb-3 bg-gray-100">
      {/* ❤️ Favourite */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite();
        }}
        aria-label="Toggle wishlist"
        className="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-2 shadow-sm hover:scale-110 transition"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            isFavorited
              ? "fill-red-500 stroke-red-500"
              : "stroke-gray-600 hover:stroke-red-500"
          }`}
        />
      </button>

      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
};

/* ───────────────── INFO ───────────────── */

const Info = ({ onClick }: { onClick?: () => void }) => {
  const { name, price, stock } = useProductCard();
  const isOutOfStock = stock <= 0;

  return (
    <div className="space-y-3">
      <h3 className="text-sm sm:text-base font-semibold line-clamp-2 min-h-[2.5rem]">
        {name}
      </h3>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-500">Price</span>
          <div className="text-green-600 font-medium text-lg">{price}</div>
        </div>

        <BuyNowButton
          text={isOutOfStock ? "Sold Out" : "View Product"}
          disabled={isOutOfStock}
          onClick={onClick}
        />
      </div>

      {isOutOfStock && (
        <div className="text-xs text-red-500 bg-red-50 rounded-lg py-1 text-center">
          Currently unavailable
        </div>
      )}
    </div>
  );
};

/* ───────────────── FOOTER ───────────────── */

const Footer = () => {
  const { rating, stock, vendor, avatar } = useProductCard();

  return (
    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
      <Link
        to={`/vendor/${vendor}`}
        className="flex items-center gap-2 truncate relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={avatar || "/avatars/default.png"}
          className="h-6 w-6 rounded-full border"
        />
        <span className="truncate">{vendor}</span>
      </Link>

      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
        <span>{rating.toFixed(1)}</span>
      </div>

      <span
        className={`font-medium ${
          stock <= 0
            ? "text-red-500"
            : stock <= 5
              ? "text-orange-500"
              : "text-gray-600"
        }`}
      >
        {stock <= 0 ? "Out" : `${stock} left`}
      </span>
    </div>
  );
};

/* ───────────────── ACTIONS ───────────────── */

const Actions = ({ onClick }: { onClick?: () => void }) => {
  const { stock } = useProductCard();

  return (
    <div className="mt-3 flex justify-end">
      <BuyNowButton
        text={stock <= 0 ? "Sold Out" : "Buy Now"}
        disabled={stock <= 0}
        onClick={onClick}
      />
    </div>
  );
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
