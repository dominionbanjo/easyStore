import { useCallback } from "react";
import { Sparkles } from "lucide-react";
import { useGetFeaturedProductsQuery } from "@/services/productApi";
import ProductListingPage from "@/modules/website/components/products/ProductListingPage";
import { useInfiniteList } from "@/modules/website/hooks/useInfiniteList";
import type {
  IFeaturedProductsResponse,
  IProduct,
} from "@/types/product/productTypes";

export default function FeaturedProductsPage() {
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
    IFeaturedProductsResponse
  >(useGetFeaturedProductsQuery, buildArgs, { limit: 12 });

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
      sentinelRef={sentinelRef}
    />
  );
}
