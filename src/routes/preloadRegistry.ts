import * as Pages from "./lazyPages";
import { ROUTES } from "./index";
import { getSubdomain } from "@/utils/subdomain";

/**
 * 🗺️ Route Preload Map
 * 🧠 Cache for the registry to avoid re-creation
 */
let cachedRegistry: Record<string, () => Promise<any>> | null = null;

/**
 * 🔧 Get Registry
 * Lazily initializes the registry to break circular dependencies with layouts.
 */
function getRegistry() {
  if (cachedRegistry) return cachedRegistry;

  cachedRegistry = {
    [ROUTES.WEBSITE.ABOUT]: Pages.preloadAboutPage,
    [ROUTES.WEBSITE.STORES]: Pages.preloadStoresPage,
    [ROUTES.WEBSITE.CATEGORIES]: Pages.preloadCategoriesPage,
    [ROUTES.WEBSITE.DISCOVERY]: Pages.preloadDiscoveryPage,
    [ROUTES.WEBSITE.FEATURED]: Pages.preloadFeaturedProductsPage,
    [ROUTES.WEBSITE.TRENDING]: Pages.preloadTrendingProductsPage,
    [ROUTES.WEBSITE.NEW_ARRIVALS]: Pages.preloadNewArrivalsPage,
    [ROUTES.ACCOUNT.PROFILE]: Pages.preloadUserProfilePage,
    [ROUTES.ACCOUNT.SETTINGS]: Pages.preloadSettingsPage,
    [ROUTES.WEBSITE.CART]: Pages.preloadCartPage,
    [ROUTES.WEBSITE.CHECKOUT]: Pages.preloadCheckoutPage,
    [ROUTES.ACCOUNT.VERIFY_PAYMENT]: Pages.preloadVerifyPaymentPage,
    [ROUTES.ACCOUNT.WISHLIST]: Pages.preloadWishlistPage,
    [ROUTES.ACCOUNT.ORDERS]: Pages.preloadOrdersPage,
    [ROUTES.AUTH.LOGIN]: Pages.preloadLoginPage,
    [ROUTES.AUTH.SIGNUP]: Pages.preloadSignupPage,
    [ROUTES.VENDOR.PRODUCTS]: Pages.preloadProductsPage,
    [ROUTES.VENDOR.ORDERS]: Pages.preloadVendorOrdersPage,
    [ROUTES.VENDOR.CUSTOMERS]: Pages.preloadCustomersPage,
  };

  return cachedRegistry;
}

/**
 * 🔍 Find Preload Function
 * Handles dynamic route patterns (e.g. /product/:slug)
 */
export const getPreloadForPath = (path: string) => {
  const registry = getRegistry();
  const subdomain = getSubdomain();

  // Root Path Matching (Domain-aware)
  if (path === "/") {
    if (subdomain === "vendor") return Pages.preloadVendorDashboardPage;
    if (subdomain === "admin") return Pages.preloadSuperAdminOverviewPage;
    if (!subdomain) return Pages.preloadLandingPage;
  }

  if (registry[path]) return registry[path];

  // Dynamic Route Matching
  if (path.startsWith("/stores/")) return Pages.preloadStoreDetailsPage;
  if (path.startsWith("/categories/")) return Pages.preloadCategoryDetailsPage;
  if (path.startsWith("/product/")) return Pages.preloadProductDetailPage;
  if (path.startsWith("/account/orders/")) return Pages.preloadOrderDetailsPage;

  return null;
};
