import ProductGallery from "@/modules/website/components/products/ProductGallery";
import type { UIProduct } from "@/modules/vendor/utils/productAdapter";

interface DefaultVisualsProps {
  uiProduct: UIProduct;
}

export function DefaultVisuals({ uiProduct }: DefaultVisualsProps) {
  return (
    <div className="w-full bg-zinc-50/50 dark:bg-zinc-900/20 p-4 md:p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800">
      <ProductGallery images={uiProduct.images} />
    </div>
  );
}
