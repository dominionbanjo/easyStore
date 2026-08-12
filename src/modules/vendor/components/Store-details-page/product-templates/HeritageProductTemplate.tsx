import { useState } from "react";
import { useProductActions } from "../../../hooks/useProductActions";

import ProductDetailsTabs from "@/modules/website/components/products/ProductDetailsTabs";
import { StoreProductReviews } from "../StoreProductReviews";
import RelatedProductsGrid from "@/modules/website/components/products/RelatedProductsGrid";
import type { ProductTemplateProps } from "./ProductTemplateProps";
import { adaptProductToUI } from "../../../utils/productAdapter";
import { GoBackButton } from "@/components/shared/GoBackButton";

// Heritage Components
import { HeritageHeader } from "./heritage/HeritageHeader";
import { HeritageShowcase } from "./heritage/HeritageShowcase";

export default function HeritageProductTemplate({
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
    <div className="w-full bg-[#F4EDE4] dark:bg-[#2C2622] text-[#3D352B] dark:text-[#EAE3DB] font-serif min-h-screen pb-24 selection:bg-[#8C7A6B] selection:text-white">
      <HeritageHeader
        store={store}
        uiProduct={uiProduct}
        onCartOpen={onCartOpen}
        cartItemsCount={cartItemsCount}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        onMessageVendor={onMessageVendor}
        isMessagingLoading={isMessagingLoading}
      />

      {/* ─── SHOWCASE MAIN ─── */}
      <main className="max-w-[1400px] mx-auto px-1 sm:px-8 py-8 md:py-12">
        <GoBackButton className="mb-6" />
        <HeritageShowcase
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

        {/* ─── TABS ─── */}
        <div className="mt-16 bg-white dark:bg-[#1E1A17] rounded-sm p-6 md:p-12  border border-[#EADDCE] dark:border-[#3D352B]">
          <ProductDetailsTabs product={uiProduct} />
        </div>

        {/* ─── APPRECIATION (REVIEWS) ─── */}
        <div className="mt-16 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold italic text-[#2C2622] dark:text-white mb-8 border-b border-[#EADDCE] dark:border-[#3D352B] pb-6 inline-block">
            Words of Appreciation
          </h2>
          <div className="bg-white dark:bg-[#1E1A17] rounded-sm p-6 md:p-12  border border-[#EADDCE] dark:border-[#3D352B] text-left">
            <StoreProductReviews
              productId={product.id}
              reviews={reviews}
              ratingAverage={uiProduct.rating}
              reviewCount={uiProduct.reviewCount}
            />
          </div>
        </div>

        {/* ─── RELATED CRAFTS ─── */}
        {relatedProducts?.length > 0 && (
          <div className="mt-16 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold italic text-[#2C2622] dark:text-white mb-8">
              Similar Crafts from {store.store_name}
            </h2>
            <RelatedProductsGrid products={relatedProducts} />
          </div>
        )}
      </main>
    </div>
  );
}
