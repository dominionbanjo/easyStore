import { useState } from "react";
import { useProductActions } from "../../../hooks/useProductActions";
import ProductDetailsTabs from "@/modules/website/components/products/ProductDetailsTabs";
import ReviewsSection from "@/modules/website/components/products/ReviewsSection";
import RelatedProductsGrid from "@/modules/website/components/products/RelatedProductsGrid";
import type { ProductTemplateProps } from "./ProductTemplateProps";
import { adaptProductToUI } from "../../../utils/productAdapter";

// Bazaar Components
import { BazaarHeader } from "./bazaar/BazaarHeader";
import { BazaarProductInfo } from "./bazaar/BazaarProductInfo";
import { BazaarBuyBox } from "./bazaar/BazaarBuyBox";

export default function BazaarProductTemplate({
  store,
  product,
  reviews,
  relatedProducts,
  onCartOpen,
  cartItemsCount,
}: ProductTemplateProps) {
  const uiProduct = adaptProductToUI(product, store, reviews);

  const {
    quantity,
    setQuantity,
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
    <div className="w-full bg-zinc-50 dark:bg-zinc-950 min-h-screen text-slate-900 dark:text-slate-100 font-sans pb-20">
      <BazaarHeader
        store={store}
        onCartOpen={onCartOpen}
        cartItemsCount={cartItemsCount}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
      />

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-[1600px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
          {/* Main Info - Order 1 */}
          <div className="order-1 lg:col-start-1">
            <BazaarProductInfo
              store={store}
              uiProduct={uiProduct}
              displayPrice={displayPrice}
              displayOriginalPrice={displayOriginalPrice}
              selectedOptions={selectedOptions}
              selectOption={selectOption}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              liked={liked}
              toggleWishlist={toggleWishlist}
            />
          </div>

          {/* Buy Box - Order 2 on mobile, sidebar on desktop */}
          <div className="order-2 lg:col-start-2 lg:row-start-1 lg:sticky lg:top-8">
            <BazaarBuyBox
              store={store}
              uiProduct={uiProduct}
              displayPrice={displayPrice}
              quantity={quantity}
              setQuantity={setQuantity}
              currentStock={currentStock}
              handleAddToCart={handleAddToCart}
              toggleWishlist={toggleWishlist}
              liked={liked}
              addingToCart={addingToCart}
            />
          </div>

          {/* Tabs & Reviews - Order 3 & 4 on mobile, below info on desktop */}
          <div className="order-3 lg:col-start-1 space-y-8">
            {/* Bottom Tabs */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6">
              <ProductDetailsTabs product={uiProduct} />
            </div>

            {/* Reviews Section */}
            <div
              id="reviews"
              className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6"
            >
              <ReviewsSection
                productId={product.id}
                reviews={reviews}
                ratingAverage={uiProduct.rating}
                reviewCount={uiProduct.reviewCount}
              />
            </div>
          </div>
        </div>

        {/* ─── RELATED PRODUCTS (Bottom Spanning) ─── */}
        {relatedProducts?.length > 0 && (
          <div className="mt-12 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 lg:p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-zinc-800 pb-4">
              Customers who viewed this item also viewed
            </h2>
            <RelatedProductsGrid products={relatedProducts} />
          </div>
        )}
      </main>
    </div>
  );
}
