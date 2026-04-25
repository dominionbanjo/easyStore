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
  const hasBanner = !!store.cover_image;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-slate-900 dark:text-white font-sans pb-24">
      {/* ─── BAZAAR HEADER ─── */}
      <header className="sticky top-0 z-50 w-full bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-neutral-800/50 px-2 sm:px-6 py-3">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-5 min-w-0">
            {store.logo ? (
              <img
                src={store.logo}
                alt={store.store_name}
                className="w-10 h-10 md:w-14 md:h-14 rounded-2xl object-cover border border-slate-200 dark:border-neutral-800 shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-[var(--theme-primary)] to-[var(--theme-primary)]/80 flex items-center justify-center font-black text-white text-xl shadow-lg">
                {store.store_name?.charAt(0)}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <h1 className="text-lg md:text-2xl font-black tracking-tight text-slate-900 dark:text-white truncate max-w-[120px] md:max-w-none">
                {store.store_name}
              </h1>
              <div className="hidden md:flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Online Now</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
             <button
              onClick={onMessageVendor}
              disabled={isMessagingLoading}
              className="p-2.5 md:p-3.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)] transition-all shadow-sm active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Message store"
            >
              {isMessagingLoading ? (
                <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin text-[var(--theme-primary)]" />
              ) : (
                <Messages3 variant="Bold" color="currentColor" className="w-5 h-5 md:w-6 md:h-6" />
              )}
            </button>

            <button
              onClick={onCartOpen}
              className="relative p-2.5 md:p-3.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)] transition-all shadow-sm active:scale-95 group"
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[var(--theme-primary)] text-white text-[10px] flex items-center justify-center font-black ring-2 ring-white dark:ring-black">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <TemplateProfileDropdown
              buttonClassName="p-2.5 md:p-3.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)] transition-all shadow-sm active:scale-95"
              iconClassName="w-5 h-5 md:w-6 md:h-6"
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
            className="absolute top-6 right-6 z-20 bg-white/10 backdrop-blur-md p-3 rounded-2xl text-white hover:bg-white/20 transition-all border border-white/20"
            aria-label="Store contact information"
          >
            <InfoCircle variant="Bold" color="currentColor" className="w-6 h-6" />
          </button>

          <div className="relative z-10 max-w-[1600px] mx-auto px-4 h-full flex flex-col justify-center">
            <div className="max-w-3xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/20">
                    Verified Premium Merchant
                  </div>
                  <div className="bg-white/10 backdrop-blur-md text-white/90 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
                    {store.address_city || "Lagos, Nigeria"}
                  </div>
                </div>
              <h2 className="text-5xl md:text-8xl font-[1000] text-white tracking-tight leading-[0.9] drop-shadow-2xl">
                {store.store_name}
              </h2>
              <p className="text-lg md:text-2xl font-medium text-white/80 max-w-2xl leading-relaxed drop-shadow-md">
                {store.description ||
                  "Discover our curated collection of premium goods and exclusive deals."}
              </p>

              <div className="flex flex-wrap gap-4 md:gap-8 pt-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 px-6 py-4 rounded-3xl">
                  <span className="text-[10px] font-black uppercase text-white/50 tracking-[0.2em] mb-2 block">
                    Market Rating
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(Number(store.rating_average || 0)) ? "fill-yellow-400 text-yellow-400" : "text-white/20"}`}
                        />
                      ))}
                    </div>
                    <span className="text-white font-black text-2xl">
                      {Number(store.rating_average || 0).toFixed(1)}
                    </span>
                  </div>
                </div>

                {(store.address_city || store.address_country) && (
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 px-6 py-4 rounded-3xl">
                    <span className="text-[10px] font-black uppercase text-white/50 tracking-[0.2em] mb-2 block">
                      Base Location
                    </span>
                    <div className="flex items-center gap-3 text-white font-black text-2xl">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                      <span className="uppercase">{store.address_city || store.address_country}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="max-w-[1600px] mx-auto px-4 py-8 md:py-20 w-full space-y-12">
        {/* NAV & SEARCH SECTION */}
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
          <div className="flex p-1.5 bg-slate-100 dark:bg-neutral-900 rounded-[28px] border border-slate-200/50 dark:border-neutral-800/50 w-full lg:w-auto">
            <button
              onClick={() => {
                onTabChange("products");
                onCategorySelect(null);
              }}
              className={`flex-1 lg:flex-none px-6 py-3.5 rounded-[22px] font-bold text-sm md:text-base transition-all ${
                activeTab === "products" && !selectedCategory
                  ? "bg-white dark:bg-black text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => onTabChange("categories")}
              className={`flex-1 lg:flex-none px-6 py-3.5 rounded-[22px] font-bold text-sm md:text-base transition-all ${
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
              className="w-full h-14 md:h-16 bg-white dark:bg-neutral-900 border-2 border-slate-200 dark:border-neutral-800 focus-visible:border-indigo-600 focus-visible:ring-0 rounded-3xl pl-14 pr-12 text-lg font-medium transition-all shadow-sm"
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
                    className="h-[300px] rounded-3xl bg-slate-200 dark:bg-neutral-800"
                  />
                ))
              : categories?.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => onCategorySelect(cat)}
                    className="group relative h-[300px] rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:border-indigo-600 transition-all flex flex-col p-8 text-left shadow-sm hover:shadow-xl hover:shadow-indigo-600/5"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-bl-full group-hover:w-full group-hover:h-full group-hover:rounded-none transition-all duration-500" />
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div className="w-14 h-14 bg-slate-50 dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
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

      {/* ─── BAZAAR FOOTER ─── */}
      <footer className="w-full bg-white dark:bg-neutral-950 border-t border-slate-200 dark:border-neutral-800 pt-20 pb-10 mt-20">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-20">
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center gap-4">
                 {store.logo ? (
                  <img src={store.logo} alt="" className="w-12 h-12 rounded-xl object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-indigo-600" />
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
