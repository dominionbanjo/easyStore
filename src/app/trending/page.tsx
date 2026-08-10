import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { TrendingUp } from "lucide-react";
import { useGetTrendingRecommendationsQuery } from "@/services/recommendationApi";
import { useSearchProductsQuery } from "@/services/productApi";
import { selectLocationState } from "@/features/locationSlice";
import ProductListingPage from "@/modules/website/components/products/ProductListingPage";
import { useInfiniteList } from "@/modules/website/hooks/useInfiniteList";
import {
  browseKey,
  hasActiveBrowseFilters,
  mapSearchParamsToArgs,
} from "@/modules/website/utils/searchParams";
import type {
  ISearchProductsResponse,
  IProduct,
  SearchProductsArgs,
} from "@/types/product/productTypes";
import type { IRecommendationResponse } from "@/types/recommendation/recommendationTypes";

export default function TrendingProductsPage() {
  const [searchParams] = useSearchParams();
  const locationState = useSelector(selectLocationState);
  const hasFilters = hasActiveBrowseFilters(searchParams);
  const mappedArgs = useMemo(
    () => mapSearchParamsToArgs(searchParams),
    [searchParams],
  );

  // Clean state = recommendation-engine trending; any filter/sort = search.
  const buildArgs = useCallback(
    (page: number): SearchProductsArgs =>
      hasFilters
        ? {
            ...mappedArgs,
            q: "",
            page,
            state: mappedArgs.state ?? locationState ?? undefined,
            local: mappedArgs.state ? undefined : locationState ? true : undefined,
          }
        : { page, q: "", state: locationState ?? undefined },
    [mappedArgs, hasFilters, locationState],
  );

  const queryHook = hasFilters
    ? useSearchProductsQuery
    : useGetTrendingRecommendationsQuery;

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
    IRecommendationResponse | ISearchProductsResponse
  >(queryHook, buildArgs, {
    limit: 12,
    key: browseKey(`trending|${locationState ?? "none"}`, searchParams),
  });

  const filters = (
    currentData as ISearchProductsResponse | undefined
  )?.data?.filters ?? {};

  return (
    <ProductListingPage
      title="Trending Now"
      subtitle="The most popular items on EazyStore right now. Don't miss out on what everyone is talking about."
      icon={TrendingUp}
      badgeText="Going Fast"
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
