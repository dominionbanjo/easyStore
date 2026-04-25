import {
  Search,
  X,
  Loader2,
  Star,
  MapPin,
  Mail,
  ChevronRight,
  ShoppingCart,
  TwitterIcon,
} from "lucide-react";
import {
  Instagram,
  Facebook,
  Youtube,
  Global,
  InfoCircle,
  Call,
} from "iconsax-react";
import { Input } from "@/components/ui/input";
import { StoreProductsGrid } from "../StoreProductsGrid";
import { Skeleton } from "@/components/ui/skeleton";
import type { StoreTemplateProps } from "./StoreTemplateProps";
import { TemplateProfileDropdown } from "@/components/shared/TemplateProfileDropdown";
import { StoreContactModal } from "../StoreContactModal";
import { useState } from "react";

export default function DefaultTemplate({
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
  const storeLocation = [
    store.address_city,
    store.address_state,
    store.address_country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100 selection:bg-[var(--theme-primary)] selection:text-white">
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 md:gap-8">
          {/* Logo & Name */}
          <div className="flex items-center gap-3 md:gap-4 shrink-0 min-w-0">
            {store.logo && (
              <img
                src={store.logo ?? undefined}
                alt={store.store_name}
                className="w-10 h-10 md:w-12 md:h-12 rounded-sm object-cover border border-zinc-200 dark:border-zinc-800"
              />
            )}
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white truncate max-w-[120px] md:max-w-xs">
              {store.store_name}
            </h1>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 font-semibold text-sm text-zinc-600 dark:text-zinc-400">
            <button
              onClick={() => {
                onTabChange("products");
                onCategorySelect(null);
              }}
              className={`hover:text-[var(--theme-primary)] transition-colors ${activeTab === "products" && !selectedCategory ? "text-[var(--theme-primary)]" : ""}`}
            >
              Shop All
            </button>
            <button
              onClick={() => onTabChange("categories")}
              className={`hover:text-[var(--theme-primary)] transition-colors ${activeTab === "categories" || selectedCategory ? "text-[var(--theme-primary)]" : ""}`}
            >
              Collections
            </button>
          </nav>

          {/* Search Bar (Desktop) */}
          <div className="flex-1 max-w-md hidden lg:flex relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[var(--theme-primary)]">
              <Search className="w-5 h-5" />
            </span>
            <Input
              type="text"
              placeholder="Search products..."
              className="w-full bg-zinc-100 dark:bg-zinc-900 border-transparent focus-visible:bg-white dark:focus-visible:bg-zinc-950 focus-visible:border-[var(--theme-primary)] focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]/20 rounded-sm pl-12 pr-12 py-6 transition-all text-base font-medium "
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
                  className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-200 dark:bg-zinc-800 rounded-sm p-1 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={onCartOpen}
              className="relative p-2.5 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 transition-all hover:scale-110"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-sm bg-[var(--theme-primary)] text-white text-[10px] flex items-center justify-center font-bold ring-2 ring-white dark:ring-zinc-950 ">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <TemplateProfileDropdown
              buttonClassName="relative p-2.5 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 transition-all hover:scale-110"
              iconClassName="w-5 h-5"
            />

            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block mx-1" />

            {store.email && (
              <a
                href={`mailto:${store.email}`}
                className="hidden sm:flex hover:text-[var(--theme-primary)] transition-colors p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-sm text-zinc-500"
              >
                <Mail className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        {/* Mobile Search Overlay Sub-header */}
        <div className="lg:hidden px-4 pb-4 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md">
          <div className="relative group w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[var(--theme-primary)]">
              <Search className="w-4 h-4" />
            </span>
            <Input
              type="text"
              placeholder="Search products..."
              className="w-full bg-zinc-100 dark:bg-zinc-900 border-transparent focus-visible:bg-white dark:focus-visible:bg-zinc-950 focus-visible:ring-1 focus-visible:ring-[var(--theme-primary)] rounded-sm pl-10 pr-10 py-5 transition-all "
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* ─── CATEGORY NAVIGATION BAR ─── */}
      <div className="bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-100 dark:border-zinc-900 sticky top-20 z-30 hidden md:block backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 py-4 overflow-x-auto custom-scrollbar">
            <button
              onClick={() => {
                onTabChange("products");
                onCategorySelect(null);
              }}
              className={`text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all px-4 py-2 rounded-sm ${
                activeTab === "products" && !selectedCategory
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 "
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
              }`}
            >
              All Arrivals
            </button>
            <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 shrink-0" />
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategorySelect(cat)}
                className={`text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all px-4 py-2 rounded-sm ${
                  selectedCategory?.id === cat.id
                    ? "bg-[var(--theme-primary)] text-white "
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── FULL-WIDTH HERO SECTION ─── */}
      {!searchQuery && !selectedCategory && activeTab === "products" && (
        <div className="relative w-full min-h-[500px] md:min-h-[600px] flex items-center justify-center bg-zinc-900 overflow-hidden">
          {hasBanner ? (
            <>
              <img
                src={store.cover_image ?? undefined}
                alt={`${store.store_name} Hero`}
                className="absolute inset-0 w-full h-full object-cover opacity-80 scale-105 hover:scale-100 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-primary)]/40 to-black" />
          )}

          <button
            onClick={() => setContactOpen(true)}
            className="absolute top-4 right-4 z-20 text-white hover:scale-110 active:scale-95 group transition-all drop-shadow-lg"
            aria-label="Store contact information"
          >
            <InfoCircle variant="Bold" color="white" className="w-5 h-5" />
          </button>

          <div className="relative z-10 text-center px-6 max-w-4xl flex flex-col items-center">
            {store.logo && (
              <img
                src={store.logo ?? undefined}
                alt="Store logo"
                className="w-24 h-24 md:w-32 md:h-32 rounded-sm object-cover border-4 border-white/20 mb-8  backdrop-blur-md bg-white/10"
              />
            )}
            <h2 className="text-5xl md:text-8xl font-black tracking-tight mb-6 text-white drop- leading-none">
              {store.store_name}
            </h2>
            <p className="text-lg md:text-2xl font-medium mb-10 text-zinc-200 drop- max-w-2xl leading-relaxed opacity-90">
              {store.description ||
                "Discover premium products tailored to your lifestyle. Shop the latest collections today."}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold mb-10">
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-sm bg-white/10 text-white backdrop-blur-xl border border-white/10 ">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-base">
                  {Number(store.rating_average ?? 0).toFixed(1)}
                </span>
                <span className="opacity-70 font-normal">
                  ({store.rating_count || 0} reviews)
                </span>
              </div>
              {storeLocation && (
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-sm bg-white/10 text-white backdrop-blur-xl border border-white/10 ">
                  <MapPin className="w-4 h-4 text-zinc-300" />
                  <span className="text-base">{storeLocation}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => {
                  const target = document.getElementById("main-grid");
                  target?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className="bg-[var(--theme-primary)] text-white px-8 py-3.5 rounded-sm font-bold text-base hover:bg-[var(--theme-primary)]/90 transition-all hover:-translate-y-1 active:scale-95"
              >
                Explore Collection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT ─── */}
      <main
        id="main-grid"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
      >
        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-2 overflow-x-auto custom-scrollbar gap-8">
          <button
            onClick={() => {
              onTabChange("products");
              onCategorySelect(null);
            }}
            className={`text-xl font-bold whitespace-nowrap transition-all ${
              activeTab === "products" && !selectedCategory
                ? "text-[var(--theme-primary)] border-b-2 border-[var(--theme-primary)] pb-2"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 pb-2"
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => onTabChange("categories")}
            className={`text-xl font-bold whitespace-nowrap transition-all ${
              activeTab === "categories" || selectedCategory
                ? "text-[var(--theme-primary)] border-b-2 border-[var(--theme-primary)] pb-2"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 pb-2"
            }`}
          >
            Collections
          </button>
        </div>

        {/* Categories View */}
        {activeTab === "categories" && !selectedCategory && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6">
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Shop by Collection
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {isCategoriesLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      className="h-72 rounded-sm bg-zinc-200 dark:bg-zinc-900 "
                    />
                  ))
                : categories?.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => onCategorySelect(cat)}
                      className="group relative overflow-hidden rounded-sm bg-zinc-100 dark:bg-zinc-900 text-left  hover: transition-all duration-500 h-80 flex flex-col justify-end p-8 border border-zinc-200 dark:border-zinc-800"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity" />

                      {/* Decorative Element */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--theme-primary)]/10 rounded-sm blur-3xl -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150 group-hover:bg-[var(--theme-primary)]/20" />

                      <div className="relative z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-[var(--theme-primary)] transition-colors line-clamp-2">
                          {cat.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-white/60 group-hover:text-white transition-colors">
                          Explore Collection
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      </div>
                    </button>
                  ))}
            </div>
          </div>
        )}

        {/* Products View */}
        {(activeTab === "products" || selectedCategory) && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-8">
              <div>
                {selectedCategory && (
                  <button
                    onClick={() => onCategorySelect(null)}
                    className="text-sm font-bold text-[var(--theme-primary)] hover:opacity-75 transition-colors mb-4 flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    BACK TO ALL
                  </button>
                )}
                <h3 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-2">
                  {selectedCategory ? selectedCategory.name : "New Arrivals"}
                </h3>
              </div>
              <div className="text-sm font-bold tracking-widest uppercase text-zinc-400">
                {pagination?.total || 0} PRODUCTS
              </div>
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

      {/* ─── ENHANCED FOOTER ─── */}
      <footer className="w-full bg-zinc-50 dark:bg-zinc-950 py-24 mt-12 border-t border-zinc-200 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="flex justify-center mb-10">
            {store.logo ? (
              <img
                src={store.logo ?? undefined}
                alt="Logo"
                className="w-20 h-20 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all rounded-sm border-2 border-transparent hover:border-[var(--theme-primary)] p-0.5"
              />
            ) : (
              <div className="w-20 h-20 bg-zinc-200 dark:bg-zinc-800 rounded-sm flex items-center justify-center font-bold text-3xl text-zinc-400">
                {store.store_name?.charAt(0)}
              </div>
            )}
          </div>

          <h2 className="font-black text-3xl text-zinc-900 dark:text-zinc-100 mb-6 tracking-tight">
            {store.store_name}
          </h2>

          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
              {store.description ||
                "Leaders in premium curated collections. We bring you the finest quality products from around the world, delivered with care to your doorstep."}
            </p>
          </div>

          {/* Social Links */}
          {store.social_links && Object.keys(store.social_links).length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              {Object.entries(store.social_links).map(([platform, link]) => {
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
                    className="w-11 h-11 flex items-center justify-center rounded-sm bg-zinc-100 dark:bg-zinc-800 hover:bg-[var(--theme-primary)]/10 hover:border-[var(--theme-primary)]/50 border border-zinc-200 dark:border-zinc-700 transition-all group"
                    aria-label={platform}
                  >
                    {isLucide ? (
                      <Icon className="w-5 h-5 text-[var(--theme-primary)]" />
                    ) : (
                      <Icon
                        variant="Bold"
                        color="var(--theme-primary)"
                        className="w-5 h-5"
                      />
                    )}
                  </a>
                );
              })}
            </div>
          )}
          {/* Phone */}
          {store.phone_number && (
            <a
              href={`tel:${store.phone_number}`}
              className="flex items-center gap-2 justify-center text-sm font-semibold text-zinc-500 hover:text-[var(--theme-primary)] transition-colors mb-12"
            >
              <Call
                variant="Bold"
                color="var(--theme-primary)"
                className="w-4 h-4"
              />
              {store.phone_number}
            </a>
          )}

          <div className="w-24 h-px bg-zinc-200 dark:bg-zinc-800 mb-10" />

          <div className="flex flex-col md:flex-row items-center gap-4 text-xs font-bold tracking-widest text-zinc-400 uppercase">
            <span>
              © {new Date().getFullYear()} {store.store_name}
            </span>
          </div>

          <StoreContactModal
            store={store}
            open={contactOpen}
            onClose={() => setContactOpen(false)}
          />
        </div>
      </footer>
    </div>
  );
}
