import { ProductCard } from "@/components/shared/ProductCard";
import { useGetFeaturedProductsQuery } from "@/services/productApi";
import { Sparkles, ArrowRight } from "lucide-react";
import { ProductSection } from "./ProductSection";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=1200&q=60";

export default function FeaturedProductsSection() {
  const { data, isLoading, isError } = useGetFeaturedProductsQuery({
    limit: 8,
  });

  const products = data?.data ?? [];

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
        <Link to="/stores">
          <Button
            variant="ghost"
            className="group text-primary hover:text-primary hover:bg-primary/5"
          >
            Discover Stores
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      }
    >
      {products.map((product) => {
        const rawPrice = product.discount_price ?? product.price;
        const price = Number(rawPrice) || 0;

        return (
          <ProductCard.Root
            key={product.id}
            id={product.id}
            slug={product.slug}
            name={product.name}
            image={
              typeof product.image === "string"
                ? product.image
                : (product.image?.url ?? FALLBACK_IMAGE)
            }
            price={`₦${price.toLocaleString("en-NG")}`}
            rating={product.rating_average ?? 0}
            stock={product.stock}
            vendor={product.store_name ?? "Seller"}
            storeSlug={product.store_slug}
            isFavorite={product.is_in_wishlist}
            colors={product.colors}
            sizes={product.sizes}
            category={product.category}
          >
            <ProductCard.Image />
            <ProductCard.Info />
          </ProductCard.Root>
        );
      })}
    </ProductSection>
  );
}
