import { type ComponentType, lazy } from "react";

/**
 * 🚀 High-Performance Lazy Loader with Preload support
 * Allows pre-fetching chunks before navigation (e.g. on link hover)
 */
function lazyWithPreload<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
) {
  const Component = lazy(factory) as any;
  Component.preload = factory;
  return Component as T & { preload: () => Promise<{ default: T }> };
}

/* ───────────────── LAYOUTS ───────────────── */

export const HomepageLayout = lazyWithPreload(
  () => import("@/modules/website/layout/HomePageLayout"),
);
export const AccountsLayout = lazyWithPreload(
  () => import("@/modules/website/layout/AccountsLayout"),
);
export const VendorDashboardLayout = lazyWithPreload(
  () => import("@/modules/vendor/layout/VendorDashboardLayout"),
);
export const SuperAdminDashboardLayout = lazyWithPreload(
  () => import("@/modules/admin/layout/SuperAdminDashboardLayout"),
);

/* ───────────────── WEBSITE PAGES ───────────────── */

export const LandingPage = lazyWithPreload(
  () => import("@/modules/website/pages/LandingPage"),
);
export const AboutPage = lazyWithPreload(
  () => import("@/modules/website/pages/AboutPage"),
);
export const StoresPage = lazyWithPreload(
  () => import("@/modules/website/pages/StoresPage"),
);
export const StoreDetailsPage = lazyWithPreload(
  () => import("@/modules/vendor/pages/storeDetailsPage"),
);
export const CategoriesPage = lazyWithPreload(
  () => import("@/modules/website/pages/Categories"),
);
export const CategoryDetailsPage = lazyWithPreload(
  () => import("@/modules/website/pages/SingleCategoryPage"),
);
export const ProductDetailPage = lazyWithPreload(
  () => import("@/modules/website/pages/ProductDetailsPage"),
);
export const OrdersPage = lazyWithPreload(
  () => import("@/modules/website/pages/OrdersPage"),
);
export const OrderDetailsPage = lazyWithPreload(
  () => import("@/modules/website/pages/OrderDetailsPage"),
);
export const WishlistPage = lazyWithPreload(
  () => import("@/modules/website/pages/WishlistPage"),
);
export const CartPage = lazyWithPreload(
  () => import("@/modules/website/pages/CartPage"),
);
export const CheckoutPage = lazyWithPreload(
  () => import("@/modules/website/pages/CheckoutPage"),
);
export const VerifyPaymentPage = lazyWithPreload(
  () => import("@/modules/website/pages/VerifyPayment"),
);
export const SettingsPage = lazyWithPreload(
  () => import("@/modules/website/pages/SettingsPage"),
);
export const UserProfilePage = lazyWithPreload(
  () => import("@/modules/website/pages/ProfilePage"),
);
export const SearchResultsPage = lazyWithPreload(
  () => import("@/modules/website/pages/SearchResultsPage"),
);
export const NotFoundPage = lazyWithPreload(
  () => import("@/modules/website/pages/NotFoundPage"),
);
export const PrivacyPolicyPage = lazyWithPreload(
  () => import("@/modules/website/pages/PrivacyPolicyPage"),
);
export const TermsOfServicePage = lazyWithPreload(
  () => import("@/modules/website/pages/TermsOfServicePage"),
);
export const CareersPage = lazyWithPreload(
  () => import("@/modules/website/pages/CareersPage"),
);
export const DiscoveryPage = lazyWithPreload(
  () => import("@/modules/website/pages/DiscoveryPage"),
);
export const FeaturedStoresPage = lazyWithPreload(
  () => import("@/modules/website/pages/FeaturedStoresPage"),
);
export const FeaturedProductsPage = lazyWithPreload(
  () => import("@/modules/website/pages/FeaturedProductsPage"),
);
export const TrendingProductsPage = lazyWithPreload(
  () => import("@/modules/website/pages/TrendingProductsPage"),
);
export const NewArrivalsPage = lazyWithPreload(
  () => import("@/modules/website/pages/NewArrivalsPage"),
);

/* ───────────────── AUTH PAGES ───────────────── */

export const LoginPage = lazyWithPreload(
  () => import("@/modules/auth/pages/Login"),
);
export const SignupPage = lazyWithPreload(
  () => import("@/modules/auth/pages/Register"),
);
export const VerifyOtpPage = lazyWithPreload(
  () => import("@/modules/auth/pages/VerifyOtp"),
);
export const ForgotPasswordPage = lazyWithPreload(
  () => import("@/modules/auth/pages/ForgotPasswordPage"),
);
export const ResetPasswordPage = lazyWithPreload(
  () => import("@/modules/auth/pages/ResetPasswordPage"),
);

/* ───────────────── VENDOR PAGES ───────────────── */

