import { Link } from "react-router-dom";
import { ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateProfileDropdown } from "@/components/shared/TemplateProfileDropdown";
import type { IProductStore } from "@/types/product/productTypes";
import type { UIProduct } from "@/modules/vendor/utils/productAdapter";

interface DefaultHeaderProps {
  store: IProductStore;
  uiProduct: UIProduct;
  onCartOpen: () => void;
  cartItemsCount: number;
}

export function DefaultHeader({
  store,
  uiProduct,
  onCartOpen,
  cartItemsCount,
}: DefaultHeaderProps) {
  return (
    <>
      <header className="bg-white/80 dark:bg-black/80 py-6 px-4 sm:px-6 lg:px-8 sticky top-0 md:static z-40 backdrop-blur-xl md:backdrop-blur-none md:bg-transparent border-b border-zinc-200/50 md:border-none transition-colors">
        <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <Link
              to={`/stores/${store.slug}`}
              className="hover:text-[var(--theme-primary)] transition-colors whitespace-nowrap"
            >
              Store Home
            </Link>
            <ChevronRight className="w-4 h-4 shrink-0" />
            {uiProduct.categoryId ? (
              <Link
                to={`/stores/${store.slug}?category=${uiProduct.categoryId}`}
                className="hover:text-[var(--theme-primary)] transition-colors whitespace-nowrap"
              >
                {uiProduct.category}
              </Link>
            ) : (
              <span className="text-zinc-400 whitespace-nowrap">
                {uiProduct.category}
              </span>
            )}
            <ChevronRight className="w-4 h-4 shrink-0" />
            <span className="text-zinc-900 dark:text-white font-semibold truncate max-w-[100px] sm:max-w-[200px] md:max-w-[300px]">
              {uiProduct.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative p-2 flex-shrink-0 hover:bg-[var(--theme-primary)]/10 text-zinc-900 dark:text-white"
              onClick={onCartOpen}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-sm bg-[var(--theme-primary)] text-[10px] font-black text-white ring-2 ring-white dark:ring-black  tabular-nums">
                  {cartItemsCount}
                </span>
              )}
            </Button>

            <TemplateProfileDropdown
              buttonClassName="relative p-2 flex-shrink-0 hover:bg-[var(--theme-primary)]/10 text-zinc-900 dark:text-white rounded-sm transition-colors"
              iconClassName="h-5 w-5"
            />
          </div>
        </div>
      </header>
    </>
  );
}
