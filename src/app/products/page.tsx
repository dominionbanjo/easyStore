import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import { useSearchProductsQuery } from "@/services/productApi";
import ProductListingPage from "@/modules/website/components/products/ProductListingPage";
import { useInfiniteList } from "@/modules/website/hooks/useInfiniteList";
import {
  browseKey,
  mapSearchParamsToArgs,
} from "@/modules/website/utils/searchParams";
import type {
  ISearchProductsResponse,
  IProduct,
  SearchProductsArgs,
} from "@/types/product/productTypes";

export default function AllProductsPage() {
  const [searchParams] = useSearchParams();
  const mappedArgs = useMemo(
    () => mapSearchParamsToArgs(searchParams),
    [searchParams],
  );

  const buildArgs = useCallback(
    (page: number): SearchProductsArgs => ({ ...mappedArgs, q: "", page }),
    [mappedArgs],
  );

  const {
    items: products,
    isLoading,
    isFetching,
    isInitialError,
    pageLoadFailed,
    hasLoaded,
    total,
    sentinelRef,
    loadMore,
    currentData,
  } = useInfiniteList<IProduct, SearchProductsArgs, ISearchProductsResponse>(
    useSearchProductsQuery,
    buildArgs,
    { limit: 20, key: browseKey("products", searchParams) },
  );

  const filters = currentData?.data.filters ?? {};

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
      total={total}
      filters={filters}
      sentinelRef={sentinelRef}
    />
  );
}
