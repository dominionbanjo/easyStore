import { useProductActions } from "../../../hooks/useProductActions";
import ProductDetailsTabs from "@/modules/website/components/products/ProductDetailsTabs";
import { StoreProductReviews } from "../StoreProductReviews";
import RelatedProductsGrid from "@/modules/website/components/products/RelatedProductsGrid";
import type { ProductTemplateProps } from "./ProductTemplateProps";
import { adaptProductToUI } from "../../../utils/productAdapter";
import { GoBackButton } from "@/components/shared/GoBackButton";

// Default Components
import { DefaultHeader } from "./default/DefaultHeader";
import { DefaultVisuals } from "./default/DefaultVisuals";
import { DefaultInfo } from "./default/DefaultInfo";
import { DefaultLogistics } from "./default/DefaultLogistics";

export default function DefaultProductTemplate({
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

  return (
    <div className="w-full bg-white dark:bg-zinc-950 min-h-screen pb-24 font-sans selection:bg-[var(--theme-primary)] selection:text-white">
      <DefaultHeader
        store={store}
        uiProduct={uiProduct}
        onCartOpen={onCartOpen}
        cartItemsCount={cartItemsCount}
        onMessageVendor={onMessageVendor}
        isMessagingLoading={isMessagingLoading}
      />

      {/* ─── PRODUCT MAIN ─── */}
      <main className="max-w-7xl mx-auto px-1.5 sm:px-6 lg:px-8 py-8 md:py-12">
        <GoBackButton className="mb-6" />
        <div className="bg-white dark:bg-zinc-950 rounded-sm  -zinc-200/20 dark: border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <DefaultVisuals uiProduct={uiProduct} />

            <div className="flex flex-col">
              <DefaultInfo
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

              <div className="px-2 sm:px-10 lg:px-12 pb-12">
                <DefaultLogistics uiProduct={uiProduct} />
              </div>
            </div>
          </div>
        </div>

        {/* ─── TABS & DETAILS ─── */}
        <div className="mt-12 md:mt-24">
          <div className="bg-white dark:bg-zinc-950 rounded-sm px-2 py-6 sm:p-10  border border-zinc-200/60 dark:border-zinc-800/60">
            <ProductDetailsTabs product={uiProduct} />
          </div>
        </div>

        {/* ─── REVIEWS ─── */}
        <div className="mt-16 md:mt-24">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Customer Reviews
            </h2>
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="bg-white dark:bg-zinc-950 rounded-sm px-2 py-6 sm:p-10  border border-zinc-200/60 dark:border-zinc-800/60">
            <StoreProductReviews
              productId={product.id}
              reviews={reviews}
              ratingAverage={uiProduct.rating}
              reviewCount={uiProduct.reviewCount}
            />
          </div>
        </div>

        {/* ─── RELATED PRODUCTS ─── */}
        {relatedProducts?.length > 0 && (
          <div className="mt-24">
            <div className="text-center mb-12">
              <span className="text-[var(--theme-primary)] font-bold tracking-wider uppercase text-sm mb-2 block">
                Discover More
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                From {store.store_name}
              </h2>
            </div>
            <RelatedProductsGrid products={relatedProducts} />
          </div>
        )}
      </main>
    </div>
  );
}
