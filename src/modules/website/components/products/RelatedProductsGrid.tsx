import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/shared/ProductCard";
import type { IProduct } from "@/types/product/productTypes";

interface RelatedProductsGridProps {
  products: IProduct[];
  title?: string | null;
  className?: string;
  showFooter?: boolean;
}

export default function RelatedProductsGrid({
  products,
  title = "Related Products",
  className,
  showFooter = false,
}: RelatedProductsGridProps) {
  if (!products?.length) return null;

  return (
    <section className={cn("pt-10 space-y-8 px-0 sm:px-0", className)}>
      {title && (
        <h2 className="text-2xl font-bold text-foreground px-3 sm:px-0">
          {title}
        </h2>
      )}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-auto">
        {products.slice(0, 4).map((product) => {
          const image =
            typeof product.image === "string"
              ? product.image
              : (product.image?.url ?? "");

          const price = product.price;
          const discountPrice = product.discount_price;
          const isOnSale = product.on_sale;

          return (
            <ProductCard.Root
              key={product.id || product.slug}
              id={product.id}
              slug={product.slug}
              name={product.name}
              image={image}
              price={`₦${Number(price).toLocaleString()}`}
              discountPrice={
                isOnSale && discountPrice
                  ? `₦${Number(discountPrice).toLocaleString()}`
                  : undefined
              }
              isOnSale={isOnSale}
              rating={Number(product.rating_average ?? 0)}
              vendor={product.store_name ?? ""}
              storeSlug={product.store_slug}
              stock={product.stock ?? 0}
              category={product.category ?? ""}
              isFavorite={product.is_in_wishlist}
              colors={product.colors}
              sizes={product.sizes}
              options={product.options}
              variants={product.variants?.map((v) => ({
                ...v,
                image_url: v.image_url ?? undefined,
              }))}
            >
              <ProductCard.Image />
              <ProductCard.Info />
              {showFooter && <ProductCard.Footer />}

              {/* <ProductCard.Actions /> */}
            </ProductCard.Root>
          );
        })}
      </div>
    </section>
  );
}
