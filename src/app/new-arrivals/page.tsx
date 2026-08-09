import { Zap } from "lucide-react";
import { useGetAllProductsQuery } from "@/services/productApi";
import { useState } from "react";
import ProductListingPage from "@/modules/website/components/products/ProductListingPage";

export default function NewArrivalsPage() {
  const [page, setPage] = useState(1);
  const {
    data: productsData,
    isLoading,
    isFetching,
  } = useGetAllProductsQuery({
    sort: "newest",
    limit: 12,
    page,
  });

  const products = productsData?.data?.items ?? [];
  const pagination = productsData?.data?.pagination;

  return (
    <ProductListingPage
      title="Fresh Drops"
      subtitle="Be the first to cop the latest gear. Updated daily with the hottest new products."
      icon={Zap}
      badgeText="Just Landed"
      isLoading={isLoading || isFetching}
      products={products}
      pagination={pagination}
      onPageChange={setPage}
    />
  );
}
