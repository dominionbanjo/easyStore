import { useCallback } from "react";
import { TrendingUp } from "lucide-react";
import { useSelector } from "react-redux";
import { useGetTrendingRecommendationsQuery } from "@/services/recommendationApi";
import { selectLocationState } from "@/features/locationSlice";
import ProductListingPage from "@/modules/website/components/products/ProductListingPage";
import { useInfiniteList } from "@/modules/website/hooks/useInfiniteList";
import type { IRecommendationResponse } from "@/types/recommendation/recommendationTypes";
import type { IProduct } from "@/types/product/productTypes";

export default function TrendingProductsPage() {
  const locationState = useSelector(selectLocationState);

  const buildArgs = useCallback(
    (page: number) => ({ page, state: locationState ?? undefined }),
    [locationState],
  );

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
    { page: number; state: string | undefined },
    IRecommendationResponse
  >(useGetTrendingRecommendationsQuery, buildArgs, {
    limit: 12,
    key: locationState ?? "none",
  });

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
      sentinelRef={sentinelRef}
    />
  );
}
