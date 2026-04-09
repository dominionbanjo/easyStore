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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { StoreProductsGrid } from "../StoreProductsGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { TemplateProfileDropdown } from "@/components/shared/TemplateProfileDropdown";

export default function TitanTemplate({
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
  // Titan aesthetic:
  // - Dark tech, bento-box grid layouts
  // - High-contrast neon accents (using --theme-primary)
  // - Monospaced utility accents

  return (
    <div className="w-full bg-black text-zinc-300 font-mono min-h-screen selection:bg-[var(--theme-primary)] selection:text-black pb-24 border-x border-zinc-900 mx-auto max-w-[1600px]">
      <div className="px-1.5 sm:px-4 py-6 md:py-12 space-y-6 md:space-y-8">
        {/* ─── TITAN HEADER ─── */}
        <header className="w-full border border-zinc-800 bg-zinc-950/80 backdrop-blur-md rounded-sm px-2.5 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          {/* Subtle Grid Background Pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
            {store?.logo ? (
              <img
                src={store.logo ?? undefined}
                alt={store.store_name}
                className="w-16 h-16 rounded-sm object-cover border border-zinc-700 bg-black p-1"
              />
            ) : (
              <div className="w-16 h-16 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono font-bold text-2xl text-[var(--theme-primary)]">
                {store?.store_name?.substring(0, 2).toUpperCase() || "TT"}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase truncate max-w-[200px] md:max-w-none">
                {store?.store_name ?? "TITAN STORE"}
              </h1>
              <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 mt-2 uppercase tracking-wide">
                <span>
                  SYS_INIT:{" "}
                  {new Date(store?.created_at || Date.now()).getFullYear()}
                </span>
                <span className="w-1 h-1 rounded-sm bg-zinc-700"></span>
                <span className="flex items-center gap-1 text-[var(--theme-primary)]">
                  <div className="w-2 h-2 rounded-sm bg-[var(--theme-primary)] animate-pulse" />{" "}
                  ONLINE
                </span>
              </div>
            </div>

            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={onCartOpen}
                className="relative p-3 border border-zinc-800 bg-black text-[var(--theme-primary)] rounded-sm hover:bg-[var(--theme-primary)]/10 transition-all group overflow-hidden"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-[var(--theme-primary)] text-black text-[10px] flex items-center justify-center font-black rounded-sm ring-1 ring-black -[0_0_10px_var(--theme-primary)]">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              <TemplateProfileDropdown
                buttonClassName="p-3 border border-zinc-800 bg-black text-[var(--theme-primary)] rounded-sm hover:bg-[var(--theme-primary)]/10 transition-all"
                iconClassName="w-5 h-5"
              />
            </div>
          </div>

          <div className="flex-1 w-full md:max-w-md relative z-10">
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-primary)]">
                <Search className="w-4 h-4" />
              </span>
              <Input
                type="text"
                placeholder="EXECUTE SEARCH..."
                className="w-full pl-10 pr-10 py-5 bg-black border-zinc-800 focus-visible:bg-zinc-900 focus-visible:border-[var(--theme-primary)] focus-visible:ring-1 focus-visible:ring-[var(--theme-primary)] rounded-sm font-mono text-sm uppercase placeholder:text-zinc-700 transition-all text-white"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-zinc-600">
                {isSearching && (
                  <Loader2 className="w-4 h-4 animate-spin text-[var(--theme-primary)]" />
                )}
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange("")}
                    className="hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 relative z-10 font-mono">
            <button
              onClick={onCartOpen}
              className="relative p-3 border border-zinc-800 bg-black text-[var(--theme-primary)] rounded-sm hover:bg-[var(--theme-primary)]/10 transition-all group overflow-hidden"
            >
              <div className="absolute inset-x-0 bottom-0 h-[1px] bg-[var(--theme-primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-[var(--theme-primary)] text-black text-[10px] flex items-center justify-center font-black rounded-sm ring-1 ring-black -[0_0_10px_var(--theme-primary)]">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <TemplateProfileDropdown
              buttonClassName="p-3 border border-zinc-800 bg-black text-[var(--theme-primary)] rounded-sm hover:bg-[var(--theme-primary)]/10 transition-all"
              iconClassName="w-5 h-5"
            />
          </div>
        </header>

        {/* ─── TITAN HERO SYSTEM ─── */}
        {!searchQuery && !selectedCategory && activeTab === "products" && (
          <section className="relative w-full min-h-[400px] md:min-h-[500px] rounded-sm border border-zinc-800 bg-zinc-950 overflow-hidden flex flex-col justify-end p-4 sm:p-8 md:p-16 group">
            {/* Background Layer */}
            {store.cover_image ? (
              <>
                <img
                  src={store.cover_image}
                  alt={store.store_name}
                  className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black" />
            )}

            {/* Grid Overlay */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />

            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

            <div className="relative z-10 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3 px-3 py-1 bg-black border border-zinc-700 rounded-sm">
                  <div className="w-2 h-2 rounded-sm bg-[var(--theme-primary)] animate-pulse -[0_0_8px_var(--theme-primary)]" />
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-[0.2em]">
                    System_Active // v2.0.4
                  </span>
                </div>

                <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.85]">
                  {store.store_name}
                </h2>

                <p className="max-w-2xl text-lg md:text-xl font-mono text-zinc-500 uppercase leading-relaxed border-l-2 border-zinc-800 pl-6">
                  {store.description ||
                    "Interface for high-grade retail modules. Authorized personnel only."}
                </p>
              </div>

              <div className="flex flex-wrap gap-12 items-center font-mono">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest mb-2">
                    Unit_Rating
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < Math.floor(Number(store.rating_average || 0)) ? "fill-[var(--theme-primary)] text-[var(--theme-primary)]" : "text-zinc-800"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xl font-bold text-white">
                      {Number(store.rating_average || 0).toFixed(1)}
                    </span>
                  </div>
                </div>

                {(store.address_city || store.address_country) && (
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest mb-2">
                      Deployment_Zone
                    </span>
                    <div className="flex items-center gap-2 text-xl font-bold text-white uppercase italic">
                      <MapPin className="w-4 h-4 text-[var(--theme-primary)]" />
                      {store.address_city || store.address_country}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Aesthetic Corner Accents */}
            <div className="absolute top-8 right-8 flex gap-2">
              <div className="w-12 h-1 bg-zinc-800" />
              <div className="w-4 h-4 border-t-2 border-r-2 border-zinc-800" />
            </div>
          </section>
        )}

        {/* ─── BENTO BOX LAYOUT ─── */}
        <main className="px-1.5 py-6 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Main Content Area */}
            <div className="lg:col-span-12 space-y-6">
              {/* Nav Tabs Bento Unit */}
              <div className="p-1.5 bg-zinc-900/50 border border-zinc-800 rounded-sm flex items-center gap-2 w-fit">
                <button
                  onClick={() => {
                    onTabChange("products");
                    onCategorySelect(null);
                  }}
                  className={`px-6 py-2.5 rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                    activeTab === "products" && !selectedCategory
                      ? "bg-[var(--theme-primary)] text-black -[0_0_15px_var(--theme-primary)]/30"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  [ ALL_MODULES ]
                </button>
                <button
                  onClick={() => onTabChange("categories")}
                  className={`px-6 py-2.5 rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                    activeTab === "categories" || selectedCategory
                      ? "bg-[var(--theme-primary)] text-black -[0_0_15px_var(--theme-primary)]/30"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  [ CATEGORIES ]
                </button>
              </div>

              {/* Content View Unit */}
              <div className="bg-zinc-950/40 border border-zinc-800 rounded-sm px-1.5 py-6 sm:p-8 min-h-[600px]">
                {/* CATEGORIES VIEW */}
                {activeTab === "categories" && !selectedCategory && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {isCategoriesLoading
                      ? Array.from({ length: 8 }).map((_, i) => (
                          <Skeleton
                            key={i}
                            className="h-48 rounded-sm bg-zinc-900/50 border border-zinc-800"
                          />
                        ))
                      : categories?.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => onCategorySelect(cat)}
                            className="group relative h-48 rounded-sm bg-zinc-900/30 border border-zinc-800 hover:border-[var(--theme-primary)] p-6 text-left transition-all hover:bg-zinc-900/60 overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 p-2 text-[var(--theme-primary)]/20 font-mono text-[10px]">
                              ID_{cat.id.substring(0, 6).toUpperCase()}
                            </div>
                            <div className="relative z-10 flex flex-col justify-between h-full">
                              <h3 className="text-xl font-bold text-white uppercase group-hover:text-[var(--theme-primary)] transition-colors">
                                {cat.name}
                              </h3>
                              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 group-hover:text-zinc-300">
                                <span>ACCESS_DATA</span>
                                <div className="h-[1px] flex-1 bg-zinc-800 group-hover:bg-[var(--theme-primary)]/50 transition-colors" />
                              </div>
                            </div>
                          </button>
                        ))}
                  </div>
                )}

                {/* PRODUCTS VIEW */}
                {(activeTab === "products" || selectedCategory) && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="flex flex-col md:flex-row md:items-end justify-between p-4 border-l-2 border-[var(--theme-primary)] bg-zinc-900/20 gap-4">
                      <div>
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                          {selectedCategory
                            ? `TYPE_ID: ${selectedCategory.name}`
                            : "GLOBAL_INVENTORY"}
                        </h2>
                        {selectedCategory && (
                          <button
                            onClick={() => onCategorySelect(null)}
                            className="text-xs font-mono text-[var(--theme-primary)] hover:underline mt-2 flex items-center gap-1 uppercase"
                          >
                            [ RESET_FILTER ]
                          </button>
                        )}
                      </div>
                      <div className="text-xs font-mono text-zinc-600 uppercase bg-black px-3 py-1 border border-zinc-800 rounded-sm">
                        BLOCK_COUNT: {pagination?.total || 0}
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
              </div>
            </div>
          </div>
        </main>

        {/* ─── TITAN FOOTER ─── */}
        <footer className="border border-zinc-800 bg-zinc-950/80 rounded-sm p-10 mt-12 overflow-hidden relative">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 border border-[var(--theme-primary)] flex items-center justify-center font-mono font-bold text-xl text-[var(--theme-primary)] bg-black">
                  {store?.store_name?.charAt(0) || "T"}
                </div>
                <h4 className="text-xl font-bold text-white uppercase tracking-tighter">
                  {store?.store_name}
                </h4>
              </div>
              <p className="font-mono text-xs uppercase leading-relaxed text-zinc-500 max-w-md">
                {store?.description ||
                  "HIGH_END RETAIL INTERFACE SYSTEM. ACCESSING DATA BLOCK 04.2..."}
              </p>
            </div>

            <div>
              <h5 className="text-[10px] font-mono font-bold text-zinc-600 mb-6 uppercase tracking-[0.3em]">
                COMMS_PROTOCOL
              </h5>
              <div className="flex flex-col gap-4 font-mono text-xs text-zinc-400">
                {store?.email && (
                  <a
                    href={`mailto:${store.email}`}
                    className="hover:text-[var(--theme-primary)] transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-3 h-3" /> [ EMAIL_LINK ]
                  </a>
                )}
                {store?.phone_number && (
                  <a
                    href={`tel:${store.phone_number}`}
                    className="hover:text-[var(--theme-primary)] transition-colors flex items-center gap-2"
                  >
                    <Phone className="w-3 h-3" /> [ CALL_LINK ]
                  </a>
                )}
              </div>
            </div>

            <div>
              <h5 className="text-[10px] font-mono font-bold text-zinc-600 mb-6 uppercase tracking-[0.3em]">
                SYS_RELAY
              </h5>
              <div className="flex flex-wrap gap-4">
                {store?.social_links &&
                  Object.entries(store.social_links).map(([platform, link]) => (
                    <a
                      key={platform}
                      href={link as string}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 border border-zinc-800 bg-black text-zinc-500 hover:text-[var(--theme-primary)] hover:border-[var(--theme-primary)] transition-all rounded-sm"
                    >
                      <span className="font-mono text-[10px] uppercase">
                        {platform.substring(0, 3)}
                      </span>
                    </a>
                  ))}
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono uppercase text-zinc-700">
            <span>
              STATUS: STABLE // © {new Date().getFullYear()} CORE_INTEGRITY
            </span>
            <span className="text-[var(--theme-primary)]/50">
              POWERED BY EAZYSTORE_SYS
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
