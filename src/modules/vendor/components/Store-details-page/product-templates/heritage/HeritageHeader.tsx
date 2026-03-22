import { Link } from "react-router-dom";
import { Search, ShoppingBag } from "lucide-react";
import { TemplateProfileDropdown } from "@/components/shared/TemplateProfileDropdown";
import type { IProductStore } from "@/types/product/productTypes";
import type { UIProduct } from "@/modules/vendor/utils/productAdapter";

interface HeritageHeaderProps {
  store: IProductStore;
  uiProduct: UIProduct;
  onCartOpen: () => void;
  cartItemsCount: number;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

export function HeritageHeader({
  store,
  uiProduct,
  onCartOpen,
  cartItemsCount,
  searchOpen,
  setSearchOpen,
}: HeritageHeaderProps) {
  return (
    <header className="py-6 px-4 md:px-12 flex flex-col gap-4 border-b border-[#EADDCE] dark:border-[#3D352B] bg-[#FAF7F2] dark:bg-[#1E1A17] sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between w-full">
        <Link
          to={`/stores/${store.slug}`}
          className="flex items-center gap-4 group"
        >
          {store.logo && (
            <img
              src={store.logo}
              alt="logo"
              className="w-12 h-12 rounded-full object-cover border-2 border-[#EADDCE] group-hover:border-[#8C7A6B] transition-colors"
            />
          )}
          <span className="text-2xl font-bold tracking-tight text-[#2C2622] dark:text-white group-hover:text-[var(--theme-primary)] transition-colors">
            {store.store_name}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2.5 rounded-full hover:bg-[#EADDCE] dark:hover:bg-[#3D352B] text-[#5C5042] dark:text-[#A89F91] transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>

          <button
            onClick={onCartOpen}
            className="relative p-2.5 rounded-full hover:bg-[#EADDCE] dark:hover:bg-[#3D352B] text-[#5C5042] dark:text-[#A89F91] transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--theme-primary)] text-[10px] font-bold text-white shadow-sm">
                {cartItemsCount}
              </span>
            )}
          </button>

          <TemplateProfileDropdown
            buttonClassName="p-2.5 rounded-full hover:bg-[#EADDCE] dark:hover:bg-[#3D352B] text-[#5C5042] dark:text-[#A89F91] transition-colors"
            iconClassName="h-5 w-5"
          />
          <div className="hidden lg:flex items-center gap-2 text-sm italic text-[#8C7A6B] dark:text-[#A89F91] ml-4">
            <span>Found in</span>
            <span className="mx-2">—</span>
            <span className="capitalize">{uiProduct.category}</span>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="w-full max-w-2xl mx-auto pb-4 animate-in slide-in-from-top-2">
          <div className="relative flex items-center bg-[#FAF7F2] dark:bg-[#2C2622] border-2 border-[#EADDCE] dark:border-[#3D352B] rounded-full focus-within:border-[var(--theme-primary)] transition-all overflow-hidden p-1">
            <input
              type="text"
              placeholder="search our collection..."
              className="w-full bg-transparent border-none outline-none text-sm italic py-2 px-6 text-[#2C2622] dark:text-white placeholder:text-[#8C7A6B]"
              autoFocus
            />
            <button className="h-10 px-6 rounded-full bg-[#8C7A6B] text-white text-xs uppercase tracking-widest hover:bg-[#2C2622] transition-colors">
              Search
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
