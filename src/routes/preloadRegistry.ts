import * as Pages from "./lazyPages";

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
    "/": Pages.preloadLandingPage,
    "/about": Pages.preloadAboutPage,
    "/stores": Pages.preloadStoresPage,
    "/categories": Pages.preloadCategoriesPage,
    "/discovery": Pages.preloadDiscoveryPage,
    "/featured": Pages.preloadFeaturedProductsPage,
    "/trending": Pages.preloadTrendingProductsPage,
    "/new-arrivals": Pages.preloadNewArrivalsPage,
    "/account/profile": Pages.preloadUserProfilePage,
    "/account/settings": Pages.preloadSettingsPage,
    "/account/cart": Pages.preloadCartPage,
    "/account/cart/preview": Pages.preloadCheckoutPage,
    "/account/verify-payment": Pages.preloadVerifyPaymentPage,
    "/account/wishlist": Pages.preloadWishlistPage,
    "/account/orders": Pages.preloadOrdersPage,
    "/auth/login": Pages.preloadLoginPage,
    "/auth/signup": Pages.preloadSignupPage,
    "/vendor": Pages.preloadVendorDashboardPage,
    "/vendor/products": Pages.preloadProductsPage,
    "/vendor/orders": Pages.preloadVendorOrdersPage,
    "/vendor/customers": Pages.preloadCustomersPage,
    "/admin": Pages.preloadSuperAdminOverviewPage,
  };

  return cachedRegistry;
}

/**
 * 🔍 Find Preload Function
 * Handles dynamic route patterns (e.g. /product/:slug)
 */
export const getPreloadForPath = (path: string) => {
  const registry = getRegistry();
  if (registry[path]) return registry[path];

  // Dynamic Route Matching
  if (path.startsWith("/stores/")) return Pages.preloadStoreDetailsPage;
  if (path.startsWith("/categories/")) return Pages.preloadCategoryDetailsPage;
  if (path.startsWith("/product/")) return Pages.preloadProductDetailPage;
  if (path.startsWith("/account/orders/")) return Pages.preloadOrderDetailsPage;

  return null;
};
