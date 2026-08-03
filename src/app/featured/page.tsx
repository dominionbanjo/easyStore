import { Sparkles } from "lucide-react";
import { useGetFeaturedProductsQuery } from "@/services/productApi";
import { useState } from "react";
import ProductListingPage from "@/modules/website/components/products/ProductListingPage";

export default function FeaturedProductsPage() {
  const [page, setPage] = useState(1);
  // Ensure the query handles pagination server-side correctly or client-side if needed.
  // The backend was updated to support pagination for featured products.
  const {
    data: featuredData,
    isLoading,
    isFetching,
  } = useGetFeaturedProductsQuery({
    limit: 12,
    page,
    sort: "newest", // If sorting is needed
  });

  const products = featuredData?.data?.items ?? [];
  const pagination = featuredData?.data?.pagination;

  return (
    <ProductListingPage
      title="Featured Collection"
      subtitle="Handpicked premium selection from our top-rated vendors. Quality meets affordability."
      icon={Sparkles}
      badgeText="Curated Selection"
      badgeColor="bg-purple-500"
      badgeTextColor="text-purple-500"
      gradientFrom="from-purple-500"
      gradientTo="to-pink-500"
      isLoading={isLoading || isFetching}
      products={products}
      pagination={pagination}
      onPageChange={setPage}
    />
  );
}
