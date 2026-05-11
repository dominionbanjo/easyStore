import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Search, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Messages3 } from "iconsax-react";
import { TemplateProfileDropdown } from "@/components/shared/TemplateProfileDropdown";
import type { IProductStore } from "@/types/product/productTypes";

interface BazaarHeaderProps {
  store: IProductStore;
  onCartOpen: () => void;
  cartItemsCount: number;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  onMessageVendor?: () => void;
  isMessagingLoading?: boolean;
}

export function BazaarHeader({
  store,
  onCartOpen,
  cartItemsCount,
  searchOpen,
  setSearchOpen,
  onMessageVendor,
  isMessagingLoading,
}: BazaarHeaderProps) {
  return (
    <header className="bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-neutral-800/50 sticky top-0 z-50 transition-colors px-2 sm:px-6 py-3">
      <div className="w-full flex items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <Link
            to={`/stores/${store.slug}`}
            className="flex items-center gap-3 shrink-0 min-w-0"
          >
            {store.logo && (
              <img
                src={store.logo}
                alt="logo"
                className="w-10 h-10 md:w-12 md:h-12 rounded-sm shrink-0 object-cover border border-slate-200 dark:border-neutral-800"
              />
            )}
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white truncate">
              {store.store_name}
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-xl relative group">
            <Input
              placeholder={`Search in ${store.store_name}...`}
              className="w-full pl-5 pr-12 h-11 border-2 border-slate-100 dark:border-neutral-900 focus-visible:border-indigo-600 focus-visible:ring-0 rounded-sm transition-all"
            />
            <Button
              size="icon"
              className="absolute right-0 top-0 h-11 w-11 bg-indigo-600 hover:bg-indigo-600/90 rounded-l-none rounded-r-sm"
            >
              <Search className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-slate-500 hover:bg-slate-100 dark:hover:bg-neutral-900 rounded-sm"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="p-2.5 md:p-3.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-sm hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm active:scale-95 group disabled:opacity-50"
            onClick={onMessageVendor}
            disabled={isMessagingLoading}
          >
            <Messages3 
              variant={isMessagingLoading ? "Outline" : "Bold"} 
              color="currentColor" 
              className={cn("w-5 h-5 md:w-6 md:h-6", isMessagingLoading && "animate-spin")} 
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative p-2.5 md:p-3.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-sm hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm active:scale-95 group"
            onClick={onCartOpen}
          >
            <ShoppingBag className="h-5 w-5 md:w-6 md:h-6" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-black text-white ring-2 ring-white dark:ring-black">
                {cartItemsCount}
              </span>
            )}
          </Button>

          <TemplateProfileDropdown
            buttonClassName="p-2.5 md:p-3.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-sm hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm active:scale-95"
            iconClassName="h-5 w-5 md:w-6 md:h-6"
          />
        </div>
      </div>

      {/* Mobile Search Expand */}
      {searchOpen && (
        <div className="md:hidden px-4 py-3 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-slate-100 dark:border-neutral-900 animate-in slide-in-from-top-2">
          <div className="relative flex gap-2">
            <Input
              placeholder={`Search in ${store.store_name}...`}
              className="flex-1 h-11 border-2 border-slate-100 dark:border-neutral-900 rounded-sm"
              autoFocus
            />
            <Button size="icon" className="h-11 w-11 bg-indigo-600 rounded-sm">
              <Search className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
