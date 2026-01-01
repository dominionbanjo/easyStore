import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import { Dribbble, Heart, Star } from "lucide-react";
import { BuyNowButton } from "./BuyNowButton";
import { Link } from "react-router-dom";

interface ProductCardContextType {
  id: string | number;
  image: string;
  name: string;
  price: string;
  category: string;
  rating: number;
  stock: number;
  vendor?: string;
  avatar?: string;
  brand?: string;
  options?: any;
  isFavorited: boolean;
  toggleFavorite: () => void;
}

interface ProductCardRootProps {
  id: string | number;
  image: string;
  brand?: string;
  name: string;
  price: string;
  category?: string;
  rating?: number;
  stock?: number;
  vendor?: string;
  avatar?: string;
  options?: any;
  children: ReactNode;
}

const ProductCardContext = createContext<ProductCardContextType | null>(null);

const useProductCard = () => {
  const ctx = useContext(ProductCardContext);
  if (!ctx) throw new Error("ProductCard components must be used inside <ProductCard.Root>");
  return ctx;
};

const Root = ({
  id,
  image,
  brand,
  name,
  price,
  category = "Category",
  rating = 0,
  stock = 0,
  vendor = "Seller",
  avatar,
  options = {},
  children,
}: ProductCardRootProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const toggleFavorite = () => setIsFavorited((prev) => !prev);

  const value = useMemo(
    () => ({
      id,
      image,
      brand,
      name,
      price,
      category,
      rating,
      stock,
      vendor,
      avatar,
      options,
      isFavorited,
      toggleFavorite,
    }),
    [id, image, brand, name, price, category, rating, stock, vendor, avatar, options, isFavorited]
  );

  return (
    <ProductCardContext.Provider value={value}>
      <div
        className="
          w-full 
          max-w-[340px] 
          bg-white 
          rounded-[24px] 
          p-3 
          sm:max-w-[300px]
          md:max-w-[340px]
          lg:p-4 
          lg:rounded-[28px]
          shadow-sm
          border border-gray-100
          transition-all duration-300 
          hover:shadow-xl
          hover:-translate-y-1
        "
      >
        {children}
      </div>
    </ProductCardContext.Provider>
  );
};

const Image = () => {
  const { image, isFavorited, toggleFavorite, name, brand } = useProductCard();

  return (
    <div
      className="
        relative 
        bg-gradient-to-br from-gray-50 to-gray-100
        rounded-[20px] 
        overflow-hidden 
        h-[230px] 
        sm:h-[240px] 
        md:h-[260px]
        mb-3
      "
    >
      {/* Brand Logo */}
      <div className="absolute top-3 left-3 z-10">
        {brand ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1.5 shadow-sm">
            <img 
              src={brand} 
              alt="brand logo" 
              className="h-5 w-auto object-contain" 
            />
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1.5 shadow-sm">
            <Dribbble className="w-5 h-5 text-gray-600" />
          </div>
        )}
      </div>

      {/* Favorite Button */}
      <button
        onClick={toggleFavorite}
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        className="
          absolute top-3 right-3 z-10
          rounded-full bg-white/90 backdrop-blur-sm 
          p-2 
          shadow-sm
          hover:scale-110 hover:bg-white
          active:scale-95
          transition-all duration-200
        "
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            isFavorited 
              ? "fill-red-500 stroke-red-500" 
              : "stroke-gray-600 hover:stroke-red-500"
          }`}
        />
      </button>

      {/* Product Image */}
      <img 
        src={image} 
        alt={name} 
        className="w-full h-full object-cover" 
        loading="lazy"
      />
    </div>
  );
};

const Info = ({ onClick }: { onClick?: () => void }) => {
  const { name, price, stock } = useProductCard();
  const isOutOfStock = stock <= 0;

  return (
    <div className="space-y-3">
      {/* Product Name */}
      <h3 className="text-sm sm:text-base md:text-lg font-semibold line-clamp-2 text-gray-900 leading-snug min-h-[2.5rem]">
        {name}
      </h3>

      {/* Price and Buy Button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Price</span>
          <span className="text-green-600 font-medium text-base sm:text-lg md:text-xl">
            {price}
          </span>
        </div>

        <BuyNowButton
          text={isOutOfStock ? "Sold Out" : "View Product"}
          disabled={isOutOfStock}
          onClick={onClick}
        />
      </div>

      {/* Out of Stock Warning */}
      {isOutOfStock && (
        <div className="text-xs text-red-500 font-medium text-center bg-red-50 py-1 rounded-lg">
          Currently unavailable
        </div>
      )}
    </div>
  );
};

const Footer = () => {
  const { rating, stock, vendor, avatar } = useProductCard();
  const isLowStock = stock > 0 && stock <= 5;

  return (
    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-3 text-xs sm:text-sm text-gray-600">
      {/* Vendor */}
      <Link 
        to={`/vendor/${vendor}`} 
        className="flex items-center gap-1.5 min-w-0 flex-1 group hover:text-gray-900 transition-colors"
      >
        <img
          src={avatar || "/avatars/default.png"}
          alt={`${vendor} avatar`}
          className="h-6 w-6 rounded-full object-cover border border-gray-200 flex-shrink-0"
        />
        <span className="truncate group-hover:underline">{vendor}</span>
      </Link>

      {/* Rating */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
        <span className="font-medium text-gray-900">{rating.toFixed(1)}</span>
      </div>

      {/* Stock Status */}
      <div className={`text-right flex-shrink-0 font-medium ${
        stock <= 0 
          ? "text-red-500" 
          : isLowStock 
            ? "text-orange-500" 
            : "text-gray-600"
      }`}>
        {stock <= 0 ? "Out of Stock" : `${stock} left`}
      </div>
    </div>
  );
};

const Actions = ({ onClick }: { onClick?: () => void }) => {
  const { stock } = useProductCard();
  const isOutOfStock = stock <= 0;

  return (
    <div className="mt-3 flex justify-end">
      <BuyNowButton 
        text={isOutOfStock ? "Sold Out" : "Buy Now"} 
        disabled={isOutOfStock}
        onClick={onClick} 
      />
    </div>
  );
};

export const ProductCard = { 
  Root, 
  Image, 
  Info, 
  Footer, 
  Actions 
};

export default ProductCard;