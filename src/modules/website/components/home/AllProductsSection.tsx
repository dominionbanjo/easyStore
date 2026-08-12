import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/shared/ProductCard";
import { LayoutGrid, ArrowRight } from "lucide-react";
import { useGetAllProductsQuery } from "@/services/productApi";
import { ProductSection } from "./ProductSection";
import { selectLocationState } from "@/features/locationSlice";
import { useInView } from "@/modules/website/hooks/useInView";
import { WEBSITE_ROUTES } from "@/routes";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=1200&q=60";

export default function AllProductsSection() {
  const locationState = useSelector(selectLocationState);
  const { ref: sectionRef, isInView } = useInView<HTMLDivElement>({
    rootMargin: "800px 0px",
    once: true,
  });

  const { data, isLoading, isError } = useGetAllProductsQuery(
    {
      page: 1,
      limit: 20,
      state: locationState ?? undefined,
      local: locationState ? true : undefined,
    },
    { skip: !isInView },
  );

  const products = data?.data.items ?? [];

  const isEmpty = isInView && !products.length && !isLoading && !isError;

  const resolveImage = (image?: string | { url: string } | null): string => {
    if (!image) return FALLBACK_IMAGE;
    if (typeof image === "string") return image;
    return image.url;
  };

  return (
    <div ref={sectionRef} data-scroll-anchor="marketplace-collective">
      <ProductSection
        title="Marketplace Collective"
        subtitle="Explore thousands of unique products from verified local businesses. Everything you need, all in one place."
        isLoading={!isInView || isLoading}
        isError={isError}
        isEmpty={isEmpty}
        emptyIcon={LayoutGrid}
        emptyTitle="Marketplace is Quiet"
        emptyDescription="We don't have any products available right now. We're stocking up, so come back soon!"
        footerAction={
          products.length > 0 ? (
            <Link
              to={WEBSITE_ROUTES.PRODUCTS}
              className="group inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-black rounded-sm uppercase tracking-widest text-xs hover:scale-105 transition-all active:scale-95"
            >
              See More Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : undefined
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
