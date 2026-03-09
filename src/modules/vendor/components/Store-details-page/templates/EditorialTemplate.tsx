import type { StoreTemplateProps } from "./StoreTemplateProps";
import {
  ArrowDown,
  Loader2,
  ArrowRight,
  Search,
  X,
  ShoppingBag,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { StoreProductsGrid } from "../StoreProductsGrid";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditorialTemplate({
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
  // Editorial aesthetic:
  // - High-end fashion magazine look
  // - Large typography, minimalist grid
  // - Cream/Off-white background (#FDFBF7)

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-[#FDFBF7] font-serif selection:bg-[var(--theme-primary)] selection:text-white">
      {/* ─── MAGAZINE HEADER ─── */}
      <header className="w-full py-10 md:py-16 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex flex-col items-center md:items-start text-center md:text-left relative">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[10px] tracking-[0.5em] uppercase font-sans font-bold opacity-50">
                  The New Collection
                </span>
                <div className="h-px w-12 bg-zinc-200 dark:bg-zinc-800" />
                <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-black">
                  VOL. {new Date().getFullYear().toString().substring(2)}
                </span>
              </div>
              <h1 className="text-7xl md:text-8xl lg:text-10xl font-black tracking-tighter leading-[0.8] lowercase mb-4 relative z-10">
                {store?.store_name ?? "Editorial"}
              </h1>
              <div className="flex items-center gap-3 text-[10px] font-sans font-bold tracking-[0.2em] uppercase opacity-40">
                <span>
                  Issue Nº{" "}
                  {Math.floor(Number(store?.rating_average || 4.5) * 10)}
                </span>
                <span>•</span>
                <span>Published in Lagos</span>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-10">
              {store?.logo ? (
                <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img
                    src={store.logo ?? undefined}
                    alt={store.store_name}
                    className="w-20 h-20 md:w-28 md:h-28 object-contain"
                  />
                </div>
              ) : (
                <div className="w-28 h-28 border-2 border-zinc-900 dark:border-white p-2 rotate-3">
                  <div className="w-full h-full bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 text-3xl font-black italic">
                    {store?.store_name?.charAt(0)}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-12 text-xs md:text-sm font-sans font-bold tracking-widest uppercase">
                <button
                  onClick={() => {
                    onTabChange("products");
                    onCategorySelect(null);
                  }}
                  className={`border-b-2 transition-all ${activeTab === "products" && !selectedCategory ? "border-current pb-1" : "border-transparent opacity-40 hover:opacity-100"}`}
                >
                  Gallery
                </button>
                <button
                  onClick={() => onTabChange("categories")}
                  className={`border-b-2 transition-all ${activeTab === "categories" || selectedCategory ? "border-current pb-1" : "border-transparent opacity-40 hover:opacity-100"}`}
                >
                  Collections
                </button>
                <button
                  onClick={onCartOpen}
                  className="relative group flex items-center gap-3 border-b-2 border-transparent hover:border-current pb-1 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Bag
                  {cartItemsCount > 0 && (
                    <span className="ml-1 opacity-60">({cartItemsCount})</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-20 md:mt-32 border-l-4 border-zinc-900 dark:border-white pl-8 md:pl-12 max-w-3xl">
            <p className="text-2xl md:text-4xl font-medium leading-tight italic opacity-90 mb-12">
              "{store?.description || "An exploration of form and function."}"
            </p>
            <div
              className="inline-flex items-center gap-6 group cursor-pointer hover:opacity-50 transition-opacity"
              onClick={() => {
                const target = document.getElementById("editorial-grid");
                target?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div className="text-[10px] md:text-xs font-sans font-black tracking-[0.5em] uppercase pb-1 overflow-hidden">
                <span className="block transform group-hover:translate-x-4 transition-transform duration-500">
                  Step Into The Archive
                </span>
              </div>
              <ArrowDown className="w-5 h-5 group-hover:translate-y-2 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </header>

      {/* ─── SEARCH SECTION ─── */}
      <section className="border-b border-zinc-200 dark:border-zinc-800 py-12 md:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
            <div className="flex-1 max-w-3xl relative group">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl">
                <Search className="w-8 h-8 opacity-20 group-focus-within:opacity-100 transition-opacity" />
              </span>
              <Input
                type="text"
                placeholder="FIND SOMETHING"
                className="w-full border-none bg-transparent py-8 pl-12 text-2xl md:text-4xl font-black uppercase tracking-tighter placeholder:text-zinc-200 dark:placeholder:text-zinc-800 focus-visible:ring-0 transition-all font-serif"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                {isSearching && (
                  <Loader2 className="w-8 h-8 animate-spin opacity-40 text-[var(--theme-primary)]" />
                )}
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange("")}
                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>

            <div className="hidden lg:block shrink-0 rotate-90 transform-origin-left">
              <span className="text-[10px] font-sans font-bold tracking-[0.8em] opacity-10 uppercase whitespace-nowrap">
                {store?.store_name} — EST{" "}
                {new Date(store?.created_at || Date.now()).getFullYear()}
              </span>
            </div>
          </div>
        </div>
      </section>

      <main
        id="editorial-grid"
        className="max-w-7xl mx-auto px-6 py-20 md:py-32"
      >
        {/* COLLECTIONS VIEW */}
        {activeTab === "categories" && !selectedCategory && (
          <div className="space-y-32">
            {isCategoriesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-[600px] bg-zinc-100 dark:bg-zinc-900 rounded-none"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-32">
                {categories?.map((cat, i: number) => (
                  <button
                    key={cat.id}
                    onClick={() => onCategorySelect(cat)}
                    className={`group text-left flex flex-col ${i % 2 !== 0 ? "md:mt-48" : ""}`}
                  >
                    <div className="relative aspect-[3/4] mb-8 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                      <div className="absolute inset-0 bg-[var(--theme-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="absolute inset-0 flex items-center justify-center p-12 lg:p-20 text-center border border-zinc-200/50 dark:border-zinc-800/50 group-hover:border-zinc-900 dark:group-hover:border-white transition-all duration-700">
                        <span className="text-4xl md:text-5xl lg:text-7xl font-serif italic tracking-tighter leading-none transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                          {cat.name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-b-2 border-zinc-900 dark:border-white pb-6 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left">
                      <span className="text-sm font-sans font-black uppercase tracking-widest">
                        Access Collection
                      </span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS VIEW */}
        {(activeTab === "products" || selectedCategory) && (
          <div className="space-y-24">
            <div className="flex flex-col gap-8 pb-12 border-b-4 border-zinc-900 dark:border-white">
              <h2 className="text-5xl md:text-9xl font-black tracking-tighter leading-none">
                {selectedCategory ? selectedCategory.name : "Highlights"}
              </h2>
              <div className="flex items-center justify-between text-xs md:text-sm font-sans font-semibold tracking-[0.2em] uppercase opacity-70">
                {selectedCategory && (
                  <button
                    onClick={() => onCategorySelect(null)}
                    className="hover:opacity-50 transition-opacity flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Archive All
                  </button>
                )}
                <span>{pagination?.total || 0} ITEMS IN LIST</span>
              </div>
            </div>

            <StoreProductsGrid
              key={productsKey}
              products={products}
              pagination={pagination}
              isLoading={isProductsLoading}
              isFetching={isProductsFetching}
              selectedCategory={selectedCategory}
              onBackToCategories={() => onCategorySelect(null)}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </main>

      {/* ─── EDITORIAL FOOTER ─── */}
      <footer className="w-full py-32 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between gap-24">
            <div className="max-w-xl">
              <h4 className="text-5xl md:text-7xl font-black tracking-tighter lowercase mb-8">
                {store?.store_name}
              </h4>
              <p className="text-lg font-serif italic opacity-70">
                Crafted for excellence, curated for the modern individual. Our
                mission remains unwavering in the pursuit of design that moves
                beyond the transient.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-16 font-sans text-xs md:text-sm font-bold tracking-widest uppercase">
              <div className="flex flex-col gap-6">
                <span className="opacity-30">Connect</span>
                {store?.social_links &&
                  Object.entries(store.social_links).map(([p, link]) => (
                    <a
                      key={p}
                      href={link as string}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:opacity-50 transition-opacity"
                    >
                      {p}
                    </a>
                  ))}
              </div>
              <div className="flex flex-col gap-6">
                <span className="opacity-30">Support</span>
                {store?.email && (
                  <a
                    href={`mailto:${store.email}`}
                    className="hover:opacity-50 transition-opacity"
                  >
                    Email Us
                  </a>
                )}
                {store?.phone_number && (
                  <a
                    href={`tel:${store.phone_number}`}
                    className="hover:opacity-50 transition-opacity"
                  >
                    Contact
                  </a>
                )}
              </div>
              <div className="flex flex-col gap-6">
                <span className="opacity-30">Manifesto</span>
                <span>© {new Date().getFullYear()}</span>
                <span className="opacity-40 font-normal">
                  All Rights Reserved
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
