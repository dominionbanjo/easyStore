import { useCallback } from "react";
import { Zap } from "lucide-react";
import { useGetAllProductsQuery } from "@/services/productApi";
import ProductListingPage from "@/modules/website/components/products/ProductListingPage";
import { useInfiniteList } from "@/modules/website/hooks/useInfiniteList";
import type { IPaginatedResponse, IProduct } from "@/types/product/productTypes";

export default function NewArrivalsPage() {
  const buildArgs = useCallback(
    (page: number) => ({ page, sort: "newest" }),
    [],
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
    { page: number; sort: string },
    IPaginatedResponse<IProduct>
  >(useGetAllProductsQuery, buildArgs, { limit: 12 });

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
      sentinelRef={sentinelRef}
    />
  );
}