export const VendorDashboardPage = lazyWithPreload(
  () => import("@/modules/vendor/pages/VendorDashboardPage"),
);
export const CustomersPage = lazyWithPreload(
  () => import("@/modules/vendor/pages/CustomersPage"),
);
export const VendorOrdersPage = lazyWithPreload(
  () => import("@/modules/vendor/pages/OrdersPage"),
);
export const ProductsPage = lazyWithPreload(
  () => import("@/modules/vendor/pages/ProductsPage"),
);
export const AddProductPage = lazyWithPreload(
  () => import("@/modules/vendor/pages/AddProductsPage"),
);
export const ProductPreviewPage = lazyWithPreload(
  () => import("@/modules/vendor/pages/ProductPreviewPage"),
);
export const VendorSettingsPage = lazyWithPreload(
  () => import("@/modules/vendor/pages/SettingsPage"),
);
export const HelpPage = lazyWithPreload(
  () => import("@/modules/vendor/pages/HelpPage"),
);
export const AnalyticsPage = lazyWithPreload(
  () => import("@/modules/vendor/pages/AnalyticsPage"),
);

/* ───────────────── ADMIN PAGES ───────────────── */

export const SuperAdminOverviewPage = lazyWithPreload(
  () => import("@/modules/admin/pages/SuperAdminOverviewPage"),
);
export const SuperAdminVendorsPage = lazyWithPreload(
  () => import("@/modules/admin/pages/SuperAdminVendorsPage"),
);
export const SuperAdminUsersPage = lazyWithPreload(
  () => import("@/modules/admin/pages/SuperAdminUsersPage"),
);
export const SuperAdminTransactionsPage = lazyWithPreload(
  () => import("@/modules/admin/pages/SuperAdminTransactionsPage"),
);
export const SuperAdminReportsPage = lazyWithPreload(
  () => import("@/modules/admin/pages/SuperAdminReportsPage"),
);
export const SuperAdminLogsPage = lazyWithPreload(
  () => import("@/modules/admin/pages/SuperAdminLogsPage"),
);
export const SuperAdminNotificationsPage = lazyWithPreload(
  () => import("@/modules/admin/pages/SuperAdminNotificationsPage"),
);
export const SuperAdminPlatformAnalysisPage = lazyWithPreload(
  () => import("@/modules/admin/pages/SuperAdminPlatformAnalysisPage"),
);
export const SuperAdminAccessControlPage = lazyWithPreload(
  () => import("@/modules/admin/pages/SuperAdminAccessControlPage"),
);
export const SuperAdminSettingsPage = lazyWithPreload(
  () => import("@/modules/admin/pages/SuperAdminSettingsPage"),
);
export const SuperAdminServerConfigPage = lazyWithPreload(
  () => import("@/modules/admin/pages/SuperAdminServerConfigPage"),
);

/* ───────────────── BATCH PRELOADERS ───────────────── */

/**
 * 🚀 Aggressive Background Preloading
 * Use these sparingly to prime entire sections of the app.
 */

export const preloadWebsitePages = () => {
  const pages = [
    LandingPage,
    DiscoveryPage,
    StoresPage,
    CategoriesPage,
    ProductDetailPage,
    SearchResultsPage,
    FeaturedProductsPage,
    TrendingProductsPage,
    NewArrivalsPage,
    StoreDetailsPage,
  ];
  pages.forEach((p, i) => setTimeout(() => p.preload(), i * 200));
};

export const preloadAuthPages = () => {
  const pages = [LoginPage, SignupPage, VerifyOtpPage];
  pages.forEach((p, i) => setTimeout(() => p.preload(), i * 200));
};

export const preloadAccountPages = () => {
  const pages = [
    UserProfilePage,
    OrdersPage,
    OrderDetailsPage,
    CartPage,
    WishlistPage,
    CheckoutPage,
    SettingsPage,
  ];
  pages.forEach((p, i) => setTimeout(() => p.preload(), i * 200));
};

export const preloadVendorPages = () => {
  const pages = [
    VendorDashboardPage,
    ProductsPage,
    VendorOrdersPage,
    CustomersPage,
    AnalyticsPage,
    VendorSettingsPage,
    AddProductPage,
  ];
  pages.forEach((p, i) => setTimeout(() => p.preload(), i * 200));
};

export const preloadAdminPages = () => {
  const pages = [
    SuperAdminOverviewPage,
    SuperAdminVendorsPage,
    SuperAdminUsersPage,
    SuperAdminTransactionsPage,
    SuperAdminReportsPage,
    SuperAdminSettingsPage,
  ];
  pages.forEach((p, i) => setTimeout(() => p.preload(), i * 200));
};
/* ───────────────── OTHER COMPONENTS ───────────────── */

export const OnboardingModal = lazyWithPreload(() =>
  import("@/modules/auth/components/OnboardingModal").then((m) => ({
    default: m.OnboardingModal,
  })),
);
