import type { StoreTemplateProps } from "./StoreTemplateProps";
import { Search, X, Loader2, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StoreProductsGrid } from "../StoreProductsGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { TemplateProfileDropdown } from "@/components/shared/TemplateProfileDropdown";

export default function VanguardTemplate({
  store,
  categories,
  products,
  pagination,
  isProductsLoading,
  isProductsFetching,
  isCategoriesLoading,
  activeTab,
  selectedCategory,
  searchQuery,
  isSearching,
  productsKey,
  onTabChange,
  onCategorySelect,
  onSearchChange,
  onPageChange,
  onCartOpen,
  cartItemsCount,
}: StoreTemplateProps) {
  // Vanguard aesthetic:
  // - Large oversized banner image acting as background
  // - Centered logo and text overlapping banner
  // - Minimalist tabs mapping
  // - Borderless product grid

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 font-serif pb-24">
      <div className="fixed top-0 right-0 z-[60] p-6 md:p-10 flex items-center gap-4 pointer-events-none">
        <button
          onClick={onCartOpen}
          className="pointer-events-auto relative p-4 bg-white/10 dark:bg-black/20 backdrop-blur-3xl border border-white/20 dark:border-white/10 rounded-full text-zinc-900 dark:text-zinc-100 shadow-2xl hover:scale-110 active:scale-95 transition-all group"
        >
          <ShoppingCart className="w-6 h-6" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-[var(--theme-primary)] text-white text-[11px] flex items-center justify-center font-black ring-2 ring-white dark:ring-black shadow-lg">
              {cartItemsCount}
            </span>
          )}
        </button>

        <TemplateProfileDropdown
          buttonClassName="pointer-events-auto p-4 bg-white/10 dark:bg-black/20 backdrop-blur-3xl border border-white/20 dark:border-white/10 rounded-full text-zinc-900 dark:text-zinc-100 shadow-2xl hover:scale-110 active:scale-95 transition-all"
          iconClassName="w-6 h-6"
        />
      </div>

      {/* OVERSIZED HERO */}
      <div className="relative w-full h-[60vh] md:h-[70vh] bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center justify-center overflow-hidden">
        {store?.cover_image ? (
          <img
            src={store.cover_image ?? undefined}
            alt={store.store_name}
            className="absolute inset-0 w-full h-full object-cover opacity-60 dark:opacity-40"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent dark:from-black dark:via-black/50" />

        <div className="relative z-10 flex flex-col items-center text-center px-4">
          {store?.logo && (
            <img
              src={store.logo ?? undefined}
              alt="Store Logo"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-xl mb-6 border-4 border-white dark:border-zinc-800"
            />
          )}
          <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-4 text-zinc-900 dark:text-white">
            {store?.store_name ?? "Vanguard Store"}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300 text-lg md:text-xl max-w-2xl font-sans font-light">
            {store?.description ?? "Minimalist and curated collections."}
          </p>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 mt-12">
        {/* DISCREET TABS */}
        <div className="flex justify-center border-b border-zinc-200 dark:border-zinc-800 mb-12">
          <button
            onClick={() => onTabChange("products")}
            className={`pb-4 px-8 text-sm uppercase tracking-widest transition-colors ${activeTab === "products" ? "border-b-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white font-medium" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"}`}
          >
            Collections
          </button>
          <button
            onClick={() => onTabChange("categories")}
            className={`pb-4 px-8 text-sm uppercase tracking-widest transition-colors ${activeTab === "categories" ? "border-b-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white font-medium" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"}`}
          >
            Categories
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="max-w-2xl mx-auto mb-16 relative">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[var(--theme-primary)]">
            <Search className="w-5 h-5" />
          </span>
          <Input
            type="text"
            placeholder="Search collection..."
            className="w-full border-0 border-b border-zinc-200 dark:border-zinc-800 rounded-none bg-transparent pl-10 pr-10 py-4 text-xl font-light focus-visible:ring-0 focus-visible:border-zinc-900 dark:focus-visible:border-white transition-all text-zinc-900 dark:text-zinc-100"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-zinc-400">
            {isSearching && <Loader2 className="w-5 h-5 animate-spin" />}
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="mt-8 font-sans">
          {activeTab === "categories" && !selectedCategory && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isCategoriesLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-48 w-full rounded-none" />
                  ))
                : categories?.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => onCategorySelect(cat)}
                      className="group relative h-48 w-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 flex flex-col items-center justify-center p-6 transition-all"
                    >
                      <h3 className="text-2xl font-light text-zinc-900 dark:text-zinc-100 tracking-wide uppercase">
                        {cat.name}
                      </h3>
                      <div className="mt-4 w-12 h-[1px] bg-[var(--theme-primary)] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-500" />
                    </button>
                  ))}
            </div>
          )}

          {(activeTab === "products" || selectedCategory) && (
            <StoreProductsGrid
              key={productsKey}
              products={products}
              pagination={pagination}
              isLoading={isProductsLoading}
              isFetching={isProductsFetching}
              selectedCategory={selectedCategory}
              onBackToCategories={() => {
                onCategorySelect(null);
              }}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
