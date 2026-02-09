/* ───────────────── LAYOUTS ───────────────── */

// Website Layouts
import HomepageLayout from "@/modules/website/layout/HomePageLayout";
import AccountsLayout from "@/modules/website/layout/AccountsLayout";
import VendorDashboardLayout from "@/modules/vendor/layout/VendorDashboardLayout";
import SuperAdminDashboardLayout from "@/modules/admin/layout/SuperAdminDashboardLayout";

export {
  HomepageLayout,
  AccountsLayout,
  VendorDashboardLayout,
  SuperAdminDashboardLayout,
};

/* ───────────────── WEBSITE PAGES ───────────────── */

export { default as LandingPage } from "@/modules/website/pages/LandingPage";
export { default as AboutPage } from "@/modules/website/pages/AboutPage";
export { default as StoresPage } from "@/modules/website/pages/StoresPage";
export { default as StoreDetailsPage } from "@/modules/vendor/pages/storeDetailsPage";
export { default as CategoriesPage } from "@/modules/website/pages/Categories";
export { default as CategoryDetailsPage } from "@/modules/website/pages/SingleCategoryPage";
export { default as ProductDetailPage } from "@/modules/website/pages/ProductDetailsPage";
export { default as OrdersPage } from "@/modules/website/pages/OrdersPage";
export { default as OrderDetailsPage } from "@/modules/website/pages/OrderDetailsPage";
export { default as WishlistPage } from "@/modules/website/pages/WishlistPage";
export { default as CartPage } from "@/modules/website/pages/CartPage";
export { default as CheckoutPage } from "@/modules/website/pages/CheckoutPage";
export { default as VerifyPaymentPage } from "@/modules/website/pages/VerifyPayment";
export { default as SettingsPage } from "@/modules/website/pages/SettingsPage";
export { default as UserProfilePage } from "@/modules/website/pages/ProfilePage";
export { default as SearchResultsPage } from "@/modules/website/pages/SearchResultsPage";
export { default as NotFoundPage } from "@/modules/website/pages/NotFoundPage";
export { default as PrivacyPolicyPage } from "@/modules/website/pages/PrivacyPolicyPage";
export { default as TermsOfServicePage } from "@/modules/website/pages/TermsOfServicePage";
export { default as CareersPage } from "@/modules/website/pages/CareersPage";
export { default as DiscoveryPage } from "@/modules/website/pages/DiscoveryPage";
export { default as FeaturedStoresPage } from "@/modules/website/pages/FeaturedStoresPage";
export { default as FeaturedProductsPage } from "@/modules/website/pages/FeaturedProductsPage";
export { default as TrendingProductsPage } from "@/modules/website/pages/TrendingProductsPage";
export { default as NewArrivalsPage } from "@/modules/website/pages/NewArrivalsPage";

/* ───────────────── AUTH PAGES ───────────────── */

export { default as LoginPage } from "@/modules/auth/pages/Login";
export { default as SignupPage } from "@/modules/auth/pages/Register";
export { default as VerifyOtpPage } from "@/modules/auth/pages/VerifyOtp";
export { default as ForgotPasswordPage } from "@/modules/auth/pages/ForgotPasswordPage";
export { default as ResetPasswordPage } from "@/modules/auth/pages/ResetPasswordPage";

/* ───────────────── VENDOR PAGES ───────────────── */

export { default as VendorDashboardPage } from "@/modules/vendor/pages/VendorDashboardPage";
export { default as CustomersPage } from "@/modules/vendor/pages/CustomersPage";
export { default as VendorOrdersPage } from "@/modules/vendor/pages/OrdersPage";
export { default as ProductsPage } from "@/modules/vendor/pages/ProductsPage";
export { default as AddProductPage } from "@/modules/vendor/pages/AddProductsPage";
export { default as ProductPreviewPage } from "@/modules/vendor/pages/ProductPreviewPage";
export { default as VendorSettingsPage } from "@/modules/vendor/pages/SettingsPage";
export { default as HelpPage } from "@/modules/vendor/pages/HelpPage";
export { default as AnalyticsPage } from "@/modules/vendor/pages/AnalyticsPage";

/* ───────────────── ADMIN PAGES ───────────────── */

export { default as SuperAdminOverviewPage } from "@/modules/admin/pages/SuperAdminOverviewPage";
export { default as SuperAdminVendorsPage } from "@/modules/admin/pages/SuperAdminVendorsPage";
export { default as SuperAdminUsersPage } from "@/modules/admin/pages/SuperAdminUsersPage";
export { default as SuperAdminTransactionsPage } from "@/modules/admin/pages/SuperAdminTransactionsPage";
export { default as SuperAdminReportsPage } from "@/modules/admin/pages/SuperAdminReportsPage";
export { default as SuperAdminLogsPage } from "@/modules/admin/pages/SuperAdminLogsPage";
export { default as SuperAdminNotificationsPage } from "@/modules/admin/pages/SuperAdminNotificationsPage";
export { default as SuperAdminPlatformAnalysisPage } from "@/modules/admin/pages/SuperAdminPlatformAnalysisPage";
export { default as SuperAdminAccessControlPage } from "@/modules/admin/pages/SuperAdminAccessControlPage";
export { default as SuperAdminSettingsPage } from "@/modules/admin/pages/SuperAdminSettingsPage";
export { default as SuperAdminServerConfigPage } from "@/modules/admin/pages/SuperAdminServerConfigPage";

/* ───────────────── OTHER COMPONENTS ───────────────── */

export { OnboardingModal } from "@/modules/auth/components/OnboardingModal";
