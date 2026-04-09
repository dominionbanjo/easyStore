import { Link } from "react-router-dom";
import { Search, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TemplateProfileDropdown } from "@/components/shared/TemplateProfileDropdown";
import type { IProductStore } from "@/types/product/productTypes";

interface BazaarHeaderProps {
  store: IProductStore;
  onCartOpen: () => void;
  cartItemsCount: number;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

export function BazaarHeader({
  store,
  onCartOpen,
  cartItemsCount,
  searchOpen,
  setSearchOpen,
}: BazaarHeaderProps) {
  return (
    <header className="bg-white dark:bg-zinc-900  border-b-4 border-[var(--theme-primary)] sticky top-0 z-50 transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 flex-1">
          <Link
            to={`/stores/${store.slug}`}
            className="flex items-center gap-3 shrink-0"
          >
            {store.logo && (
              <img
                src={store.logo}
                alt="logo"
                className="w-8 h-8 rounded-sm shrink-0 object-cover"
              />
            )}
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-none">
              {store.store_name}
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <Input
              placeholder={`Search in ${store.store_name}...`}
              className="w-full pl-4 pr-12 h-10 border-2 border-zinc-200 dark:border-zinc-800 rounded-sm focus-visible:ring-0 focus-visible:border-[var(--theme-primary)]"
            />
            <Button
              size="icon"
              className="absolute right-0 top-0 h-10 w-10 bg-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/90 rounded-l-none"
            >
              <Search className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-slate-500"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative p-2 flex-shrink-0 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-white"
            onClick={onCartOpen}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-sm bg-[var(--theme-primary)] text-[10px] font-black text-white ring-2 ring-white dark:ring-zinc-900 ">
                {cartItemsCount}
              </span>
            )}
          </Button>

          <TemplateProfileDropdown
            buttonClassName="relative p-2 flex-shrink-0 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-white rounded-sm transition-colors"
            iconClassName="h-5 w-5"
          />
        </div>
      </div>

      {/* Mobile Search Expand */}
      {searchOpen && (
        <div className="md:hidden px-4 py-3 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 animate-in slide-in-from-top-2">
          <div className="relative flex gap-2">
            <Input
              placeholder={`Search in ${store.store_name}...`}
              className="flex-1 h-10 border-2 border-zinc-200 dark:border-zinc-800 rounded-sm"
              autoFocus
            />
            <Button size="icon" className="h-10 w-10 bg-[var(--theme-primary)]">
              <Search className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
