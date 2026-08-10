import type { StoreTemplateProps } from "./StoreTemplateProps";
import {
  Search,
  X,
  Loader2,
  Phone,
  ShoppingCart,
  Star,
  MapPin,
} from "lucide-react";
import {
  Instagram,
  Facebook,
  Youtube,
  Global,
  InfoCircle,
  Messages3,
  User,
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
  productsTotal,
  isProductsLoading,
  isProductsFetching,
  isCategoriesLoading,
  activeTab,
  selectedCategory,
  searchQuery,
  isSearching,
  productsKey,
  sentinelRef,
  onTabChange,
  onCategorySelect,
  onSearchChange,
  onCartOpen,
  cartItemsCount,
  onMessageVendor,
  isMessagingLoading,
}: StoreTemplateProps) {
  const [contactOpen, setContactOpen] = useState(false);
  const hasBanner = !!store.cover_image;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-slate-900 dark:text-white font-sans pb-24">
      {/* ─── BAZAAR HEADER ─── */}
      <header className="sticky top-0 z-50 w-full bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-neutral-800/50 px-2 sm:px-6 py-3">
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-5 min-w-0 flex-1">
            <div className="flex flex-col min-w-0">
              <h1 className="text-lg md:text-2xl font-black tracking-tight text-slate-900 dark:text-white truncate max-w-[150px] md:max-w-none">
                {store.store_name}
              </h1>
              <div className="hidden md:flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Online Now</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 shrink-0">
             <button
              onClick={onMessageVendor}
              disabled={isMessagingLoading}
              className="p-2 md:p-3 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-sm hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)] transition-all shadow-sm active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Message store"
            >
              {isMessagingLoading ? (
                <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin text-[var(--theme-primary)]" />
              ) : (
                <Messages3 variant="Bold" color="currentColor" className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>

            <button
              onClick={onCartOpen}
              className="relative p-2 md:p-3 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-sm hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)] transition-all shadow-sm active:scale-95 group"
            >
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[var(--theme-primary)] text-white text-[9px] flex items-center justify-center font-black ring-1 ring-white dark:ring-black">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <TemplateProfileDropdown
              buttonClassName="p-2 md:p-3 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-sm hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)] transition-all shadow-sm active:scale-95"
              iconClassName="w-4 h-4 md:w-5 md:h-5"
            />
          </div>
        </div>
      </header>

      {/* ─── BAZAAR HERO ─── */}
      {!searchQuery && !selectedCategory && activeTab === "products" && (
        <section className="relative w-full h-[450px] md:h-[600px] overflow-hidden bg-slate-900">
          {hasBanner ? (
            <>
              <img
                src={store.cover_image ?? undefined}
                alt={store.store_name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--theme-primary)_0%,_transparent_70%)]" />
            </div>
          )}

          <button
            onClick={() => setContactOpen(true)}
            className="absolute top-6 right-6 z-20 bg-white/10 backdrop-blur-md px-2 py-1.5 rounded-sm text-white hover:bg-white/20 transition-all border border-white/10"
            aria-label="Store contact information"
          >
            <InfoCircle variant="Bold" color="currentColor" className="w-5 h-5" />
          </button>

          <div className="relative z-10 max-w-[1600px] mx-auto px-4 h-full flex flex-col justify-center">
          <div className="relative z-10 max-w-[1600px] mx-auto px-4 h-full flex flex-col justify-center">
            <div className="max-w-4xl space-y-8">
              <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="flex items-center gap-2 w-fit bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-sm border border-white/10 shadow-xl">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-white font-black text-sm">
                    {Number(store.rating_average || 0).toFixed(1)}
                  </span>
                  <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider ml-1">
                    Rating
                  </span>
                </div>
                
                <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-[1000] text-white tracking-tighter leading-[0.85] drop-shadow-2xl">
                  {store.store_name}
                </h2>
                
                <p className="text-lg md:text-3xl font-medium text-white/90 max-w-3xl leading-snug drop-shadow-md py-2">
                  {store.description ||
                    "Discover our curated collection of premium goods and exclusive deals."}
                </p>

                {(store.address_city || store.address_country) && (
                  <div className="flex items-center gap-2 text-[var(--theme-primary)] font-black text-xs md:text-sm uppercase tracking-[0.3em] opacity-80">
                    <MapPin className="w-4 h-4" />
                    <span>{store.address_city || store.address_country}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                {onMessageVendor && (
                  <button
                    onClick={onMessageVendor}
                    disabled={isMessagingLoading}
                    className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-3.5 rounded-sm font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2 shadow-xl disabled:opacity-50"
                  >
                    {isMessagingLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Messages3 variant="Bold" color="currentColor" className="w-4 h-4" />
                    )}
                    Message Vendor
                  </button>
                )}
              </div>
            </div>
          </div>
          </div>
        </section>
      )}

      <main className="max-w-[1600px] mx-auto px-4 py-8 md:py-20 w-full space-y-12">
        {/* NAV & SEARCH SECTION */}
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
          <div className="flex p-1.5 bg-slate-100 dark:bg-neutral-900 rounded-sm border border-slate-200/50 dark:border-neutral-800/50 w-full lg:w-auto">
            <button
              onClick={() => {
                onTabChange("products");
                onCategorySelect(null);
              }}
              className={`flex-1 lg:flex-none px-6 py-3.5 rounded-sm font-bold text-sm md:text-base transition-all ${
                activeTab === "products" && !selectedCategory
                  ? "bg-white dark:bg-black text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => onTabChange("categories")}
              className={`flex-1 lg:flex-none px-6 py-3.5 rounded-sm font-bold text-sm md:text-base transition-all ${
                activeTab === "categories" || selectedCategory
                  ? "bg-white dark:bg-black text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Collections
            </button>
          </div>

          <div className="relative group w-full max-w-2xl">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              <Search className="w-5 h-5" />
            </span>
            <Input
              type="text"
              placeholder={`Search in ${store.store_name}...`}
              className="w-full h-14 md:h-16 bg-white dark:bg-neutral-900 border-2 border-slate-200 dark:border-neutral-800 focus-visible:border-indigo-600 focus-visible:ring-0 rounded-sm pl-14 pr-12 text-lg font-medium transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
              {isSearching && (
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              )}
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="p-1.5 bg-slate-100 dark:bg-neutral-800 rounded-full hover:bg-slate-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* CATEGORIES VIEW */}
        {activeTab === "categories" && !selectedCategory && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isCategoriesLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-[300px] rounded-sm bg-slate-200 dark:bg-neutral-800"
                  />
                ))
              : categories?.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => onCategorySelect(cat)}
                    className="group relative h-[300px] rounded-sm overflow-hidden bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:border-indigo-600 transition-all flex flex-col p-8 text-left shadow-sm hover:shadow-xl hover:shadow-indigo-600/5"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 group-hover:w-full group-hover:h-full transition-all duration-500" />
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div className="w-14 h-14 bg-slate-50 dark:bg-neutral-800 rounded-sm flex items-center justify-center text-indigo-600 font-black text-xl mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        {cat.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">
                          {cat.name}
                        </h3>
                        <p className="text-sm font-bold text-slate-400 group-hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">
                          Explore Collection →
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
          </div>
        )}

        {/* PRODUCTS VIEW */}
        {(activeTab === "products" || selectedCategory) && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <StoreProductsGrid
              key={productsKey}
              products={products}
              total={productsTotal}
              isLoading={isProductsLoading}
              isFetching={isProductsFetching}
              sentinelRef={sentinelRef}
              selectedCategory={selectedCategory}
              onBackToCategories={() => onCategorySelect(null)}
            />
          </div>
        )}
      </main>

      {/* ─── BAZAAR FOOTER ─── */}
      <footer className="w-full bg-white dark:bg-neutral-950 border-t border-slate-200 dark:border-neutral-800 pt-20 pb-10 mt-20">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-20">
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center gap-4">
                 {store.logo ? (
                  <img src={store.logo} alt="" className="w-12 h-12 rounded-sm object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-sm bg-indigo-600" />
                )}
                <h4 className="text-3xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">
                  {store.store_name}
                </h4>
              </div>
              <p className="text-slate-500 dark:text-neutral-400 text-lg leading-relaxed max-w-md">
                {store.description || "Your destination for high-quality goods and exceptional service."}
              </p>
              <div className="flex gap-4">
                {store?.social_links &&
                  Object.entries(store.social_links).map(([platform, link]) => {
                    const key = platform.toLowerCase();
                    let Icon = Global;
                    if (key.includes("instagram")) Icon = Instagram;
                    else if (key.includes("facebook")) Icon = Facebook;
                    else if (key.includes("twitter") || key.includes("x")) Icon = User;
                    else if (key.includes("youtube")) Icon = Youtube;
                    
                    return (
                      <a
                        key={platform}
                        href={link as string}
                        target="_blank"
                        rel="noreferrer"
                        className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-neutral-900 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        aria-label={platform}
                      >
                        <Icon variant="Bold" color="currentColor" className="w-6 h-6" />
                      </a>
                    );
                  })}
              </div>
            </div>

            <div className="space-y-6">
              <h5 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Contact Us</h5>
              <div className="space-y-4">
                {store?.email && (
                  <a href={`mailto:${store.email}`} className="flex items-center gap-3 text-slate-500 hover:text-indigo-600 transition-colors font-semibold">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center p-2.5 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-3">
                      <Global variant="Bold" color="currentColor" className="w-full h-full text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="text-zinc-400 font-black uppercase tracking-widest text-[10px] mb-0.5">Email</h4>
                      <p className="text-zinc-100 font-bold text-sm tracking-tight">{store.email}</p>
                    </div>
                  </a>
                )}
                {store?.phone_number && (
                  <a href={`tel:${store.phone_number}`} className="flex items-center gap-3 text-slate-500 hover:text-indigo-600 transition-colors font-semibold">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-neutral-900 flex items-center justify-center">
                       <Phone className="w-5 h-5 text-slate-400" />
                    </div>
                    <span>{store.phone_number}</span>
                  </a>
                )}
              </div>
            </div>

             <div className="space-y-6">
              <h5 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Store Location</h5>
              <div className="flex items-start gap-3 text-slate-500 font-semibold">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-neutral-900 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-slate-400" />
                </div>
                <span>
                  {store.address_city}, {store.address_country}<br />
                  {store.address_state}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-100 dark:border-neutral-900 flex flex-col md:row items-center justify-between gap-6">
            <p className="text-sm font-bold text-slate-400">
              © {new Date().getFullYear()} {store?.store_name}. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm font-bold text-slate-400">
              <a href="#" className="hover:text-[var(--theme-primary)]">Privacy Policy</a>
              <a href="#" className="hover:text-[var(--theme-primary)]">Terms of Service</a>
            </div>
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
