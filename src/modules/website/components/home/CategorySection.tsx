import { TabbedGrid } from "@/components/shared/TabbedGrid";
import { ProductCard } from "@/components/shared/ProductCard";
import { useNavigate } from "react-router-dom";
import { USER_ROUTES } from "@/routes/temp";
import { useGetProductsGroupedByCategoryQuery } from "@/services/productApi";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=1200&q=60";

export default function CategoriesSection() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetProductsGroupedByCategoryQuery({
    limit: 16,
  });

  if (isLoading) {
    return <div className="py-20 text-center">Loading categories…</div>;
  }

  if (isError || !data?.data?.length) {
    return <div className="py-20 text-center">No products available.</div>;
  }

  const tabGroups = data.data.map((category) => ({
    value: category.slug,
    label: category.name,
    items: category.products,
  }));
  const resolveImage = (
    image?: string | { url: string } | null,
    fallback?: string
  ): string => {
    if (!image) return fallback ?? "";
    if (typeof image === "string") return image;
    return image.url;
  };

  return (
    <TabbedGrid
      tabGroups={tabGroups}
      renderItem={(product) => {
        const price = product.discount_price ?? product.price;

        return (
          <ProductCard.Root
            key={product.id}
            id={product.id}
            name={product.name}
            image={resolveImage(product.image, FALLBACK_IMAGE)}
            price={`₦${price.toLocaleString()}`}
            stock={product.stock}
            rating={product.rating_average ?? 0}
            category=""
            vendor={product.store_name ?? "Seller"}
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
      }}
    />
  );
}
