import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Zap } from "lucide-react";
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

export default function NewArrivalsPage() {
  const [searchParams] = useSearchParams();
  const mappedArgs = useMemo(
    () => mapSearchParamsToArgs(searchParams),
    [searchParams],
  );

  // Fresh drops default: newest first unless the user picks another sort.
  const buildArgs = useCallback(
    (page: number): SearchProductsArgs => ({
      ...mappedArgs,
      q: "",
      sort: mappedArgs.sort ?? "date_desc",
      page,
    }),
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
    { limit: 12, key: browseKey("new-arrivals", searchParams) },
  );

  const filters = currentData?.data.filters ?? {};

  return (
    <ProductListingPage
      title="Fresh Drops"
      subtitle="Be the first to cop the latest gear. Updated daily with the hottest new products."
      icon={Zap}
      badgeText="Just Landed"
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
