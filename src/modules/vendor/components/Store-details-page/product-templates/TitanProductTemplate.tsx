import { useState } from "react";
import { useProductActions } from "../../../hooks/useProductActions";
import ProductDetailsTabs from "@/modules/website/components/products/ProductDetailsTabs";
import { StoreProductReviews } from "../StoreProductReviews";
import RelatedProductsGrid from "@/modules/website/components/products/RelatedProductsGrid";
import type { ProductTemplateProps } from "./ProductTemplateProps";
import { adaptProductToUI } from "../../../utils/productAdapter";
import { GoBackButton } from "@/components/shared/GoBackButton";

// Titan Components
import { TitanHeader } from "./titan/TitanHeader";
import { TitanVisuals } from "./titan/TitanVisuals";
import { TitanInfo } from "./titan/TitanInfo";
import { TitanLogistics } from "./titan/TitanLogistics";

export default function TitanProductTemplate({
  store,
  product,
  reviews,
  relatedProducts,
  onCartOpen,
  cartItemsCount,
  onMessageVendor,
  isMessagingLoading,
}: ProductTemplateProps) {
  const uiProduct = adaptProductToUI(product, store, reviews);

  const {
    quantity,
    setQuantity,
    liked,
    addingToCart,
    displayPrice,
    displayOriginalPrice,
    currentStock,
    handleAddToCart,
    toggleWishlist,
    selectedOptions,
    selectOption,
  } = useProductActions(uiProduct);

  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="w-full bg-black text-zinc-300 font-mono min-h-screen selection:bg-[var(--theme-primary)] selection:text-black pb-24 border-x border-zinc-900 mx-auto max-w-[1600px]">
      <TitanHeader
        store={store}
        uiProduct={uiProduct}
        onCartOpen={onCartOpen}
        cartItemsCount={cartItemsCount}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        onMessageVendor={onMessageVendor}
        isMessagingLoading={isMessagingLoading}
      />

      {/* ─── DATA GRID (MAIN CONTENT) ─── */}
      <main className="p-4 md:p-6 lg:p-8">
        <GoBackButton className="mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <TitanVisuals uiProduct={uiProduct} />

          {/* Right: Telemetry & Config (4 Cols) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
            <TitanInfo
              uiProduct={uiProduct}
              quantity={quantity}
              setQuantity={setQuantity}
              liked={liked}
              addingToCart={addingToCart}
              displayPrice={displayPrice}
              displayOriginalPrice={displayOriginalPrice}
              currentStock={currentStock}
              selectedOptions={selectedOptions}
              selectOption={selectOption}
              handleAddToCart={handleAddToCart}
              toggleWishlist={toggleWishlist}
              onMessageVendor={onMessageVendor}
              isMessagingLoading={isMessagingLoading}
            />

            <TitanLogistics uiProduct={uiProduct} />
          </div>
        </div>

        {/* ─── DATA DETAILS (TABS) ─── */}
        <div className="mt-12 border border-zinc-800 bg-zinc-950 p-6">
          <div className="text-[10px] text-[var(--theme-primary)] mb-6 opacity-50 tracking-widest uppercase">
            EXTENDED_RECORDS_MATRIX
          </div>
          <div className="prose-titan">
            <ProductDetailsTabs product={uiProduct} />
          </div>
        </div>

        {/* ─── CROWDSOURCED LOGS (REVIEWS) ─── */}
        <div className="mt-12 border border-zinc-800 bg-black p-6">
          <div className="flex flex-col md:flex-row items-baseline gap-4 mb-8 border-b border-zinc-800 pb-4">
            <h2 className="text-base sm:text-xl font-bold text-white uppercase tracking-tight">
              User Telemetry Logs
            </h2>
            <span className="text-xs text-[var(--theme-primary)] font-mono">
              [RATING: {uiProduct.rating.toFixed(1)}/5.0] -- [
              {uiProduct.reviewCount} ENTRIES]
            </span>
          </div>
          <StoreProductReviews
            productId={product.id}
            reviews={reviews}
            ratingAverage={uiProduct.rating}
            reviewCount={uiProduct.reviewCount}
          />
        </div>

        {/* ─── CORRELATED NODES (RELATED) ─── */}
        {relatedProducts?.length > 0 && (
          <div className="mt-12 border border-[var(--theme-primary)]/30 bg-black p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--theme-primary)]/5 blur-[50px] rounded-sm" />
            <div className="text-[10px] text-[var(--theme-primary)] mb-6 tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-sm bg-[var(--theme-primary)] animate-pulse" />
              CORRELATED_DATA_NODES
            </div>
            <RelatedProductsGrid products={relatedProducts} />
          </div>
        )}
      </main>
    </div>
  );
}
