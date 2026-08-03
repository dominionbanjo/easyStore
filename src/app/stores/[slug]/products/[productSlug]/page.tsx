import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { getSubdomain, getBaseDomain, areSubdomainsDisabled } from "@/utils/subdomain";
import { PackageSearch, ArrowLeft, ShoppingBag } from "lucide-react";
import { useGetStoreDetailsQuery } from "@/services/storeApi";
import { useGetSingleProductQuery } from "@/services/productApi";
import { ProductSkeleton } from "@/modules/vendor/components/skeletons/ProductSkeleton";
import { useStoreTheme } from "@/modules/vendor/components/storeThemeContext";

// Placeholder imports for the incoming individual product templates
import DefaultProductTemplate from "@/modules/vendor/components/Store-details-page/product-templates/DefaultProductTemplate";
import VanguardProductTemplate from "@/modules/vendor/components/Store-details-page/product-templates/VanguardProductTemplate";
import BazaarProductTemplate from "@/modules/vendor/components/Store-details-page/product-templates/BazaarProductTemplate";
import EditorialProductTemplate from "@/modules/vendor/components/Store-details-page/product-templates/EditorialProductTemplate";
import TitanProductTemplate from "@/modules/vendor/components/Store-details-page/product-templates/TitanProductTemplate";
import HeritageProductTemplate from "@/modules/vendor/components/Store-details-page/product-templates/HeritageProductTemplate";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useGetCartQuery } from "@/services/cartApi";
import { CartDrawer } from "@/modules/website/components/cart/CartDrawer";
import { useStartConversationMutation } from "@/services/messagingApi";
import { toast } from "sonner";
import { ACCOUNT_ROUTES } from "@/routes";
import SEO from "@/components/shared/SEO";
import { extractErrorMessage } from "@/utils/errorHandler";

export default function StoreProductDetailsPage() {
  const { slug: paramSlug, productSlug } = useParams<{
    slug: string;
    productSlug: string;
  }>();
  let slug = paramSlug;
  const subdomain = getSubdomain();
  if (subdomain && subdomain !== "vendor" && subdomain !== "admin") {
    slug = subdomain;
  }
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const previewTemplate = searchParams.get("preview_template");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [startConversation, { isLoading: isMessagingLoading }] = useStartConversationMutation();

  // Theme is resolved unconditionally so hooks run in the same order on every render
  const { templateName: activeTemplateName, theme } = useStoreTheme();

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
  } = useGetSingleProductQuery(productSlug ?? "", {
    skip: !productSlug,
  });

  const store = storeData?.data.store;
  const productData = productResp?.data;

  /* ─── LOADING STATE ─── */
  if (storeLoading || productLoading) {
    return <ProductSkeleton />;
  }

  /* ─── ERROR STATE ─── */
  if (storeError || productError || !store || !productData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-50/50 dark:bg-zinc-950/50">
        <div className="bg-white dark:bg-zinc-900 p-10 rounded-sm border border-zinc-200 dark:border-zinc-800 max-w-md w-full  -zinc-200/50 dark: text-center">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-sm flex items-center justify-center mx-auto mb-8">
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
              className="w-full bg-emerald-600 text-white font-bold py-4 px-8 rounded-sm hover:bg-emerald-700 transition-all  -emerald-600/20 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Back to Store
            </button>
            <button
              onClick={() => navigate("/stores")}
              className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold py-4 px-8 rounded-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
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
    isMessagingLoading,
    onMessageVendor: async () => {
      if (!isAuthenticated) return toast.error("Please login to message the vendor");
      if (!store?.user_id) return toast.error("Vendor info missing");

      try {
        const resp = await startConversation({ recipient_id: store.user_id }).unwrap();
        const convId = resp.data.id;
        const prefill = encodeURIComponent(`Hi, I'm interested in ${productData.product.name}. Can you provide more details?`);
        
        // Include product data in the query to correctly populate the message
        const productPayload = encodeURIComponent(JSON.stringify({
          id: productData.product.id,
          name: productData.product.name,
          slug: productData.product.slug,
          image: productData.product.image,
        }));
        
        const targetPath = `${ACCOUNT_ROUTES.MESSAGES}/${convId}?prefill=${prefill}&product_payload=${productPayload}`;

        if (areSubdomainsDisabled()) {
          navigate(targetPath);
        } else {
          window.location.href = `${window.location.protocol}//${getBaseDomain()}${targetPath}`;
        }
      } catch (err: unknown) {
        toast.error(extractErrorMessage(err, "Failed to start conversation"));
      }
    },
  };

  return (
    <>
      <SEO 
        title={`${productData.product.name} | ${store.store_name}`} 
        description={productData.product.description?.substring(0, 160) ?? undefined}
        image={
          typeof productData.product.image === "string"
            ? productData.product.image
            : (productData.product.image?.url ?? undefined)
        } 
      />
      {previewTemplate && (
        <div className="fixed top-0 left-0 right-0 z-[100] text-zinc-100 py-2 px-4 flex items-center justify-between  border-b border-white/10 backdrop-blur-md bg-zinc-900/95 font-sans">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-sm bg-emerald-500 animate-pulse" />
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
            className="text-[10px] font-black uppercase tracking-widest bg-white text-black px-4 py-1.5 rounded-sm hover:bg-zinc-200 transition-colors"
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
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-sm bg-[var(--theme-primary)] text-white  -[var(--theme-primary)]/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200"
        aria-label="Open cart"
      >
        <ShoppingCart className="w-6 h-6" />
        {cartItemsCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-sm bg-white text-[var(--theme-primary)] text-[10px] font-black ring-2 ring-[var(--theme-primary)] ">
            {cartItemsCount > 9 ? "9+" : cartItemsCount}
          </span>
        )}
      </button> */}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
