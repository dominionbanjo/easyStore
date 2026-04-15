import { Link } from "react-router-dom";
import { Search, ShoppingBag } from "lucide-react";
import { TemplateProfileDropdown } from "@/components/shared/TemplateProfileDropdown";
import type { IProductStore } from "@/types/product/productTypes";

interface EditorialHeaderProps {
  store: IProductStore;
  onCartOpen: () => void;
  cartItemsCount: number;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

export function EditorialHeader({
  store,
  onCartOpen,
  cartItemsCount,
  searchOpen,
  setSearchOpen,
}: EditorialHeaderProps) {
  return (
    <nav className="fixed top-0 w-full z-50 p-3 md:p-10 flex flex-col gap-4 bg-transparent mix-blend-difference text-[#FDFBF7]">
      <div className="w-full flex justify-between items-center">
        <Link
          to={`/stores/${store.slug}`}
          className="text-xl sm:text-2xl font-bold tracking-widest uppercase truncate max-w-[150px] sm:max-w-[300px]"
        >
          {store.store_name}
        </Link>
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 hover:opacity-70 transition-opacity"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <button
            onClick={onCartOpen}
            className="p-2 hover:opacity-70 transition-opacity relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FDFBF7] rounded-sm" />
            )}
          </button>

          <TemplateProfileDropdown
            buttonClassName="p-2 hover:opacity-70 transition-opacity"
            iconClassName="w-5 h-5"
          />

          <Link
            to={`/stores/${store.slug}`}
            className="text-sm uppercase tracking-[0.2em] hover:opacity-70 transition-opacity hidden sm:block"
          >
            Return to Chapter
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="w-full max-w-xl self-center mt-4 border-b border-[#FDFBF7]/30 pb-2 animate-in fade-in slide-in-from-top-2">
          <input
            type="text"
            placeholder="Search chapters..."
            className="w-full bg-transparent border-none outline-none text-xl lowercase tracking-wider placeholder:text-[#FDFBF7]/40 placeholder:text-sm"
            autoFocus
          />
        </div>
      )}
    </nav>
  );
}
