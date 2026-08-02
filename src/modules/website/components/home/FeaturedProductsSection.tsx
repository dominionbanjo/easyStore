import { ProductCard } from "@/components/shared/ProductCard";
import { useGetFeaturedProductsQuery } from "@/services/productApi";
import { useSelector } from "react-redux";
import { Sparkles, ArrowRight } from "lucide-react";
import { ProductSection } from "./ProductSection";
import SmartLink from "@/components/shared/SmartLink";
import { Button } from "@/components/ui/button";
import { selectLocationState } from "@/features/locationSlice";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=1200&q=60";

export default function FeaturedProductsSection() {
  const locationState = useSelector(selectLocationState);
  const { data, isLoading, isError } = useGetFeaturedProductsQuery({
    limit: 8,
    state: locationState ?? undefined,
    local: locationState ? true : undefined,
  });

  const products = data?.data?.items ?? [];

  return (
    <ProductSection
      title="Featured Deals"
      subtitle="Handpicked premium selection from our top-rated vendors. Quality meets affordability."
      isLoading={isLoading}
      isError={isError}
      isEmpty={!products.length}
      emptyIcon={Sparkles}
      emptyTitle="New Deals Coming Soon"
      emptyDescription="We're currently scouting for the best products to feature here. Keep an eye out!"
      className="bg-muted/10"
      headerAction={
        <SmartLink to="/stores">
          <Button
            variant="ghost"
            className="group text-primary hover:text-primary hover:bg-primary/5 p-0 h-auto font-bold text-base"
          >
            Discover More
            <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </SmartLink>
      }
    >
      {products.map((product) => {
        return (
          <ProductCard
            key={product.id}
            id={product.id}
            slug={product.slug}
            name={product.name}
            image={
              typeof product.image === "string"
                ? product.image
                : (product.image?.url ?? FALLBACK_IMAGE)
            }
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
  );
}
