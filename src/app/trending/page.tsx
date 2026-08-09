import { TrendingUp } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetTrendingRecommendationsQuery } from "@/services/recommendationApi";
import { selectLocationState } from "@/features/locationSlice";
import ProductListingPage from "@/modules/website/components/products/ProductListingPage";

export default function TrendingProductsPage() {
  const [page, setPage] = useState(1);
  const locationState = useSelector(selectLocationState);

  const {
    data: productsData,
    isLoading,
    isFetching,
  } = useGetTrendingRecommendationsQuery({
    limit: 12,
    page,
    state: locationState ?? undefined,
  });

  const products = productsData?.data?.items ?? [];
  const pagination = productsData?.data?.pagination;

  return (
    <ProductListingPage
      title="Trending Now"
      subtitle="The most popular items on EazyStore right now. Don't miss out on what everyone is talking about."
      icon={TrendingUp}
      badgeText="Going Fast"
      isLoading={isLoading || isFetching}
      products={products}
      pagination={pagination}
      onPageChange={setPage}
    />
  );
}
