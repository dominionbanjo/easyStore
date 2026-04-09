import { TrendingUp } from "lucide-react";
import { useGetAllProductsQuery } from "@/services/productApi";
import { useState } from "react";
import ProductListingPage from "@/modules/website/components/products/ProductListingPage";

export default function TrendingProductsPage() {
  const [page, setPage] = useState(1);
  const {
    data: productsData,
    isLoading,
    isFetching,
  } = useGetAllProductsQuery({
    sort: "rating",
    limit: 12,
    page,
  } as any);

  const products = productsData?.data?.items ?? [];
  const pagination = productsData?.data?.pagination;

  return (
    <ProductListingPage
      title="Trending Now"
      subtitle="The most popular items on EazyStore right now. Don't miss out on what everyone is talking about."
      icon={TrendingUp}
      badgeText="Going Fast"
      badgeColor="bg-orange-500"
      badgeTextColor="text-orange-500"
      gradientFrom="from-orange-500"
      gradientTo="to-red-500"
      isLoading={isLoading || isFetching}
      products={products}
      pagination={pagination}
      onPageChange={setPage}
    />
  );
}
