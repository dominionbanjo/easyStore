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
    "products"
  );
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    name: string;
  } | null>(null);

  /* ─── STORE DETAILS ─── */

  const { data: storeData, isLoading: storeLoading } = useGetStoreDetailsQuery(
    { slug: slug ?? "", includeCategories: true },
    { skip: !slug }
  );

  /* ─── ALL PRODUCTS ─── */

  const {
    data: productsData,
    isLoading: productsLoading,
    isFetching: productsFetching,
  } = useGetStoreProductsQuery(
    { slug: slug ?? "", page, limit: 20 },
    { skip: activeTab !== "products" }
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
    { skip: activeTab !== "categories" || !selectedCategory }
  );

  /* ─── NORMALIZED DATA ─── */

  const store = storeData?.data.store;
  const categories = storeData?.data.categories ?? [];

  const products =
    activeTab === "products"
      ? productsData?.data.items ?? []
      : categoryProductsData?.data.items ?? [];

  const pagination =
    activeTab === "products"
      ? productsData?.data.pagination
      : categoryProductsData?.data.pagination;

  const isProductsLoading =
    activeTab === "products"
      ? productsLoading || productsFetching
      : categoryLoading || categoryFetching;

  /* ─── STORE LOADING STATE ─── */

  if (storeLoading || !store) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <Skeleton className="h-[300px] rounded-2xl mb-8" />
      </div>
    );
  }

  /* ───────────────── RENDER ───────────────── */

  return (
    <section className="min-h-screen bg-muted/30">
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
          location: store.address ?? "Location not specified",
          email: store.email ?? undefined,
          phone: store.phone_number ?? undefined,
          website: store.website ?? undefined,
          totalProducts: store.total_products ?? 0,
        }}
      />

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
      <div className="mt-10 px-4">
        {/* ─── CATEGORY GRID ─── */}
        {activeTab === "categories" && !selectedCategory && (
          <StoreCategoriesGrid
            categories={categories}
            onSelect={(cat) => {
              setSelectedCategory(cat);
              setPage(1);
            }}
          />
        )}

        {/* ─── PRODUCTS GRID ─── */}
        {(activeTab === "products" || selectedCategory) && (
          <StoreProductsGrid
            products={products}
            pagination={pagination}
            isLoading={isProductsLoading}
            selectedCategory={selectedCategory}
            onBackToCategories={() => {
              setSelectedCategory(null);
              setPage(1);
            }}
            onPageChange={(p) => {
              setPage(p);
            }}
          />
        )}
      </div>
    </section>
  );
}
