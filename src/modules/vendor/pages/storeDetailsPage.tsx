import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import StoreHeaderSection from "@/modules/vendor/components/StoreHeaderSection";

import {
  useGetStoreDetailsQuery,
  useGetStoreProductsQuery,
  useGetStoreCategoryProductsQuery,
} from "@/services/storeApi";

import { Skeleton } from "@/components/ui/skeleton";
import { StoreCategoriesGrid } from "../components/Store-details-page/StoreCategoriesGrid";
import { StoreProductsGrid } from "../components/Store-details-page/StoreProductsGrid";
import { StoreTabs } from "../components/Store-details-page/StoreTabs";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

/* ───────────────── COMPONENT ───────────────── */

export default function StoreDetailsPage() {
  const { slug } = useParams<{ slug: string }>();

  const [activeTab, setActiveTab] = useState<"products" | "categories">(
    "products",
  );
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Debounce search
  useEffect(() => {
    if (searchQuery !== debouncedSearch) {
      setIsSearching(true);
    }
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset page on search
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery, debouncedSearch]);

  /* ─── STORE DETAILS ─── */

  const {
    data: storeData,
    isLoading: storeLoading,
    isError: storeError,
  } = useGetStoreDetailsQuery(
    { slug: slug ?? "", includeCategories: true },
    { skip: !slug },
  );

  /* ─── ALL PRODUCTS ─── */

  const {
    data: productsData,
    isLoading: productsLoading,
    isFetching: productsFetching,
  } = useGetStoreProductsQuery(
    { slug: slug ?? "", page, limit: 20, q: debouncedSearch },
    { skip: activeTab !== "products" },
  );

  /* ─── CATEGORY PRODUCTS ─── */

  const {
    data: categoryProductsData,
    isLoading: categoryLoading,
    isFetching: categoryFetching,
  } = useGetStoreCategoryProductsQuery(
    {
      slug: slug ?? "",
      categoryId: selectedCategory?.id ?? "",
      page,
      limit: 20,
    },
    { skip: activeTab !== "categories" || !selectedCategory },
  );

  /* ─── NORMALIZED DATA ─── */

  const store = storeData?.data.store;
  const categories = storeData?.data.categories ?? [];

  const products =
    activeTab === "products"
      ? (productsData?.data.items ?? [])
      : (categoryProductsData?.data.items ?? []);

  const pagination =
    activeTab === "products"
      ? productsData?.data.pagination
      : categoryProductsData?.data.pagination;

  const isProductsLoading =
    activeTab === "products" ? productsLoading : categoryLoading;

  const isProductsFetching =
    activeTab === "products"
      ? productsFetching || isSearching
      : categoryFetching;

  const productsKey =
    activeTab === "products"
      ? "all-products"
      : selectedCategory
        ? `category-${selectedCategory.id}`
        : "no-category";

  /* ─── STORE LOADING STATE ─── */

  if (storeLoading) {
    return (
      <div className="min-h-screen py-20 px-1.5 sm:px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-[400px] rounded-[3rem]" />
          <div className="flex justify-center">
            <Skeleton className="h-14 w-64 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[400px] rounded-[2.5rem]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (storeError || !store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-primary/5 p-8 rounded-[3rem] border border-primary/10 max-w-md">
          <h1 className="text-4xl font-black text-zinc-900 mb-4 tracking-tighter">
            Store Not Found
          </h1>
          <p className="text-zinc-500 mb-8">
            The store you're looking for might have been moved or deleted.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-primary text-white font-bold py-4 px-8 rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isCategoriesLoading = storeLoading;

  /* ───────────────── RENDER ───────────────── */

  return (
    <section className="min-h-screen pb-20 mt-10">
      {/* ─── HEADER ─── */}
      <StoreHeaderSection
        store={{
          id: store.id,
          name: store.store_name ?? "Unnamed Store",
          banner: store.cover_image ?? undefined,
          logo: store.logo ?? undefined,
          description:
            store.description ?? "This store has not added a description yet.",
          rating: Number(store.rating_average ?? 0),
          location:
            [store.address_city, store.address_state, store.address_country]
              .filter(Boolean)
              .join(", ") || "Location not specified",
          email: store.email ?? undefined,
          phone: store.phone_number ?? undefined,
          social_links: store.social_links ?? undefined,
          totalProducts: store.total_products ?? 0,
          user: store.user,
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* ─── TABS ─── */}
        <StoreTabs
          activeTab={activeTab}
          onChange={(tab) => {
            setActiveTab(tab);
            setSelectedCategory(null);
            setPage(1);
            setSearchQuery(""); // Clear search when changing tabs
          }}
        />

        {/* ─── SEARCH BAR ─── */}
        {activeTab === "products" && (
          <div className="max-w-md mx-auto mt-8 px-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                type="text"
                placeholder="Search in this store..."
                className="pl-11 pr-11 py-6 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl border-zinc-200 dark:border-white/10 rounded-2xl shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary transition-all text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
                {isSearching && (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                )}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── CONTENT ─── */}
        <div className="mt-16">
          {/* ─── CATEGORY GRID ─── */}
          {activeTab === "categories" && !selectedCategory && (
            <div className="px-1.5 sm:px-4">
              <StoreCategoriesGrid
                key={slug}
                categories={categories}
                isLoading={isCategoriesLoading}
                onSelect={(cat) => {
                  setSelectedCategory(cat);
                  setPage(1);
                }}
              />
            </div>
          )}

          {/* ─── PRODUCTS GRID ─── */}
          {(activeTab === "products" || selectedCategory) && (
            <div className="px-1.5 sm:px-4">
              <StoreProductsGrid
                key={productsKey}
                products={products}
                pagination={pagination}
                isLoading={isProductsLoading}
                isFetching={isProductsFetching}
                selectedCategory={selectedCategory}
                onBackToCategories={() => {
                  setSelectedCategory(null);
                  setPage(1);
                }}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
