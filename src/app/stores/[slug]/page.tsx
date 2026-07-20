import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { getSubdomain, getBaseDomain, areSubdomainsDisabled } from "@/utils/subdomain";
import { Store, ArrowLeft, Search } from "lucide-react";
import {
  useGetStoreProductsQuery,
  useGetStoreCategoryProductsQuery,
} from "@/services/storeApi";
import { useStartConversationMutation } from "@/services/messagingApi";
import { ACCOUNT_ROUTES } from "@/routes/index";
import { toast } from "sonner";
import SEO from "@/components/shared/SEO";

import { StoreSkeleton } from "@/modules/vendor/components/skeletons/StoreSkeleton";
import { useStoreTheme } from "@/modules/vendor/components/StoreThemeProvider";
import { useStoreData } from "@/modules/vendor/layout/StorefrontLayout";
import DefaultTemplate from "@/modules/vendor/components/Store-details-page/templates/DefaultTemplate";
import VanguardTemplate from "@/modules/vendor/components/Store-details-page/templates/VanguardTemplate";
import BazaarTemplate from "@/modules/vendor/components/Store-details-page/templates/BazaarTemplate";
import EditorialTemplate from "@/modules/vendor/components/Store-details-page/templates/EditorialTemplate";
import TitanTemplate from "@/modules/vendor/components/Store-details-page/templates/TitanTemplate";
import HeritageTemplate from "@/modules/vendor/components/Store-details-page/templates/HeritageTemplate";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useGetCartQuery } from "@/services/cartApi";
import { CartDrawer } from "@/modules/website/components/cart/CartDrawer";
import type { StoreTemplateProps } from "@/modules/vendor/components/Store-details-page/templates/StoreTemplateProps";
import type { IStorePagination, IStoreDetails, IStoreCategory } from "@/types/Store/storeTypes";

/* ───────────────── COMPONENT ───────────────── */

