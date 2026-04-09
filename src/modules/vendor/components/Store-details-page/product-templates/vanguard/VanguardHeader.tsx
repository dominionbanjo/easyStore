import { Link } from "react-router-dom";
import { Search, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TemplateProfileDropdown } from "@/components/shared/TemplateProfileDropdown";
import type { IProductStore } from "@/types/product/productTypes";
import type { UIProduct } from "@/modules/vendor/utils/productAdapter";

interface VanguardHeaderProps {
  store: IProductStore;
  uiProduct: UIProduct;
  onCartOpen: () => void;
  cartItemsCount: number;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

export function VanguardHeader({
  store,
  uiProduct,
  onCartOpen,
  cartItemsCount,
  searchOpen,
  setSearchOpen,
}: VanguardHeaderProps) {
  return (
    <header className="py-4 px-2 md:px-12 flex flex-col items-center justify-center border-b border-zinc-100 dark:border-zinc-900 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl z-50">
      <div className="w-full flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <Search className="h-5 w-5" />
        </Button>

        <Link
          to={`/stores/${store.slug}`}
          className="text-xl sm:text-2xl md:text-3xl tracking-[0.2em] uppercase font-light text-zinc-900 dark:text-white"
        >
          {store.store_name}
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            onClick={onCartOpen}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-sm bg-zinc-900 dark:bg-white text-[10px] font-bold text-white dark:text-zinc-900 ring-2 ring-white dark:ring-black ">
                {cartItemsCount}
              </span>
            )}
          </Button>

          <TemplateProfileDropdown
            buttonClassName="relative p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-sm transition-colors"
            iconClassName="h-5 w-5"
          />
        </div>
      </div>

      {searchOpen && (
        <div className="w-full max-w-md mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search our collection..."
              className="pl-10 border-zinc-200 dark:border-zinc-800 rounded-none focus-visible:ring-zinc-900 dark:focus-visible:ring-white h-12 text-sm tracking-wide"
              autoFocus
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-sans">
        <Link
          to={`/stores/${store.slug}`}
          className="hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="truncate max-w-[200px]">{uiProduct.name}</span>
      </div>
    </header>
  );
}
