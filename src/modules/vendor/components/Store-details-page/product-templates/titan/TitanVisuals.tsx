import ProductGallery from "@/modules/website/components/products/ProductGallery";
import type { UIProduct } from "@/modules/vendor/utils/productAdapter";

interface TitanVisualsProps {
  uiProduct: UIProduct;
}

export function TitanVisuals({ uiProduct }: TitanVisualsProps) {
  return (
    <div className="lg:col-span-7 xl:col-span-8 flex flex-col border border-zinc-800 bg-zinc-950 p-2 md:p-4 rounded-sm relative">
      <div className="absolute top-0 right-0 p-2 text-[10px] text-[var(--theme-primary)] opacity-50">
        VISUAL_DATA_MATRIX
      </div>
      <div className="w-full">
        <ProductGallery images={uiProduct.images} />
      </div>
    </div>
  );
}
