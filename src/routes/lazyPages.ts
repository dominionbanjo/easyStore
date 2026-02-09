import { lazy } from "react";

/* ───────────────── LAYOUTS ───────────────── */

export const HomepageLayout = lazy(
  () => import("@/modules/website/layout/HomePageLayout"),
);
export const AccountsLayout = lazy(
  () => import("@/modules/website/layout/AccountsLayout"),
);
export const VendorDashboardLayout = lazy(
  () => import("@/modules/vendor/layout/VendorDashboardLayout"),
);
export const SuperAdminDashboardLayout = lazy(
  () => import("@/modules/admin/layout/SuperAdminDashboardLayout"),
);

/* ───────────────── WEBSITE PAGES ───────────────── */

export const LandingPage = lazy(
  () => import("@/modules/website/pages/LandingPage"),
);
export const AboutPage = lazy(
  () => import("@/modules/website/pages/AboutPage"),
);
export const StoresPage = lazy(
  () => import("@/modules/website/pages/StoresPage"),
);
export const StoreDetailsPage = lazy(
  () => import("@/modules/vendor/pages/storeDetailsPage"),
);
export const CategoriesPage = lazy(
  () => import("@/modules/website/pages/Categories"),
);
export const CategoryDetailsPage = lazy(
  () => import("@/modules/website/pages/SingleCategoryPage"),
);
export const ProductDetailPage = lazy(
  () => import("@/modules/website/pages/ProductDetailsPage"),
);
export const OrdersPage = lazy(
  () => import("@/modules/website/pages/OrdersPage"),
);
export const OrderDetailsPage = lazy(
  () => import("@/modules/website/pages/OrderDetailsPage"),
);
export const WishlistPage = lazy(
  () => import("@/modules/website/pages/WishlistPage"),
);
export const CartPage = lazy(() => import("@/modules/website/pages/CartPage"));
export const CheckoutPage = lazy(
  () => import("@/modules/website/pages/CheckoutPage"),
);
export const VerifyPaymentPage = lazy(
  () => import("@/modules/website/pages/VerifyPayment"),
);
export const SettingsPage = lazy(
  () => import("@/modules/website/pages/SettingsPage"),
);
export const UserProfilePage = lazy(
  () => import("@/modules/website/pages/ProfilePage"),
);
export const SearchResultsPage = lazy(
  () => import("@/modules/website/pages/SearchResultsPage"),
);
export const NotFoundPage = lazy(
  () => import("@/modules/website/pages/NotFoundPage"),
);
export const PrivacyPolicyPage = lazy(
  () => import("@/modules/website/pages/PrivacyPolicyPage"),
);
export const TermsOfServicePage = lazy(
  () => import("@/modules/website/pages/TermsOfServicePage"),
);
export const CareersPage = lazy(
  () => import("@/modules/website/pages/CareersPage"),
);
export const DiscoveryPage = lazy(
  () => import("@/modules/website/pages/DiscoveryPage"),
);
export const FeaturedStoresPage = lazy(
  () => import("@/modules/website/pages/FeaturedStoresPage"),
);
export const FeaturedProductsPage = lazy(
  () => import("@/modules/website/pages/FeaturedProductsPage"),
);
export const TrendingProductsPage = lazy(
  () => import("@/modules/website/pages/TrendingProductsPage"),
);
export const NewArrivalsPage = lazy(
  () => import("@/modules/website/pages/NewArrivalsPage"),
);

/* ───────────────── AUTH PAGES ───────────────── */

export const LoginPage = lazy(() => import("@/modules/auth/pages/Login"));
export const SignupPage = lazy(() => import("@/modules/auth/pages/Register"));
export const VerifyOtpPage = lazy(
  () => import("@/modules/auth/pages/VerifyOtp"),
);
export const ForgotPasswordPage = lazy(
  () => import("@/modules/auth/pages/ForgotPasswordPage"),
);
export const ResetPasswordPage = lazy(
  () => import("@/modules/auth/pages/ResetPasswordPage"),
);

/* ───────────────── VENDOR PAGES ───────────────── */

export const VendorDashboardPage = lazy(
  () => import("@/modules/vendor/pages/VendorDashboardPage"),
);
export const CustomersPage = lazy(
  () => import("@/modules/vendor/pages/CustomersPage"),
);
export const VendorOrdersPage = lazy(
  () => import("@/modules/vendor/pages/OrdersPage"),
);
export const ProductsPage = lazy(
  () => import("@/modules/vendor/pages/ProductsPage"),
);
export const AddProductPage = lazy(
  () => import("@/modules/vendor/pages/AddProductsPage"),
);
export const ProductPreviewPage = lazy(
  () => import("@/modules/vendor/pages/ProductPreviewPage"),
);
export const VendorSettingsPage = lazy(
  () => import("@/modules/vendor/pages/SettingsPage"),
);
export const HelpPage = lazy(() => import("@/modules/vendor/pages/HelpPage"));
export const AnalyticsPage = lazy(
  () => import("@/modules/vendor/pages/AnalyticsPage"),
);

/* ───────────────── ADMIN PAGES ───────────────── */

export const SuperAdminOverviewPage = lazy(
  () => import("@/modules/admin/pages/SuperAdminOverviewPage"),
);
export const SuperAdminVendorsPage = lazy(
  () => import("@/modules/admin/pages/SuperAdminVendorsPage"),
);
export const SuperAdminUsersPage = lazy(
  () => import("@/modules/admin/pages/SuperAdminUsersPage"),
);
export const SuperAdminTransactionsPage = lazy(
  () => import("@/modules/admin/pages/SuperAdminTransactionsPage"),
);
export const SuperAdminReportsPage = lazy(
  () => import("@/modules/admin/pages/SuperAdminReportsPage"),
);
export const SuperAdminLogsPage = lazy(
  () => import("@/modules/admin/pages/SuperAdminLogsPage"),
);
export const SuperAdminNotificationsPage = lazy(
  () => import("@/modules/admin/pages/SuperAdminNotificationsPage"),
);
export const SuperAdminPlatformAnalysisPage = lazy(
  () => import("@/modules/admin/pages/SuperAdminPlatformAnalysisPage"),
);
export const SuperAdminAccessControlPage = lazy(
  () => import("@/modules/admin/pages/SuperAdminAccessControlPage"),
);
export const SuperAdminSettingsPage = lazy(
  () => import("@/modules/admin/pages/SuperAdminSettingsPage"),
);
export const SuperAdminServerConfigPage = lazy(
  () => import("@/modules/admin/pages/SuperAdminServerConfigPage"),
);

/* ───────────────── OTHER COMPONENTS ───────────────── */

export const OnboardingModal = lazy(() =>
  import("@/modules/auth/components/OnboardingModal").then((m) => ({
    default: m.OnboardingModal,
  })),
);
