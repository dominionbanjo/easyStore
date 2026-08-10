import { useCallback } from "react";
import { LayoutGrid } from "lucide-react";
import { useGetAllProductsQuery } from "@/services/productApi";
import ProductListingPage from "@/modules/website/components/products/ProductListingPage";
import { useInfiniteList } from "@/modules/website/hooks/useInfiniteList";
import type {
  IPaginatedResponse,
  IProduct,
} from "@/types/product/productTypes";

export default function AllProductsPage() {
  const buildArgs = useCallback((page: number) => ({ page }), []);

  const {
    items: products,
    isLoading,
    isFetching,
    isInitialError,
    pageLoadFailed,
    hasLoaded,
    sentinelRef,
    loadMore,
  } = useInfiniteList<
    IProduct,
    { page: number },
    IPaginatedResponse<IProduct>
  >(useGetAllProductsQuery, buildArgs, { limit: 20 });

  return (
    <ProductListingPage
      title="All Products"
      subtitle="Explore thousands of unique products from verified local businesses. Everything you need, all in one place."
      icon={LayoutGrid}
      badgeText="Marketplace"
      isLoading={isLoading}
      isFetching={isFetching}
      isInitialError={isInitialError}
      pageLoadFailed={pageLoadFailed}
      hasLoaded={hasLoaded}
      loadMore={loadMore}
      products={products}
      sentinelRef={sentinelRef}
    />
  );
}
