import { useRef, useState } from "react";
import { ProductCard } from "@/components/shared/ProductCard";
import { Pagination } from "@/components/shared/Pagination";
import { LayoutGrid } from "lucide-react";
import { useGetAllProductsQuery } from "@/services/productApi";
import { ProductSection } from "./ProductSection";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=1200&q=60";

export default function AllProductsSection() {
  const titleRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError } = useGetAllProductsQuery({
    page,
    limit: 20,
  });

  const products = data?.data.items ?? [];
  const pagination = data?.data.pagination;

  const resolveImage = (image?: string | { url: string } | null): string => {
    if (!image) return FALLBACK_IMAGE;
    if (typeof image === "string") return image;
    return image.url;
  };

  return (
    <div ref={titleRef}>
      <ProductSection
        title="Marketplace Collective"
        subtitle="Explore thousands of unique products from verified local businesses. Everything you need, all in one place."
        isLoading={isLoading || isFetching}
        isError={isError}
        isEmpty={!products.length && !isLoading && !isFetching}
        emptyIcon={LayoutGrid}
        emptyTitle="Marketplace is Quiet"
        emptyDescription="We don't have any products available right now. We're stocking up, so come back soon!"
        footerAction={
          pagination &&
          pagination.pages > 1 && (
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              hasNext={pagination.hasNext}
              hasPrev={pagination.hasPrev}
              onPageChange={(p) => {
                setPage(p);
                requestAnimationFrame(() => {
                  titleRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                });
              }}
            />
          )
        }
      >
        {products.map((product) => {
          return (
            <ProductCard
              key={product.id}
              id={product.id}
              slug={product.slug}
              name={product.name}
              image={resolveImage(product.image)}
              price={`₦${Number(product.price).toLocaleString("en-NG")}`}
              discountPrice={
                product.on_sale && product.discount_price
                  ? `₦${Number(product.discount_price).toLocaleString("en-NG")}`
                  : undefined
              }
              isOnSale={product.on_sale}
              rating={product.rating_average ?? 0}
              stock={product.stock}
              vendor={product.store_name ?? "Seller"}
              storeSlug={product.store_slug}
              isFavorite={product.is_in_wishlist}
              colors={product.colors}
              sizes={product.sizes}
              options={product.options}
              variants={product.variants?.map((v) => ({
                ...v,
                image_url: v.image_url ?? undefined,
              }))}
              category={product.category}
            />
          );
        })}
      </ProductSection>
    </div>
  );
}
