import { useState } from "react";
import { useProductActions } from "../../../hooks/useProductActions";
import ProductDetailsTabs from "@/modules/website/components/products/ProductDetailsTabs";
import { StoreProductReviews } from "../StoreProductReviews";
import RelatedProductsGrid from "@/modules/website/components/products/RelatedProductsGrid";
import type { ProductTemplateProps } from "./ProductTemplateProps";
import { adaptProductToUI } from "../../../utils/productAdapter";
import { GoBackButton } from "@/components/shared/GoBackButton";

// Editorial Components
import { EditorialHeader } from "./editorial/EditorialHeader";
import { EditorialNarrative } from "./editorial/EditorialNarrative";

export default function EditorialProductTemplate({
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
    <div className="w-full bg-[#FDFBF7] dark:bg-[#1A1A1A] text-[#2C2C2C] dark:text-[#EAEAEA] font-serif min-h-screen">
      <EditorialHeader
        store={store}
        onCartOpen={onCartOpen}
        cartItemsCount={cartItemsCount}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        onMessageVendor={onMessageVendor}
        isMessagingLoading={isMessagingLoading}
      />

      <div className="max-w-7xl mx-auto px-2 sm:px-6 pt-6 sm:pt-8">
        <GoBackButton />
      </div>

      <EditorialNarrative
        uiProduct={uiProduct}
        quantity={quantity}
        setQuantity={setQuantity}
        liked={liked}
        addingToCart={addingToCart}
        currentStock={currentStock}
        displayPrice={displayPrice}
        displayOriginalPrice={displayOriginalPrice}
        selectedOptions={selectedOptions}
        selectOption={selectOption}
        handleAddToCart={handleAddToCart}
        toggleWishlist={toggleWishlist}
        onMessageVendor={onMessageVendor}
        isMessagingLoading={isMessagingLoading}
      />

      {/* ─── APPENDICES ─── */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 py-12 md:py-24 space-y-20 md:space-y-32">
        {/* tabs and reviews remain narrow for reading comfort */}
        <div className="max-w-4xl mx-auto prose-editorial">
          <ProductDetailsTabs product={uiProduct} />
        </div>

        <div className="max-w-4xl mx-auto text-center font-sans">
          <h3 className="text-sm sm:text-xl uppercase tracking-[0.3em] opacity-50 mb-8 sm:mb-12">
            Critique & Reflections
          </h3>
          <StoreProductReviews
            productId={product.id}
            reviews={reviews}
            ratingAverage={uiProduct.rating}
            reviewCount={uiProduct.reviewCount}
          />
        </div>

        {relatedProducts?.length > 0 && (
          <div className="space-y-16">
            <div className="flex flex-col gap-6 pb-8 border-b-2 border-zinc-900 dark:border-white">
              <h3 className="text-3xl sm:text-5xl md:text-8xl font-black tracking-tighter lowercase leading-none text-left">
                Further Reading
              </h3>
              <div className="flex items-center justify-between text-xs font-sans font-black tracking-[0.2em] uppercase opacity-50">
                <span>Recommendations</span>
                <span>{relatedProducts.length} ITEMS</span>
              </div>
            </div>
            <RelatedProductsGrid
              products={relatedProducts}
              title={null}
              className="pt-0"
            />
          </div>
        )}
      </div>
    </div>
  );
}
