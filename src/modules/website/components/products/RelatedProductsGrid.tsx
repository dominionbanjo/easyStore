import { ProductCard } from "@/components/shared/ProductCard";
import type { IProduct } from "@/types/product/productTypes";
import { useNavigate } from "react-router-dom";
import { USER_ROUTES } from "@/routes/temp";

interface RelatedProductsGridProps {
  products: IProduct[];
}

export default function RelatedProductsGrid({
  products,
}: RelatedProductsGridProps) {
  const navigate = useNavigate();

  if (!products?.length) return null;

  return (
    <section className="pt-16 space-y-8">
      <h2 className="text-2xl font-semibold text-gray-900">Related Products</h2>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-auto px-4">
        {products.slice(0, 4).map((product) => {
          const image =
            typeof product.image === "string"
              ? product.image
              : product.image?.url ?? "";

          const price = product.discount_price ?? product.price;

          return (
            <ProductCard.Root
              key={product.id}
              id={product.id}
              name={product.name}
              image={image}
              price={`₦${Number(price).toLocaleString()}`}
              rating={Number(product.rating_average ?? 0)}
              vendor={product.store_name ?? ""}
              stock={product.stock ?? 0}
              category=""
            >
              <ProductCard.Image />
              <ProductCard.Info
                onClick={() =>
                  navigate(
                    USER_ROUTES.PRODUCT_DETAIL.replace(":id", product.slug)
                  )
                }
              />
              {/* <ProductCard.Actions /> */}
            </ProductCard.Root>
          );
        })}
      </div>
    </section>
  );
}
