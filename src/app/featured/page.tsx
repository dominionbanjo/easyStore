import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Sparkles } from "lucide-react";
import {
  useGetFeaturedProductsQuery,
  useSearchProductsQuery,
} from "@/services/productApi";
import ProductListingPage from "@/modules/website/components/products/ProductListingPage";
import { useInfiniteList } from "@/modules/website/hooks/useInfiniteList";
import {
  browseKey,
  hasActiveBrowseFilters,
  mapSearchParamsToArgs,
} from "@/modules/website/utils/searchParams";
import type {
  IFeaturedProductsResponse,
  ISearchProductsResponse,
  IProduct,
  SearchProductsArgs,
} from "@/types/product/productTypes";

export default function FeaturedProductsPage() {
  const [searchParams] = useSearchParams();
  const hasFilters = hasActiveBrowseFilters(searchParams);
  const mappedArgs = useMemo(
    () => mapSearchParamsToArgs(searchParams),
    [searchParams],
  );

  // Clean state = curated featured feed; any filter/sort = marketplace search.
  const buildArgs = useCallback(
    (page: number): SearchProductsArgs =>
      hasFilters ? { ...mappedArgs, q: "", page } : { page, q: "", sort: "newest" },
    [mappedArgs, hasFilters],
  );

  const queryHook = hasFilters
    ? useSearchProductsQuery
    : useGetFeaturedProductsQuery;

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
  } = useInfiniteList<
    IProduct,
    SearchProductsArgs,
    IFeaturedProductsResponse | ISearchProductsResponse
  >(queryHook, buildArgs, {
    limit: 12,
    key: browseKey("featured", searchParams),
  });

  const filters = (
    currentData as ISearchProductsResponse | undefined
  )?.data?.filters ?? {};

  return (
    <ProductListingPage
      title="Featured Collection"
      subtitle="Handpicked premium selection from our top-rated vendors. Quality meets affordability."
      icon={Sparkles}
      badgeText="Curated Selection"
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
