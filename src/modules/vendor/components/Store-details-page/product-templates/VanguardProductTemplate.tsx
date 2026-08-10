import { useState } from "react";
import { StoreProductReviews } from "../StoreProductReviews";
import RelatedProductsGrid from "@/modules/website/components/products/RelatedProductsGrid";
import { useProductActions } from "../../../hooks/useProductActions";
import type { ProductTemplateProps } from "./ProductTemplateProps";
import { adaptProductToUI } from "../../../utils/productAdapter";
import { GoBackButton } from "@/components/shared/GoBackButton";

// Vanguard Components
import { VanguardHeader } from "./vanguard/VanguardHeader";
import { VanguardMain } from "./vanguard/VanguardMain";

export default function VanguardProductTemplate({
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
    liked,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
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
    <div className="w-full bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 font-serif min-h-screen pb-24">
      <VanguardHeader
        store={store}
        uiProduct={uiProduct}
        onCartOpen={onCartOpen}
        cartItemsCount={cartItemsCount}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        onMessageVendor={onMessageVendor}
        isMessagingLoading={isMessagingLoading}
      />

      <div className="max-w-[1400px] mx-auto px-1.5 sm:px-6 pt-6 sm:pt-8">
        <GoBackButton />
      </div>

      {/* ─── PRODUCT MAIN ─── */}
      <VanguardMain
        uiProduct={uiProduct}
        liked={liked}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
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

      {/* ─── REVIEWS ─── */}
      <div className="mt-20 md:mt-32 max-w-4xl mx-auto px-2 sm:px-0">
        <StoreProductReviews
          productId={product.id}
          reviews={reviews}
          ratingAverage={uiProduct.rating}
          reviewCount={uiProduct.reviewCount}
        />
      </div>

      {/* ─── RELATED PRODUCTS ─── */}
      {relatedProducts?.length > 0 && (
        <div className="mt-20 md:mt-32 border-t border-zinc-100 dark:border-zinc-900 pt-12 md:pt-16 px-1.5 sm:px-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-light font-serif text-center mb-8 sm:mb-12">
            Related Pieces
          </h2>
          <RelatedProductsGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
