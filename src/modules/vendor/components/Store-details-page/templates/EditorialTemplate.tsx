import type { StoreTemplateProps } from "./StoreTemplateProps";
import {
  Loader2,
  ArrowRight,
  Search,
  X,
  ShoppingCart,
  TwitterIcon,
} from "lucide-react";
import {
  Youtube,
  Global,
  InfoCircle,
  Call,
  Instagram,
  Facebook,
  Messages3,
} from "iconsax-react";
import { Input } from "@/components/ui/input";
import { StoreProductsGrid } from "../StoreProductsGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { TemplateProfileDropdown } from "@/components/shared/TemplateProfileDropdown";
import { StoreContactModal } from "../StoreContactModal";
import { useState } from "react";

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
  onMessageVendor,
  isMessagingLoading,
}: StoreTemplateProps) {
  const [contactOpen, setContactOpen] = useState(false);
  // Editorial aesthetic:
  // - High-end fashion magazine look
  // - Large typography, minimalist grid
  // - Cream/Off-white background (#FDFBF7)

  return (
    <>
      <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-[#FDFBF7] font-serif selection:bg-[var(--theme-primary)] selection:text-white">
        {/* ─── MAGAZINE HEADER ─── */}
        <header className="sticky top-0 z-50 bg-white dark:bg-neutral-950 border-b-4 border-[var(--theme-primary)] py-4">
          <div className="w-full px-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center justify-between w-full md:w-auto min-w-0">
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter lowercase flex-1 truncate pr-4">
                {store?.store_name ?? "Editorial"}
              </h1>

              {/* Mobile Actions */}
              <div className="flex md:hidden items-center gap-2 shrink-0">
                <button
                  onClick={() => setContactOpen(true)}
                  className="p-2 hover:scale-110 active:scale-95 transition-all"
                  aria-label="Store contact information"
                >
                  <InfoCircle variant="Bold" color="currentColor" className="w-5 h-5" />
                </button>
                <button
                  onClick={onCartOpen}
                  className="relative p-2 bg-[var(--theme-primary)] text-white rounded-sm hover:scale-110 active:scale-95 transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-sm bg-white text-[var(--theme-primary)] text-[9px] flex items-center justify-center font-black ring-1 ring-[var(--theme-primary)]">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 text-xs md:text-sm font-sans font-bold tracking-widest uppercase w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => {
                    onTabChange("products");
                    onCategorySelect(null);
                  }}
                  className={`border-b-2 whitespace-nowrap transition-all ${activeTab === "products" && !selectedCategory ? "border-current pb-1" : "border-transparent opacity-40 hover:opacity-100"}`}
                >
                  All Products
                </button>
                <button
                  onClick={() => onTabChange("categories")}
                  className={`border-b-2 whitespace-nowrap transition-all ${activeTab === "categories" || selectedCategory ? "border-current pb-1" : "border-transparent opacity-40 hover:opacity-100"}`}
                >
                  Collections
                </button>
              </div>
              
              {/* Desktop Actions */}
              <div className="hidden md:flex shrink-0 items-center gap-4">
                <button
                  onClick={() => setContactOpen(true)}
                  className="hover:scale-110 active:scale-95 group transition-all"
                  aria-label="Store contact information"
                >
                  <InfoCircle variant="Bold" color="currentColor" className="w-6 h-6" />
                </button>
                
                <button
                  onClick={onCartOpen}
                  className="relative p-3 rounded-sm bg-[var(--theme-primary)] text-white hover:-translate-y-0.5 active:scale-95 transition-all"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-sm bg-white text-[var(--theme-primary)] text-[11px] flex items-center justify-center font-black ring-2 ring-[var(--theme-primary)]">
                      {cartItemsCount}
                    </span>
                  )}
                </button>

                <TemplateProfileDropdown
                  buttonClassName="relative p-3 rounded-sm bg-white dark:bg-neutral-800 border-2 border-slate-100 dark:border-neutral-800 text-[var(--theme-primary)] hover:-translate-y-0.5 active:scale-95 transition-all"
                  iconClassName="w-5 h-5"
                />

                {onMessageVendor && (
                  <button
                    onClick={onMessageVendor}
                    disabled={isMessagingLoading}
                    className="p-3 rounded-sm bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50"
                    title="Message Vendor"
                  >
                    {isMessagingLoading ? (
                       <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Messages3 variant="Bold" color="currentColor" className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ─── SEARCH SECTION ─── */}
        <section className="border-b border-zinc-200 dark:border-zinc-800 py-12 md:py-20 overflow-hidden">
          <div className="relative z-10 max-w-[1600px] mx-auto px-4 py-12 md:py-20 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
              <div className="flex-1 max-w-3xl relative group">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl">
                  <Search className="w-8 h-8 opacity-20 group-focus-within:opacity-100 transition-opacity" />
                </span>
                <Input
                  type="text"
                  placeholder="Search market..."
                  className="w-full py-6 sm:py-7 pl-10 sm:pl-12 pr-10 sm:pr-12 bg-slate-100 dark:bg-neutral-900 border-2 border-transparent focus-visible:bg-white dark:focus-visible:bg-neutral-800 focus-visible:border-[var(--theme-primary)] rounded-sm font-bold transition-all text-sm sm:text-base "
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
                      className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-sm transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <main className="max-w-[1600px] mx-auto px-4 py-8 md:py-12 flex-1 w-full">
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
                          View Collection
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
                      Back to Collections
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
        <footer className="w-full bg-white dark:bg-neutral-900 border-t border-zinc-200 dark:border-zinc-800 pt-16 md:pt-24 pb-12 md:pb-20 mt-12 md:mt-24">
          <div className="max-w-[1600px] mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-16 font-sans text-xs md:text-sm font-bold tracking-widest uppercase">
              <div className="flex flex-col gap-4">
                <span className="opacity-30">Connect</span>
                {store?.social_links &&
                  Object.entries(store.social_links).map(([p, link]) => {
                    const key = p.toLowerCase();
                    let Icon = Global;
                    if (key.includes("instagram")) Icon = Instagram;
                    else if (key.includes("facebook")) Icon = Facebook;
                    else if (key.includes("twitter") || key.includes("x"))
                      Icon = TwitterIcon;
                    else if (key.includes("youtube")) Icon = Youtube;
                    const isLucide = Icon === TwitterIcon;
                    return (
                      <a
                        key={p}
                        href={link as string}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 hover:opacity-50 transition-opacity"
                        aria-label={p}
                      >
                        {isLucide ? (
                          <Icon className="w-4 h-4" />
                        ) : (
                          <Icon variant="Bold" color="currentColor" className="w-4 h-4" />
                        )}
                        <span className="capitalize">{p}</span>
                      </a>
                    );
                  })}
              </div>
              <div className="flex flex-col gap-4">
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
                    className="flex items-center gap-2 hover:opacity-50 transition-opacity"
                  >
                    <Call variant="Bold" color="currentColor" className="w-4 h-4" />
                    {store.phone_number}
                  </a>
                )}
              </div>
              <div className="flex flex-col gap-6">
                <span className="opacity-30">Manifesto</span>
                <span>© {new Date().getFullYear()}</span>
                <span className="opacity-40 font-normal">All Rights Reserved</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <StoreContactModal
        store={store}
        open={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </>
  );
}
