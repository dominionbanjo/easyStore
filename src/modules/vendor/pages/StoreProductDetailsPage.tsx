import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { getSubdomain, getBaseDomain } from "@/utils/subdomain";
import { PackageSearch, ArrowLeft, ShoppingBag } from "lucide-react";
import { useGetStoreDetailsQuery } from "@/services/storeApi";
import { useGetSingleProductQuery } from "@/services/productApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useStoreTheme } from "../components/StoreThemeProvider";

// Placeholder imports for the incoming individual product templates
import DefaultProductTemplate from "../components/Store-details-page/product-templates/DefaultProductTemplate";
import VanguardProductTemplate from "../components/Store-details-page/product-templates/VanguardProductTemplate";
import BazaarProductTemplate from "../components/Store-details-page/product-templates/BazaarProductTemplate";
import EditorialProductTemplate from "../components/Store-details-page/product-templates/EditorialProductTemplate";
import TitanProductTemplate from "../components/Store-details-page/product-templates/TitanProductTemplate";
import HeritageProductTemplate from "../components/Store-details-page/product-templates/HeritageProductTemplate";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useGetCartQuery } from "@/services/cartApi";
import { CartDrawer } from "@/modules/website/components/cart/CartDrawer";

export default function StoreProductDetailsPage() {
  let { slug, productId } = useParams<{ slug: string; productId: string }>();
  const subdomain = getSubdomain();
  if (subdomain && subdomain !== "vendor" && subdomain !== "admin") {
    slug = subdomain;
  }
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const previewTemplate = searchParams.get("preview_template");
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cart state
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const cartState = useSelector((state: RootState) => state.cart);
  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });
  const cartItemsCount = isAuthenticated
    ? cartData?.data?.cart?.items?.length || 0
    : cartState.localItems?.length || 0;

  /* ─── FETCH STORE DETAILS ─── */
  const {
    data: storeData,
    isLoading: storeLoading,
    isError: storeError,
  } = useGetStoreDetailsQuery(
    { slug: slug ?? "", includeCategories: false },
    { skip: !slug },
  );

  /* ─── FETCH PRODUCT DETAILS ─── */
  // We'll reuse the existing product API, but the endpoint itself should
  // ensure the product belongs to the store.
  // (Alternatively, the frontend checks if store.id === product.store_id)
  const {
    data: productResp,
    isLoading: productLoading,
    isError: productError,
  } = useGetSingleProductQuery(productId ?? "", {
    skip: !productId,
  });

  const store = storeData?.data.store;
  const productData = productResp?.data;

  /* ─── LOADING STATE ─── */
  if (storeLoading || productLoading) {
    return (
      <div className="min-h-screen py-20 px-4 max-w-7xl mx-auto space-y-8">
        <Skeleton className="h-12 w-1/3 mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="h-[500px] w-full rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full mt-8" />
            <Skeleton className="h-12 w-full mt-12" />
          </div>
        </div>
      </div>
    );
  }

  /* ─── ERROR STATE ─── */
  if (storeError || productError || !store || !productData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-50/50 dark:bg-zinc-950/50">
        <div className="bg-white dark:bg-zinc-900 p-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 max-w-md w-full shadow-2xl shadow-zinc-200/50 dark:shadow-none text-center">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <PackageSearch className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">
            Product Not Found
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed">
            This product might have been sold out, moved, or is no longer
            available in this store.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate(`/stores/${slug}`)}
              className="w-full bg-emerald-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Back to Store
            </button>
            <button
              onClick={() => navigate("/stores")}
              className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold py-4 px-8 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Explore All Stores
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Ensure security: Product actually belongs to the viewed store
  if (String(productData.product?.store_id) !== String(store.id)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-500 font-bold">
        Error: Product does not match store context.
      </div>
    );
  }

  /* ─── RENDER TEMPLATE ─── */
  const { templateName: activeTemplateName, theme } = useStoreTheme();

  // Override template if in preview mode
  const templateName = previewTemplate || activeTemplateName;

  // We pass the raw productData block down to the templates,
  // along with store info and any theme specific overrides.
  const templateProps = {
    store,
    product: productData.product,
    reviews: productData.reviews || [],
    relatedProducts: productData.related_products || [],
    themeConfig: theme,
    onCartOpen: () => setIsCartOpen(true),
    cartItemsCount,
  };

  return (
    <>
      {previewTemplate && (
        <div className="fixed top-0 left-0 right-0 z-[100] text-zinc-100 py-2 px-4 flex items-center justify-between shadow-2xl border-b border-white/10 backdrop-blur-md bg-zinc-900/95 font-sans">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Previewing:{" "}
              <span className="text-emerald-400">{previewTemplate}</span> Theme
            </span>
          </div>
          <button
            onClick={() => {
              const baseHost = getBaseDomain();
              window.location.href = `${window.location.protocol}/vendor.${baseHost}/templates`;
            }}
            className="text-[10px] font-black uppercase tracking-widest bg-white text-black px-4 py-1.5 rounded hover:bg-zinc-200 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      )}
      {templateName === "Vanguard" && (
        <VanguardProductTemplate {...templateProps} />
      )}
      {templateName === "The Bazaar" && (
        <BazaarProductTemplate {...templateProps} />
      )}
      {templateName === "Editorial" && (
        <EditorialProductTemplate {...templateProps} />
      )}
      {templateName === "Titan" && <TitanProductTemplate {...templateProps} />}
      {templateName === "Heritage" && (
        <HeritageProductTemplate {...templateProps} />
      )}
      {templateName !== "Vanguard" &&
        templateName !== "The Bazaar" &&
        templateName !== "Editorial" &&
        templateName !== "Titan" &&
        templateName !== "Heritage" && (
          <DefaultProductTemplate {...templateProps} />
        )}

      {/* ─── GLOBAL FLOATING CART BUTTON ─── */}
      {/* <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[var(--theme-primary)] text-white shadow-2xl shadow-[var(--theme-primary)]/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200"
        aria-label="Open cart"
      >
        <ShoppingCart className="w-6 h-6" />
        {cartItemsCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[var(--theme-primary)] text-[10px] font-black ring-2 ring-[var(--theme-primary)] shadow">
            {cartItemsCount > 9 ? "9+" : cartItemsCount}
          </span>
        )}
      </button> */}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
