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
    <ProductCard
      id={data.id}
      slug={data.slug}
      image={
        typeof data.image === "string" ? data.image : data.image?.url || ""
      }
      name={data.name}
      price={`₦${Number(data.price).toLocaleString("en-NG")}`}
      discountPrice={
        data.on_sale && data.discount_price
          ? `₦${Number(data.discount_price).toLocaleString("en-NG")}`
          : undefined
      }
      category={data.category || "General"}
      rating={data.rating_average || 0}
      stock={data.stock}
      vendor={data.store_name || "EazyStore"}
      storeSlug={data.store_slug}
      colors={data.colors}
      sizes={data.sizes}
      options={data.options}
      variants={data.variants?.map((v) => ({
        ...v,
        image_url: v.image_url ?? undefined,
      }))}
      isOnSale={data.on_sale}
      isFavorite={data.is_in_wishlist}
      className={className}
    />
  );
}
