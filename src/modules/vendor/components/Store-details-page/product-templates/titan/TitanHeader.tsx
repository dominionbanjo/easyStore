import { Link } from "react-router-dom";
import { Search, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateProfileDropdown } from "@/components/shared/TemplateProfileDropdown";
import type { IProductStore } from "@/types/product/productTypes";
import type { UIProduct } from "@/modules/vendor/utils/productAdapter";

interface TitanHeaderProps {
  store: IProductStore;
  uiProduct: UIProduct;
  onCartOpen: () => void;
  cartItemsCount: number;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

export function TitanHeader({
  store,
  uiProduct,
  onCartOpen,
  cartItemsCount,
  searchOpen,
  setSearchOpen,
}: TitanHeaderProps) {
  return (
    <header className="border-b border-zinc-800 p-4 md:p-6 sticky top-0 bg-black/80 backdrop-blur-md z-50 flex flex-col gap-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            to={`/stores/${store.slug}`}
            className="text-xl md:text-2xl font-bold tracking-tight text-white uppercase flex flex-col"
          >
            <span className="text-[10px] text-[var(--theme-primary)] mb-1 leading-none">
              SYS.NODE // {store.id.substring(0, 6)}
            </span>
            {store.store_name}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-500 hover:text-[var(--theme-primary)]"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative p-2 flex-shrink-0 hover:bg-zinc-800 text-zinc-500 hover:text-white"
            onClick={onCartOpen}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-sm bg-[var(--theme-primary)] text-[10px] font-black text-black ring-2 ring-black ">
                {cartItemsCount}
              </span>
            )}
          </Button>

          <TemplateProfileDropdown
            buttonClassName="relative p-2 flex-shrink-0 hover:bg-zinc-800 text-zinc-500 hover:text-white rounded-sm transition-colors"
            iconClassName="h-5 w-5"
          />
        </div>
      </div>

      {searchOpen && (
        <div className="w-full max-w-2xl mx-auto pb-4 animate-in slide-in-from-top-2">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-[var(--theme-primary)]/20 rounded-none blur opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative flex items-center bg-black border border-zinc-800 focus-within:border-[var(--theme-primary)] transition-colors">
              <span className="pl-4 text-[10px] text-[var(--theme-primary)] opacity-50 whitespace-nowrap">
                [QUERY]:
              </span>
              <input
                type="text"
                placeholder="SEARCH_SYSTEM_DATABASE..."
                className="w-full bg-transparent border-none outline-none text-xs font-mono py-3 px-4 text-white placeholder:text-zinc-700"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-500 hover:text-[var(--theme-primary)] mr-1"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 text-xs opacity-70">
        <span>[PATH]:</span>
        <Link
          to={`/stores/${store.slug}`}
          className="hover:text-[var(--theme-primary)] hover:underline"
        >
          ROOT
        </Link>
        <span>/</span>
        <span className="text-zinc-500">
          CAT_{uiProduct.category.toUpperCase().replace(/\s+/g, "_")}
        </span>
        <span>/</span>
        <span className="text-white truncate max-w-[150px]">
          {uiProduct.id.substring(0, 8).toUpperCase()}
        </span>
      </div>
    </header>
  );
}
