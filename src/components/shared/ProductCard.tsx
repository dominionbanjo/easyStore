import { createContext, useContext, useState, useMemo } from "react";
import { Building, Heart, Star } from "lucide-react";
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
  options: any;
  isFavorited: boolean;
  toggleFavorite: () => void;
}

const ProductCardContext = createContext<ProductCardContextType | null>(null);
const useProductCard = () => {
  const ctx = useContext(ProductCardContext);
  if (!ctx) throw new Error("ProductCard must be inside <ProductCard.Root>");
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
}: any) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const toggleFavorite = () => setIsFavorited((p) => !p);

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
    border border-black/10 
    rounded-[24px] 
    p-3 
    sm:max-w-[300px]
    md:max-w-[340px]
    lg:p-4 
    lg:rounded-[28px]
    transition-shadow duration-200 hover:shadow-lg
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
    relative bg-[#f5f5f5] 
    rounded-[20px] 
    overflow-hidden 
    h-[230px] 
    sm:h-[240px] 
    md:h-[260px]
    mb-3 
    flex items-center justify-center
  "
    >


      {/* Brand */}
      <div className="absolute top-3 left-3 z-10">
        {brand ? (
          <img src={brand} alt="brand" className="h-6 w-auto object-contain drop-shadow-sm" />
        ) : (
          <Building className="w-6 h-6 text-white drop-shadow-md" />
        )}
      </div>

      {/* Favorite */}
      <button
        onClick={toggleFavorite}
        className="absolute top-3 right-3 rounded-full bg-white/80 p-1.5 backdrop-blur-sm hover:scale-110 transition"
      >
        <Heart
          className={`w-5 h-5 ${isFavorited ? "fill-red-500 stroke-red-500" : "stroke-red-500"
            }`}
        />
      </button>

      <img src={image} alt={name} className="w-full h-full object-cover" />
    </div>
  );
};

const Info = ({ onClick }: { onClick?: () => void }) => {
  const { name, price, stock } = useProductCard();
  const isOutOfStock = stock <= 0;

  return (
    <div className="space-y-2 sm:space-y-3">
      <h2 className="text-sm sm:text-base md:text-lg font-semibold line-clamp-1 text-gray-900">
        {name}
      </h2>
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-green-600 font-semibold text-[14px] sm:text-[15px] md:text-base">
            {price}
          </div>
        </div>

        <BuyNowButton
          text="Buy Now"
          disabled={isOutOfStock}
          onClick={onClick}
        />
      </div>
    </div>
  );
};

const Footer = () => {
  const { category, rating, stock, vendor, avatar } = useProductCard();

  return (
    <div className="mt-2 flex items-center justify-between gap-2 text-xs sm:text-sm text-gray-600">
      {/* Vendor */}
      <Link to="#" className="flex items-center gap-1 truncate hover:underline">
        <img
          src={avatar || "/avatars/default.png"}
          alt={vendor}
          className="h-5 w-5 rounded-full object-cover border"
        />
        <span className="truncate">{vendor}</span>
      </Link>

      {/* Rating */}
      <div className="flex items-center justify-center gap-1">
        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
        <span>{rating.toFixed(1)}</span>
      </div>

      {/* Stock */}
      <div className="text-right">
        {stock > 0 ? `${stock} left` : "Out"}
      </div>
    </div>
  );
};

const Actions = ({ onClick }: { onClick?: () => void }) => (
  <div className="mt-3 flex justify-end">
    <BuyNowButton text="Buy Now" onClick={onClick} />
  </div>
);

export const ProductCard = { Root, Image, Info, Footer, Actions };
export default ProductCard;
