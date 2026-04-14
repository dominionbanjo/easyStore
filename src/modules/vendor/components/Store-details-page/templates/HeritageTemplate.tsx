import type { StoreTemplateProps } from "./StoreTemplateProps";
import { Search, X, Loader2, ShoppingCart, TwitterIcon } from "lucide-react";
import {
  Call,
  Instagram,
  Facebook,
  Youtube,
  Global,
  InfoCircle,
} from "iconsax-react";
import { Input } from "@/components/ui/input";
import { StoreProductsGrid } from "../StoreProductsGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { TemplateProfileDropdown } from "@/components/shared/TemplateProfileDropdown";
import { StoreContactModal } from "../StoreContactModal";
import { useState } from "react";

export default function HeritageTemplate({
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
  // Heritage aesthetic:
  // - Earthy colors, warm background
  // - Elegant serif typography for headers
  // - rounded-sm corners and wide spacing
  // - Focus on craftsmanship and simplicity

  const [contactOpen, setContactOpen] = useState(false);

  const establishedYear = new Date(
    store?.created_at || Date.now(),
  ).getFullYear();

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#1E1B18] text-[#3D352B] dark:text-[#EAE3DB] font-sans">
      {/* ─── ELEGANT HEADER ─── */}
      <header className="relative w-full pt-16 pb-12 px-2 sm:px-6 flex flex-col items-center justify-center text-center border-b border-[#3D352B]/10 dark:border-[#EAE3DB]/10 overflow-hidden">
        {/* Cart Icon (Absolute Positioned for Elegance) */}
        <div className="absolute top-4 sm:top-8 right-2 sm:right-8 z-10 flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setContactOpen(true)}
            className="relative text-[#3D352B] dark:text-[#EAE3DB] hover:scale-110 active:scale-95 group transition-all"
            aria-label="Store contact info"
          >
            <InfoCircle variant="Bold" color="currentColor" className="w-5 h-5" />
          </button>

          <button
            onClick={onCartOpen}
            className="group relative p-4 rounded-sm bg-white dark:bg-[#2C2622] border border-[#EADDCE] dark:border-[#3D352B]  hover: transition-all"
          >
            <ShoppingCart className="w-5 h-5 text-[#3D352B] dark:text-[#EAE3DB]" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-sm bg-[var(--theme-primary)] text-white text-[10px] flex items-center justify-center font-bold ring-2 ring-white dark:ring-[#1E1B18] ">
                {cartItemsCount}
              </span>
            )}
            <div className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              <span className="text-[10px] tracking-widest uppercase font-bold text-[#3D352B]/60 dark:text-[#EAE3DB]/60">
                Your Basket
              </span>
            </div>
          </button>

          <TemplateProfileDropdown
            buttonClassName="p-4 rounded-sm bg-white dark:bg-[#2C2622] border border-[#EADDCE] dark:border-[#3D352B]  hover: transition-all"
            iconClassName="w-5 h-5 text-[#3D352B] dark:text-[#EAE3DB]"
          />
        </div>

        <div className="w-16 h-px bg-[#3D352B]/30 dark:bg-[#EAE3DB]/30 mb-8" />

        {store?.logo ? (
          <img
            src={store.logo ?? undefined}
            alt={store.store_name}
            className="w-24 h-24 rounded-sm object-cover  mb-6 border-4 border-white/50 dark:border-white/5"
          />
        ) : (
          <div className="w-20 h-20 rounded-sm bg-[#EADDCE] dark:bg-[#2C2622] flex items-center justify-center font-serif text-[#3D352B] dark:text-[#EAE3DB] text-2xl mb-6 ">
            {store?.store_name?.charAt(0) || "H"}
          </div>
        )}

        <h1 className="text-4xl md:text-6xl font-serif text-[#2C2622] dark:text-[#F4EDE4] mb-4">
          {store?.store_name ?? "Heritage Market"}
        </h1>

        <p className="text-sm tracking-[0.2em] uppercase opacity-70 mb-6 font-medium">
          Est. {establishedYear} &bull;{" "}
          {[store?.address_city, store?.address_country]
            .filter(Boolean)
            .join(", ") || "Global"}
        </p>

        <p className="max-w-xl mx-auto text-lg opacity-80 leading-relaxed font-serif italic">
          {store?.description ??
            "Purveyors of fine artisanal goods crafted with care and tradition."}
        </p>
      </header>

      {/* ─── NAVIGATION & SEARCH ─── */}
      <div className="max-w-5xl mx-auto px-2 sm:px-6 py-8 md:py-12 flex flex-col items-center">
        {/* ─── TABS ─── */}
        <div className="mt-12 md:mt-16 bg-white dark:bg-[#1E1A17] rounded-sm p-4 md:p-12  border border-[#EADDCE] dark:border-[#3D352B]">
          <div className="flex justify-center gap-8 mb-12">
            <button
              onClick={() => {
                onCategorySelect(null);
                onTabChange("products");
              }}
              className={`text-sm tracking-[0.15em] uppercase pb-2 transition-all ${
                activeTab === "products"
                  ? "border-b-2 border-[#3D352B] dark:border-[#EAE3DB] font-bold"
                  : "border-b-2 border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              All Goods
            </button>
            <button
              onClick={() => onTabChange("categories")}
              className={`text-sm tracking-[0.15em] uppercase pb-2 transition-all ${
                activeTab === "categories"
                  ? "border-b-2 border-[#3D352B] dark:border-[#EAE3DB] font-bold"
                  : "border-b-2 border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              Collections
            </button>
          </div>

          <div className="w-full max-lg relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D352B]/40 dark:text-[#EAE3DB]/40">
              <Search className="w-4 h-4" />
            </span>
            <Input
              type="text"
              placeholder="Search our catalog..."
              className="w-full pl-12 pr-12 py-6 bg-white dark:bg-[#2C2622] border-[#EADDCE] dark:border-[#3D352B] rounded-sm focus-visible:ring-1 focus-visible:ring-[#3D352B]  text-center placeholder:text-center text-base"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[#3D352B]/40 dark:text-[#EAE3DB]/40">
              {isSearching && (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              )}
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="hover:text-primary transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── SHOWCASE MAIN ─── */}
      <main className="max-w-[1400px] mx-auto px-1 sm:px-8 py-8 md:py-12">
        {activeTab === "categories" && !selectedCategory && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {isCategoriesLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-64 rounded-sm bg-[#F4EDE4] dark:bg-[#3D352B]/20"
                  />
                ))
              : categories?.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => onCategorySelect(cat)}
                    className="group flex flex-col items-center justify-center bg-white dark:bg-[#1E1A17] rounded-sm p-4 md:p-12  border border-[#EADDCE] dark:border-[#3D352B] text-left hover: transition-all hover:-translate-y-1 hover:border-[var(--theme-primary)]"
                  >
                    <div className="w-16 h-16 rounded-sm bg-[#F4EDE4] dark:bg-[#3D352B]/50 text-[var(--theme-primary)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <span className="font-serif text-2xl italic">
                        {cat.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif text-[#2C2622] dark:text-[#EAE3DB] group-hover:text-[var(--theme-primary)] transition-colors text-center">
                      {cat.name}
                    </h3>
                  </button>
                ))}
          </div>
        )}

        {(activeTab === "products" || selectedCategory) && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            {selectedCategory && (
              <div className="mb-10 text-center">
                <h2
                  className="text-3xl font-serif text-[#2C2622] dark:text-[#F4EDE4] mb-2 cursor-pointer inline-flex items-center gap-2 group transition-opacity"
                  onClick={() => onCategorySelect(null)}
                >
                  <span className="text-[#3D352B]/40 dark:text-[#EAE3DB]/40 group-hover:-translate-x-1 transition-transform">
                    ←
                  </span>
                  {selectedCategory.name}
                </h2>
                <p className="text-sm tracking-widest uppercase opacity-60">
                  The Collection
                </p>
              </div>
            )}

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

      {/* ─── FOOTER ─── */}
      <footer className="w-full bg-[#EADDCE]/30 dark:bg-[#1A1714] py-16 px-6 text-center">
        <div className="w-12 h-px bg-[#3D352B]/30 dark:bg-[#EAE3DB]/30 mx-auto mb-8" />
        <p className="font-serif italic text-lg opacity-80 mb-6">
          Thank you for visiting {store?.store_name}.
        </p>

        {/* Social links */}
        {store?.social_links && Object.keys(store.social_links).length > 0 && (
          <div className="flex justify-center gap-3 mb-6">
            {Object.entries(store.social_links).map(([platform, link]) => {
              const key = platform.toLowerCase();
              let Icon = Global;
              if (key.includes("instagram")) Icon = Instagram;
              else if (key.includes("facebook")) Icon = Facebook;
              else if (key.includes("twitter") || key.includes("x")) Icon = TwitterIcon;
              else if (key.includes("youtube")) Icon = Youtube;
              const isLucide = Icon === TwitterIcon;
              return (
                <a
                  key={platform}
                  href={link as string}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-sm bg-[#EADDCE] dark:bg-[#2C2622] hover:bg-[var(--theme-primary)]/10 border border-[#EADDCE] dark:border-[#3D352B] hover:border-[var(--theme-primary)]/40 transition-all text-[var(--theme-primary)]"
                  aria-label={platform}
                >
                  {isLucide ? (
                    <Icon className="w-4 h-4" />
                  ) : (
                    <Icon variant="Bold" color="currentColor" className="w-4 h-4" />
                  )}
                </a>
              );
            })}
          </div>
        )}

        {/* Phone */}
        {store?.phone_number && (
          <a
            href={`tel:${store.phone_number}`}
            className="inline-flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100 hover:text-[var(--theme-primary)] transition-all mb-6"
          >
            <Call variant="Bold" color="var(--theme-primary)" className="w-4 h-4" />
            {store.phone_number}
          </a>
        )}

        <button
          className="block mx-auto text-xs uppercase tracking-[0.2em] font-medium opacity-60 hover:opacity-100 transition-opacity"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Return to top
        </button>
      </footer>

      <StoreContactModal
        store={store}
        open={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </div>
  );
}
