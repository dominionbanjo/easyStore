import { ProductCard } from "@/components/shared/ProductCard";
import { USER_ROUTES } from "@/routes/temp";
import { useNavigate } from "react-router-dom";
import { useGetFeaturedProductsQuery } from "@/services/productApi";
import { Skeleton } from "@/components/ui/skeleton";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=1200&q=60";

export default function FeaturedProductsSection() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetFeaturedProductsQuery({
    limit: 8,
  });

  const products = data?.data ?? [];

  /* ───────────────── LOADING STATE ───────────────── */

  if (isLoading) {
    return (
      <section className="py-20 px-2 bg-card">
        <div className="mx-auto text-center space-y-10">
          <h2 className="text-3xl font-semibold text-primary">
            Featured Products
          </h2>
          <Skeleton className="h-8 w-64 mx-auto rounded-md" />

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-auto px-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[320px] rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ───────────────── EMPTY / ERROR STATE ───────────────── */

  if (isError || !products.length) {
    return (
      <section className="py-20 px-2 bg-card text-center">
        <p>No featured products available.</p>
      </section>
    );
  }

  /* ───────────────── RENDER ───────────────── */

  return (
    <section className="py-20 px-2 bg-card">
      <div className="mx-auto text-center space-y-10">
        <h2 className="text-3xl font-semibold text-primary">
          Featured Products
        </h2>

        {/* Responsive Grid */}
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-auto px-4">
          {products.map((product) => {
            const price = product.discount_price ?? product.price;

            return (
              <ProductCard.Root
                key={product.id}
                id={product.id}
                name={product.name}
                image={
                  typeof product.image === "string"
                    ? product.image
                    : product.image?.url ?? FALLBACK_IMAGE
                }
                price={`₦${price.toLocaleString()}`}
                rating={product.rating_average ?? 0}
                stock={product.stock}
                vendor={product.store_name ?? "Seller"}
                isFavorite={product.is_in_wishlist}
              >
                <ProductCard.Image />
                <ProductCard.Info
                  onClick={() =>
                    navigate(
                      USER_ROUTES.PRODUCT_DETAIL.replace(":id", product.slug)
                    )
                  }
                />
              </ProductCard.Root>
            );
          })}
        </div>
      </div>
    </section>
  );
}
