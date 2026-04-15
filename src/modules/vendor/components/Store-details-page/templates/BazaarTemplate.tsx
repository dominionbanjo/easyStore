import type { StoreTemplateProps } from "./StoreTemplateProps";
import {
  Search,
  X,
  Loader2,
  Mail,
  Phone,
  ShoppingCart,
  Star,
  MapPin,
  TwitterIcon,
} from "lucide-react";
import {
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
  const [contactOpen, setContactOpen] = useState(false);
  const hasBanner = !!store.cover_image;

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-black text-slate-900 dark:text-white font-sans pb-24">
      {/* ─── BAZAAR HEADER ─── */}
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b-4 border-slate-100 dark:border-neutral-900 px-1.5 sm:px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {store.logo ? (
              <img
                src={store.logo}
                alt={store.store_name}
                className="w-10 h-10 md:w-12 md:h-12 rounded-sm object-cover border-2 border-slate-200 dark:border-neutral-800"
              />
            ) : (
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-sm bg-[var(--theme-primary)] flex items-center justify-center font-black text-white text-xl">
                {store.store_name?.charAt(0)}
              </div>
            )}
            <h1 className="text-xl md:text-2xl font-[1000] italic tracking-tighter uppercase text-slate-900 dark:text-white truncate max-w-[150px] md:max-w-none">
              {store.store_name}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onCartOpen}
              className="relative p-2.5 sm:p-4 bg-slate-100 dark:bg-neutral-900 rounded-sm hover:bg-[var(--theme-primary)] hover:text-white transition-all group"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 rounded-sm bg-black dark:bg-white text-white dark:text-black text-[10px] sm:text-[11px] flex items-center justify-center font-black ring-2 ring-white dark:ring-black">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <TemplateProfileDropdown
              buttonClassName="p-2.5 sm:p-4 bg-slate-100 dark:bg-neutral-900 rounded-sm hover:bg-[var(--theme-primary)] hover:text-white transition-all"
              iconClassName="w-5 h-5 sm:w-6 sm:h-6"
            />
          </div>
        </div>
      </header>

      {/* ─── BAZAAR HERO ─── */}
      {!searchQuery && !selectedCategory && activeTab === "products" && (
        <section className="relative w-full h-[60vh] md:h-[70vh] bg-black overflow-hidden group">
          {hasBanner ? (
            <>
              <img
                src={store.cover_image ?? undefined}
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

          <button
            onClick={() => setContactOpen(true)}
            className="absolute top-4 right-4 z-20 text-white hover:scale-110 active:scale-95 group transition-all drop-shadow-lg"
            aria-label="Store contact information"
          >
            <InfoCircle variant="Bold" color="white" className="w-5 h-5" />
          </button>

          <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 py-12 md:py-20 w-full">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 flex-wrap">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--theme-primary)] text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-sm">
                  Verified Merchant
                </div>
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
                ? "bg-[var(--theme-primary)] text-white translate-y-[-2px]"
                : "bg-white dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 border-b-4 border-slate-200 dark:border-neutral-950 hover:border-[var(--theme-primary)]"
            }`}
          >
            ALL PRODUCTS
          </button>
          <button
            onClick={() => onTabChange("categories")}
            className={`px-5 py-3 md:px-8 md:py-4 rounded-sm font-black tracking-tighter text-sm md:text-lg transition-all ${
              activeTab === "categories" || selectedCategory
                ? "bg-[var(--theme-primary)] text-white translate-y-[-2px]"
                : "bg-white dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 border-b-4 border-slate-200 dark:border-neutral-950 hover:border-[var(--theme-primary)]"
            }`}
          >
            COLLECTIONS
          </button>
        </div>

        {/* SEARCH BAR (FIXED POSITION OR FLOATING) */}
        <div className="max-w-4xl mx-auto mb-16 relative group">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--theme-primary)]">
            <Search className="w-6 h-6 " />
          </span>
          <Input
            type="text"
            placeholder="Search bazaar..."
            className="w-full h-16 md:h-20 bg-white dark:bg-neutral-900 border-4 border-slate-100 dark:border-neutral-900 focus-visible:border-[var(--theme-primary)] focus-visible:ring-0 rounded-sm pl-16 pr-10 text-xl font-black italic tracking-tight transition-all text-slate-900 dark:text-white"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
            {isSearching && (
              <Loader2 className="w-6 h-6 animate-spin text-[var(--theme-primary)]" />
            )}
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="p-2 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
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
                      <p className="mt-2 text-xs font-black text-[var(--theme-primary)] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                        View Goods
                      </p>
                    </div>
                  </button>
                ))}
          </div>
        )}

        {/* PRODUCTS VIEW */}
        {(activeTab === "products" || selectedCategory) && (
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
        )}
      </main>

      {/* ─── BAZAAR FOOTER ─── */}
      <footer className="w-full bg-slate-50 dark:bg-neutral-900 border-t-8 border-slate-100 dark:border-neutral-800 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-1.5 sm:px-4 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-3xl font-black italic tracking-tighter uppercase mb-6 text-slate-900 dark:text-white">
              {store.store_name}
            </h4>
            <div className="w-20 h-2 bg-[var(--theme-primary)] mb-6" />
          </div>

          <div className="flex flex-col items-center">
            <div className="space-y-4">
              {store?.email && (
                <a
                  href={`mailto:${store.email}`}
                  className="flex items-center gap-3 font-bold hover:text-[var(--theme-primary)] transition-colors"
                >
                  <Mail className="w-5 h-5 text-[var(--theme-primary)]" />
                  <span>{store.email}</span>
                </a>
              )}
              {store?.phone_number && (
                <a
                  href={`tel:${store.phone_number}`}
                  className="flex items-center gap-3 font-bold hover:text-[var(--theme-primary)] transition-colors"
                >
                  <Phone className="w-5 h-5 text-[var(--theme-primary)]" />
                  <span>{store.phone_number}</span>
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex gap-3">
              {store?.social_links &&
                Object.entries(store.social_links).map(([platform, link]) => {
                  const key = platform.toLowerCase();
                  let Icon = Global;
                  if (key.includes("instagram")) Icon = Instagram;
                  else if (key.includes("facebook")) Icon = Facebook;
                  else if (key.includes("twitter") || key.includes("x"))
                    Icon = TwitterIcon;
                  else if (key.includes("youtube")) Icon = Youtube;
                  const isLucide = Icon === TwitterIcon;
                  return (
                    <a
                      key={platform}
                      href={link as string}
                      target="_blank"
                      rel="noreferrer"
                      className="w-12 h-12 rounded-sm bg-slate-100 dark:bg-neutral-900 flex items-center justify-center hover:bg-[var(--theme-primary)] transition-all hover:text-white"
                      aria-label={platform}
                    >
                      {isLucide ? (
                        <Icon className="w-5 h-5" />
                      ) : (
                        <Icon variant="Bold" color="currentColor" className="w-5 h-5" />
                      )}
                    </a>
                  );
                })}
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">
              © {new Date().getFullYear()} {store?.store_name}
            </p>
          </div>
        </div>
      </footer>

      <StoreContactModal
        store={store}
        open={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </div>
  );
}
