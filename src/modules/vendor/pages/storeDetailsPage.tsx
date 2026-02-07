import { useState } from "react";
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

/* ───────────────── COMPONENT ───────────────── */

export default function StoreDetailsPage() {
  const { slug } = useParams<{ slug: string }>();

  const [activeTab, setActiveTab] = useState<"products" | "categories">(
    "products",
  );
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    name: string;
  } | null>(null);

  /* ─── STORE DETAILS ─── */

  const { data: storeData, isLoading: storeLoading } = useGetStoreDetailsQuery(
    { slug: slug ?? "", includeCategories: true },
    { skip: !slug },
  );

  /* ─── ALL PRODUCTS ─── */

  const {
    data: productsData,
    isLoading: productsLoading,
    isFetching: productsFetching,
  } = useGetStoreProductsQuery(
    { slug: slug ?? "", page, limit: 20 },
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
    activeTab === "products" ? productsFetching : categoryFetching;

  const productsKey =
    activeTab === "products"
      ? "all-products"
      : selectedCategory
        ? `category-${selectedCategory.id}`
        : "no-category";

  /* ─── STORE LOADING STATE ─── */

  if (storeLoading || !store) {
    return (
      <div className="min-h-screen bg-neutral-50/50 py-20 px-1.5 sm:px-4">
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

  const isCategoriesLoading = storeLoading;

  /* ───────────────── RENDER ───────────────── */

  return (
    <section className="min-h-screen bg-neutral-50/50 pb-20 mt-10">
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
          website: store.website ?? undefined,
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
          }}
        />

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
