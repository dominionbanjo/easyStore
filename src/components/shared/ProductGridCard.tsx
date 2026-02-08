import { ProductCard } from "@/components/shared/ProductCard";
import type { IProduct } from "@/types/product/productTypes";

interface ProductGridCardProps {
  data: IProduct;
  className?: string;
}

export default function ProductGridCard({
  data,
  className,
}: ProductGridCardProps) {
  return (
    <ProductCard.Root
      id={data.id}
      slug={data.slug}
      image={
        typeof data.image === "string" ? data.image : data.image?.url || ""
      }
      name={data.name}
      price={`$${data.price}`}
      discountPrice={
        data.discount_price ? `$${data.discount_price}` : undefined
      }
      category={data.category || "General"}
      rating={data.rating_average || 0}
      stock={data.stock}
      vendor={data.store_name || "EasyStore"}
      storeSlug={data.store_slug}
      colors={data.colors}
      sizes={data.sizes}
      isOnSale={data.on_sale}
      isFavorite={data.is_in_wishlist}
      className={className}
    >
      <ProductCard.Image />
      <ProductCard.Info />
      <ProductCard.Footer />
    </ProductCard.Root>
  );
}
