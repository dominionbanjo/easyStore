import type { StoreTemplateProps } from "./StoreTemplateProps";
import {
  Search,
  X,
  Loader2,
  Mail,
  Phone,
  ChevronRight,
  ShoppingCart,
  Star,
  MapPin,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { StoreProductsGrid } from "../StoreProductsGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { TemplateProfileDropdown } from "@/components/shared/TemplateProfileDropdown";

export default function BazaarTemplate({
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
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-900 font-sans text-slate-900 dark:text-slate-100 flex flex-col">
      {/* ─── MARKETPLACE HEADER ─── */}
      <header className="sticky top-0 z-50 bg-white dark:bg-neutral-950 border-b-4 border-[var(--theme-primary)] ">
        <div className="max-w-7xl mx-auto px-1.5 sm:px-4 h-20 md:h-24 flex items-center justify-between gap-3 sm:gap-6">
          <div className="flex items-center gap-4 shrink-0">
            {store?.logo ? (
              <div className="w-14 h-14 rounded-sm overflow-hidden bg-white  border-2 border-slate-100 dark:border-neutral-800">
                <img
                  src={store.logo ?? undefined}
                  alt={store.store_name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-sm bg-[var(--theme-primary)] flex items-center justify-center font-black text-white text-2xl ">
                {store?.store_name?.charAt(0).toUpperCase() || "B"}
              </div>
            )}
            <div className="hidden xs:block">
              <h1 className="text-lg sm:text-xl font-black tracking-tight leading-none text-[var(--theme-primary)]">
                {store?.store_name ?? "THE BAZAAR"}
              </h1>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1 dark:text-neutral-500">
                Official Marketplace
              </p>
            </div>
          </div>

          <div className="flex-1 max-w-xl relative">
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-5 h-5" />
              </span>
              <Input
                type="text"
                placeholder="Search..."
                className="w-full py-6 sm:py-7 pl-10 sm:pl-12 pr-10 sm:pr-12 bg-slate-100 dark:bg-neutral-900 border-2 border-transparent focus-visible:bg-white dark:focus-visible:bg-neutral-800 focus-visible:border-[var(--theme-primary)] rounded-sm font-bold transition-all text-sm sm:text-base "
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {isSearching && (
                  <Loader2 className="w-5 h-5 animate-spin text-[var(--theme-primary)]" />
                )}
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange("")}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-neutral-700 rounded-sm transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 sm:gap-4">
            <button
              onClick={onCartOpen}
              className="relative p-2.5 sm:p-3.5 rounded-sm bg-[var(--theme-primary)] text-white hover:scale-110 active:scale-95 transition-all"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 rounded-sm bg-white text-[var(--theme-primary)] text-[10px] sm:text-[11px] flex items-center justify-center font-black ring-2 ring-[var(--theme-primary)] ">
                  {cartItemsCount}
                </span>
              )}
            </button>
 
            <TemplateProfileDropdown
              buttonClassName="relative p-2.5 sm:p-3.5 rounded-sm bg-white dark:bg-neutral-800 border-2 border-slate-100 dark:border-neutral-800 text-[var(--theme-primary)]  hover:scale-110 active:scale-95 transition-all"
              iconClassName="w-5 h-5 sm:w-6 sm:h-6"
            />
          </div>
        </div>
      </header>

      {/* ─── BOLD MARKETPLACE HERO ─── */}
      {!searchQuery && !selectedCategory && activeTab === "products" && (
        <section className="relative w-full min-h-[450px] md:min-h-[550px] flex items-center bg-zinc-900 border-b-8 border-[var(--theme-primary)] overflow-hidden">
          {store.cover_image ? (
            <>
              <img
                src={store.cover_image}
                alt={store.store_name}
                className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-neutral-900">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--theme-primary)]/10 skew-x-12 transform translate-x-32" />
            </div>
          )}

          <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 py-12 md:py-20 w-full">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--theme-primary)] text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6 rounded-sm">
                Verified Merchant
              </div>
              <h2 className="text-6xl md:text-8xl font-[1000] text-white tracking-tighter leading-[0.8] mb-8 uppercase italic">
                {store.store_name}
              </h2>
              <p className="text-xl md:text-2xl font-bold text-zinc-300 mb-10 max-w-xl leading-snug">
                {store.description ||
                  "Quality goods for the modern shopper. Discover premium gear and daily deals."}
              </p>

              <div className="flex flex-wrap gap-6 items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">
                    Market Rating
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(Number(store.rating_average || 0)) ? "fill-[var(--theme-primary)] text-[var(--theme-primary)]" : "text-zinc-700"}`}
                        />
                      ))}
                    </div>
                    <span className="text-white font-black text-lg">
                      {Number(store.rating_average || 0).toFixed(1)}
                    </span>
                  </div>
                </div>

                {(store.address_city || store.address_country) && (
                  <div className="flex flex-col border-l-2 border-zinc-800 pl-6">
                    <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">
                      Located In
                    </span>
                    <div className="flex items-center gap-2 text-white font-black text-lg italic uppercase">
                      <MapPin className="w-4 h-4 text-[var(--theme-primary)]" />
                      {store.address_city || store.address_country}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="max-w-7xl mx-auto px-1.5 sm:px-4 py-8 md:py-12 flex-1 w-full">
        {/* TAB NAVIGATION */}
        <div className="flex gap-4 mb-12">
          <button
            onClick={() => {
              onTabChange("products");
              onCategorySelect(null);
            }}
            className={`px-5 py-3 md:px-8 md:py-4 rounded-sm font-black tracking-tighter text-sm md:text-lg transition-all ${
              activeTab === "products" && !selectedCategory
                ? "bg-[var(--theme-primary)] text-white  -[var(--theme-primary)]/20 translate-y-[-2px]"
                : "bg-white dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 border-b-4 border-slate-200 dark:border-neutral-950 hover:border-[var(--theme-primary)]"
            }`}
          >
            ALL PRODUCTS
          </button>
          <button
            onClick={() => onTabChange("categories")}
            className={`px-5 py-3 md:px-8 md:py-4 rounded-sm font-black tracking-tighter text-sm md:text-lg transition-all ${
              activeTab === "categories" || selectedCategory
                ? "bg-[var(--theme-primary)] text-white  -[var(--theme-primary)]/20 translate-y-[-2px]"
                : "bg-white dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 border-b-4 border-slate-200 dark:border-neutral-950 hover:border-[var(--theme-primary)]"
            }`}
          >
            COLLECTIONS
          </button>
        </div>

        {/* CATEGORIES VIEW */}
        {activeTab === "categories" && !selectedCategory && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {isCategoriesLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-64 rounded-sm bg-slate-200 dark:bg-neutral-800"
                  />
                ))
              : categories?.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => onCategorySelect(cat)}
                    className="group relative h-64 rounded-sm overflow-hidden bg-white dark:bg-neutral-800 border-4 border-slate-100 dark:border-neutral-800 hover:border-[var(--theme-primary)] transition-all flex items-center justify-center p-8 text-center"
                  >
                    <div className="relative z-10">
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter group-hover:scale-110 transition-transform">
                        {cat.name}
                      </h3>
                      <div className="w-12 h-1.5 bg-[var(--theme-primary)] mx-auto mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
                    </div>
                    <div className="absolute bottom-4 right-4 text-[var(--theme-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-8 h-8" />
                    </div>
                  </button>
                ))}
          </div>
        )}

        {/* PRODUCTS VIEW */}
        {(activeTab === "products" || selectedCategory) && (
          <div className="space-y-12">
            <div className="flex items-center gap-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
                {selectedCategory ? selectedCategory.name : "Featured Finds"}
              </h2>
              <div className="flex-1 h-1 bg-slate-200 dark:bg-neutral-800" />
            </div>

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
          </div>
        )}
      </main>

      {/* ─── MARKETPLACE FOOTER ─── */}
      <footer className="bg-white dark:bg-neutral-950 border-t-4 border-slate-200 dark:border-neutral-800 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center md:text-left">
          <div>
            <h4 className="text-2xl font-black text-[var(--theme-primary)] uppercase mb-4">
              {store?.store_name}
            </h4>
            <p className="font-bold text-slate-500 dark:text-neutral-400 leading-relaxed italic">
              "{store?.description || "Quality goods for the modern shopper."}"
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="space-y-4">
              {store?.email && (
                <div className="flex items-center gap-3 font-bold">
                  <Mail className="w-5 h-5 text-[var(--theme-primary)]" />
                  <span>{store.email}</span>
                </div>
              )}
              {store?.phone_number && (
                <div className="flex items-center gap-3 font-bold">
                  <Phone className="w-5 h-5 text-[var(--theme-primary)]" />
                  <span>{store.phone_number}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <div className="flex gap-4">
              {store?.social_links &&
                Object.entries(store.social_links).map(([platform, link]) => (
                  <a
                    key={platform}
                    href={link as string}
                    target="_blank"
                    rel="noreferrer"
                    className="w-12 h-12 rounded-sm bg-slate-100 dark:bg-neutral-900 flex items-center justify-center hover:bg-[var(--theme-primary)] hover:text-white transition-all font-black"
                  >
                    {platform.charAt(0).toUpperCase()}
                  </a>
                ))}
            </div>
            <p className="mt-8 text-xs font-black uppercase tracking-widest text-slate-400">
              © {new Date().getFullYear()} {store?.store_name}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