export default function StoreDetailsPage() {
  let { slug } = useParams<{ slug: string }>();
  const subdomain = getSubdomain();
  if (subdomain && subdomain !== "vendor" && subdomain !== "admin") {
    slug = subdomain;
  }
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const previewTemplate = searchParams.get("preview_template");

  const [activeTab, setActiveTab] = useState<"products" | "categories">(
    "products",
  );
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Cart state
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const cartState = useSelector((state: RootState) => state.cart);
  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });
  const cartItemsCount = isAuthenticated
    ? cartData?.data?.cart?.items?.length || 0
    : cartState.localItems?.length || 0;

  const [startConversation, { isLoading: isStartingConversation }] = useStartConversationMutation();
  const { templateName: activeTemplateName } = useStoreTheme();

  // Debounce search
  useEffect(() => {
    if (searchQuery !== debouncedSearch) {
      setIsSearching(true);
    }
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset page on search
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery, debouncedSearch]);

  /* ─── STORE DETAILS (from layout context — no duplicate fetch) ─── */

  const storeResponse = useStoreData();
  const store = storeResponse?.data?.store;
  const categories = storeResponse?.data?.categories ?? [];
  const storeLoading = !storeResponse;

  // Handle category query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get("category");

    if (categoryId && categories.length > 0) {
      const category = categories.find(
        (c) => (c as Record<string, unknown>).id === categoryId,
      );
      if (category) {
        setSelectedCategory(category as { id: string; name: string });
        setActiveTab("products");
      }
    }
  }, [categories]);

  /* ─── ALL PRODUCTS ─── */

  const {
    data: productsData,
    isLoading: productsLoading,
    isFetching: productsFetching,
  } = useGetStoreProductsQuery(
    { slug: slug ?? "", page, limit: 20, q: debouncedSearch },
    { skip: !!selectedCategory || !store },
  );

  /* ─── CATEGORY PRODUCTS ─── */

  const {
    data: categoryProductsData,
    isLoading: categoryLoading,
    isFetching: categoryFetching,
  } = useGetStoreCategoryProductsQuery(
    {
      slug: slug ?? "",
      categoryId: selectedCategory?.id ?? "",
      page,
      limit: 20,
      q: debouncedSearch,
    },
    { skip: !selectedCategory },
  );

  // Use category data when a category is selected, otherwise use all products
  const products = selectedCategory
    ? (categoryProductsData?.data.items ?? [])
    : (productsData?.data.items ?? []);

  const pagination: IStorePagination = (selectedCategory
    ? categoryProductsData?.data.pagination
    : productsData?.data.pagination) || {
    total: 0,
    page: 1,
    limit: 20,
    pages: 1,
    hasNext: false,
    hasPrev: false,
  };

  const isProductsLoading = selectedCategory
    ? categoryLoading
    : productsLoading;

  const isProductsFetching = selectedCategory
    ? categoryFetching
    : productsFetching || isSearching;

  const productsKey = selectedCategory
    ? `category-${selectedCategory.id}-page-${page}`
    : `all-products-page-${page}`;

  /* ─── STORE LOADING STATE ─── */

  if (storeLoading) {
    return <StoreSkeleton />;
  }

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-50/50 dark:bg-zinc-950/50">
        <div className="bg-white dark:bg-zinc-900 p-10 rounded-sm border border-zinc-200 dark:border-zinc-800 max-w-md w-full  -zinc-200/50 dark: text-center">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-sm flex items-center justify-center mx-auto mb-8">
            <Store className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">
            Store Not Found
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed">
            The store you're looking for might be inactive, moved, or deleted.
            Try searching for other top-rated stores on EazyStore.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/stores")}
              className="w-full bg-emerald-600 text-white font-bold py-4 px-8 rounded-sm hover:bg-emerald-700 transition-all  -emerald-600/20 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Explore All Stores
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold py-4 px-8 rounded-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCategoriesLoading = storeLoading;

  // Override template if in preview mode
  const templateName = previewTemplate || activeTemplateName;

  const handleCategorySelect = (cat: { id: string; name: string } | null) => {
    setSelectedCategory(cat);
    if (cat) {
      setActiveTab("products");
    }
    setPage(1);

    // Auto-scroll to top of product grid section
    setTimeout(() => {
      const element = document.getElementById("main-grid");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);
  };

  const templateProps: StoreTemplateProps = {
    store: store ? { ...store } as unknown as IStoreDetails : ({} as IStoreDetails),
    categories: categories as unknown as IStoreCategory[],
    products,
    pagination,
    isProductsLoading,
    isProductsFetching,
    isCategoriesLoading,
    activeTab,
    selectedCategory,
    searchQuery,
    isSearching,
    page,
    productsKey,
    onTabChange: (tab: "products" | "categories") => {
      setActiveTab(tab);
      setSelectedCategory(null);
      setPage(1);
      setSearchQuery("");
    },
    onCategorySelect: handleCategorySelect,
    onSearchChange: (query: string) => setSearchQuery(query),
    onPageChange: (p: number) => {
      setPage(p);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onCartOpen: () => setIsCartOpen(true),
    cartItemsCount,
    isMessagingLoading: isStartingConversation,
    onMessageVendor: async () => {
      if (!isAuthenticated) {
        toast.error("Please login to message the vendor");
        return;
      }
      const storeRecord = store as Record<string, unknown> | undefined;
      if (!storeRecord?.user_id) {
        toast.error("Vendor information is missing for this store");
        return;
      }
      try {
        const conversationResponse = await startConversation({ recipient_id: storeRecord.user_id as string }).unwrap();
        const conversationId = conversationResponse.data.id;
        
        const prefill = encodeURIComponent("Hi Im viewing your store any information i should note");
        const targetPath = `${ACCOUNT_ROUTES.MESSAGES}/${conversationId}?prefill=${prefill}`;

        if (areSubdomainsDisabled()) {
          navigate(targetPath);
        } else {
          const subdomain = getSubdomain();
          if (subdomain && subdomain !== "vendor" && subdomain !== "admin") {
            window.location.href = `${window.location.protocol}//${getBaseDomain()}${targetPath}`;
          } else {
            navigate(targetPath);
          }
        }
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to start conversation");
      }
    },
  };

  const renderTemplate = () => {
    switch (templateName) {
      case "Vanguard":
        return <VanguardTemplate {...templateProps} />;
      case "The Bazaar":
        return <BazaarTemplate {...templateProps} />;
      case "Editorial":
        return <EditorialTemplate {...templateProps} />;
      case "Titan":
        return <TitanTemplate {...templateProps} />;
      case "Heritage":
        return <HeritageTemplate {...templateProps} />;
      case "Default":
      default:
        return <DefaultTemplate {...templateProps} />;
    }
  };

  return (
    <div className="relative">
      <SEO 
        title={(store as Record<string, unknown>)?.store_name as string ?? undefined} 
        description={(store as Record<string, unknown>)?.description as string ?? undefined}
        image={(store as Record<string, unknown>)?.cover_image as string || (store as Record<string, unknown>)?.logo as string || undefined} 
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
              window.location.href = `${window.location.protocol}//vendor.${baseHost}/templates`;
            }}
            className="text-[10px] font-black uppercase tracking-widest bg-white text-black px-4 py-1.5 rounded-sm hover:bg-zinc-200 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      )}
      {renderTemplate()}

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
    </div>
  );
}
