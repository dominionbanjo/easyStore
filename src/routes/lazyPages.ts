import { lazy } from "react";

/* ───────────────── LAYOUTS (Direct Imports for snappier Shell) ───────────────── */
import HomepageLayout from "@/modules/website/layout/HomePageLayout";
import AccountsLayout from "@/modules/website/layout/AccountsLayout";
import VendorDashboardLayout from "@/modules/vendor/layout/VendorDashboardLayout";
import SuperAdminDashboardLayout from "@/modules/admin/layout/SuperAdminDashboardLayout";
import StorefrontLayout from "@/modules/vendor/layout/StorefrontLayout";
import LandingPage from "@/modules/website/pages/LandingPage";

export {
  HomepageLayout,
  AccountsLayout,
  VendorDashboardLayout,
  SuperAdminDashboardLayout,
  StorefrontLayout,
  LandingPage,
};

/* ───────────────── WEBSITE PAGES ───────────────── */
export const preloadLandingPage = () => Promise.resolve();

const AboutPageImport = () => import("@/modules/website/pages/AboutPage");
export const AboutPage = lazy(AboutPageImport);
export const preloadAboutPage = AboutPageImport;

const StoresPageImport = () => import("@/modules/website/pages/StoresPage");
export const StoresPage = lazy(StoresPageImport);
export const preloadStoresPage = StoresPageImport;

const StoreDetailsPageImport = () =>
  import("@/modules/vendor/pages/storeDetailsPage");
export const StoreDetailsPage = lazy(StoreDetailsPageImport);
export const preloadStoreDetailsPage = StoreDetailsPageImport;

const StoreProductDetailsPageImport = () =>
  import("@/modules/vendor/pages/StoreProductDetailsPage");
export const StoreProductDetailsPage = lazy(StoreProductDetailsPageImport);
export const preloadStoreProductDetailsPage = StoreProductDetailsPageImport;

const CategoriesPageImport = () => import("@/modules/website/pages/Categories");
export const CategoriesPage = lazy(CategoriesPageImport);
export const preloadCategoriesPage = CategoriesPageImport;

const CategoryDetailsPageImport = () =>
  import("@/modules/website/pages/SingleCategoryPage");
export const CategoryDetailsPage = lazy(CategoryDetailsPageImport);
export const preloadCategoryDetailsPage = CategoryDetailsPageImport;

const ProductDetailPageImport = () =>
  import("@/modules/website/pages/ProductDetailsPage");
export const ProductDetailPage = lazy(ProductDetailPageImport);
export const preloadProductDetailPage = ProductDetailPageImport;

const OrdersPageImport = () => import("@/modules/website/pages/OrdersPage");
export const OrdersPage = lazy(OrdersPageImport);
export const preloadOrdersPage = OrdersPageImport;
const OrderDetailsPageImport = () =>
  import("@/modules/website/pages/OrderDetailsPage");
export const OrderDetailsPage = lazy(OrderDetailsPageImport);
export const preloadOrderDetailsPage = OrderDetailsPageImport;

const WishlistPageImport = () => import("@/modules/website/pages/WishlistPage");
export const WishlistPage = lazy(WishlistPageImport);
export const preloadWishlistPage = WishlistPageImport;

const CartPageImport = () => import("@/modules/website/pages/CartPage");
export const CartPage = lazy(CartPageImport);
export const preloadCartPage = CartPageImport;

const CheckoutPageImport = () => import("@/modules/website/pages/CheckoutPage");
export const CheckoutPage = lazy(CheckoutPageImport);
export const preloadCheckoutPage = CheckoutPageImport;

const VerifyPaymentPageImport = () =>
  import("@/modules/website/pages/VerifyPayment");
export const VerifyPaymentPage = lazy(VerifyPaymentPageImport);
export const preloadVerifyPaymentPage = VerifyPaymentPageImport;

const SettingsPageImport = () => import("@/modules/website/pages/SettingsPage");
export const SettingsPage = lazy(SettingsPageImport);
export const preloadSettingsPage = SettingsPageImport;

const UserProfilePageImport = () =>
  import("@/modules/website/pages/ProfilePage");
export const UserProfilePage = lazy(UserProfilePageImport);
export const preloadUserProfilePage = UserProfilePageImport;

const SearchResultsPageImport = () =>
  import("@/modules/website/pages/SearchResultsPage");
export const SearchResultsPage = lazy(SearchResultsPageImport);
export const preloadSearchResultsPage = SearchResultsPageImport;
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
const DiscoveryPageImport = () =>
  import("@/modules/website/pages/DiscoveryPage");
export const DiscoveryPage = lazy(DiscoveryPageImport);
export const preloadDiscoveryPage = DiscoveryPageImport;
export const FeaturedStoresPage = lazy(
  () => import("@/modules/website/pages/FeaturedStoresPage"),
);
const FeaturedProductsPageImport = () =>
  import("@/modules/website/pages/FeaturedProductsPage");
export const FeaturedProductsPage = lazy(FeaturedProductsPageImport);
export const preloadFeaturedProductsPage = FeaturedProductsPageImport;
const TrendingProductsPageImport = () =>
  import("@/modules/website/pages/TrendingProductsPage");
export const TrendingProductsPage = lazy(TrendingProductsPageImport);
export const preloadTrendingProductsPage = TrendingProductsPageImport;
const NewArrivalsPageImport = () =>
  import("@/modules/website/pages/NewArrivalsPage");
export const NewArrivalsPage = lazy(NewArrivalsPageImport);
export const preloadNewArrivalsPage = NewArrivalsPageImport;

/* ───────────────── AUTH PAGES ───────────────── */
const LoginPageImport = () => import("@/modules/auth/pages/Login");
export const LoginPage = lazy(LoginPageImport);
export const preloadLoginPage = LoginPageImport;

const SignupPageImport = () => import("@/modules/auth/pages/Register");
export const SignupPage = lazy(SignupPageImport);
export const preloadSignupPage = SignupPageImport;

const VerifyOtpPageImport = () => import("@/modules/auth/pages/VerifyOtp");
export const VerifyOtpPage = lazy(VerifyOtpPageImport);
export const preloadVerifyOtpPage = VerifyOtpPageImport;

const ForgotPasswordPageImport = () =>
  import("@/modules/auth/pages/ForgotPasswordPage");
export const ForgotPasswordPage = lazy(ForgotPasswordPageImport);
export const preloadForgotPasswordPage = ForgotPasswordPageImport;

const ResetPasswordPageImport = () =>
  import("@/modules/auth/pages/ResetPasswordPage");
export const ResetPasswordPage = lazy(ResetPasswordPageImport);
export const preloadResetPasswordPage = ResetPasswordPageImport;

/* ───────────────── VENDOR PAGES ───────────────── */
const VendorDashboardPageImport = () =>
  import("@/modules/vendor/pages/VendorDashboardPage");
export const VendorDashboardPage = lazy(VendorDashboardPageImport);
export const preloadVendorDashboardPage = VendorDashboardPageImport;

const CustomersPageImport = () =>
  import("@/modules/vendor/pages/CustomersPage");
export const CustomersPage = lazy(CustomersPageImport);
export const preloadCustomersPage = CustomersPageImport;

const VendorOrdersPageImport = () =>
  import("@/modules/vendor/pages/OrdersPage");
export const VendorOrdersPage = lazy(VendorOrdersPageImport);
export const preloadVendorOrdersPage = VendorOrdersPageImport;

const ProductsPageImport = () => import("@/modules/vendor/pages/ProductsPage");
export const ProductsPage = lazy(ProductsPageImport);
export const preloadProductsPage = ProductsPageImport;

const AddProductPageImport = () =>
  import("@/modules/vendor/pages/AddProductsPage");
export const AddProductPage = lazy(AddProductPageImport);
export const preloadAddProductPage = AddProductPageImport;

const ProductPreviewPageImport = () =>
  import("@/modules/vendor/pages/ProductPreviewPage");
export const ProductPreviewPage = lazy(ProductPreviewPageImport);
export const preloadProductPreviewPage = ProductPreviewPageImport;

const VendorSettingsPageImport = () =>
  import("@/modules/vendor/pages/StoreSettingsPage");
export const VendorSettingsPage = lazy(VendorSettingsPageImport);
export const preloadVendorSettingsPage = VendorSettingsPageImport;

const HelpPageImport = () => import("@/modules/vendor/pages/HelpPage");
export const HelpPage = lazy(HelpPageImport);
export const preloadHelpPage = HelpPageImport;

const AnalyticsPageImport = () =>
  import("@/modules/vendor/pages/AnalyticsPage");
export const AnalyticsPage = lazy(AnalyticsPageImport);
export const preloadAnalyticsPage = AnalyticsPageImport;

const VendorTemplatesPageImport = () =>
  import("@/modules/vendor/pages/VendorTemplatesPage");
export const VendorTemplatesPage = lazy(VendorTemplatesPageImport);
export const preloadVendorTemplatesPage = VendorTemplatesPageImport;

/* ───────────────── ADMIN PAGES ───────────────── */
const SuperAdminOverviewPageImport = () =>
  import("@/modules/admin/pages/SuperAdminOverviewPage");
export const SuperAdminOverviewPage = lazy(SuperAdminOverviewPageImport);
export const preloadSuperAdminOverviewPage = SuperAdminOverviewPageImport;

const SuperAdminVendorsPageImport = () =>
  import("@/modules/admin/pages/SuperAdminVendorsPage");
export const SuperAdminVendorsPage = lazy(SuperAdminVendorsPageImport);
export const preloadSuperAdminVendorsPage = SuperAdminVendorsPageImport;

const SuperAdminUsersPageImport = () =>
  import("@/modules/admin/pages/SuperAdminUsersPage");
export const SuperAdminUsersPage = lazy(SuperAdminUsersPageImport);
export const preloadSuperAdminUsersPage = SuperAdminUsersPageImport;

const SuperAdminTransactionsPageImport = () =>
  import("@/modules/admin/pages/SuperAdminTransactionsPage");
export const SuperAdminTransactionsPage = lazy(
  SuperAdminTransactionsPageImport,
);
export const preloadSuperAdminTransactionsPage =
  SuperAdminTransactionsPageImport;

const SuperAdminReportsPageImport = () =>
  import("@/modules/admin/pages/SuperAdminReportsPage");
export const SuperAdminReportsPage = lazy(SuperAdminReportsPageImport);
export const preloadSuperAdminReportsPage = SuperAdminReportsPageImport;

const SuperAdminLogsPageImport = () =>
  import("@/modules/admin/pages/SuperAdminLogsPage");
export const SuperAdminLogsPage = lazy(SuperAdminLogsPageImport);
export const preloadSuperAdminLogsPage = SuperAdminLogsPageImport;

const SuperAdminNotificationsPageImport = () =>
  import("@/modules/admin/pages/SuperAdminNotificationsPage");
export const SuperAdminNotificationsPage = lazy(
  SuperAdminNotificationsPageImport,
);
export const preloadSuperAdminNotificationsPage =
  SuperAdminNotificationsPageImport;

const SuperAdminPlatformAnalysisPageImport = () =>
  import("@/modules/admin/pages/SuperAdminPlatformAnalysisPage");
export const SuperAdminPlatformAnalysisPage = lazy(
  SuperAdminPlatformAnalysisPageImport,
);
export const preloadSuperAdminPlatformAnalysisPage =
  SuperAdminPlatformAnalysisPageImport;

const SuperAdminAccessControlPageImport = () =>
  import("@/modules/admin/pages/SuperAdminAccessControlPage");
export const SuperAdminAccessControlPage = lazy(
  SuperAdminAccessControlPageImport,
);
export const preloadSuperAdminAccessControlPage =
  SuperAdminAccessControlPageImport;

const SuperAdminSettingsPageImport = () =>
  import("@/modules/admin/pages/SuperAdminSettingsPage");
export const SuperAdminSettingsPage = lazy(SuperAdminSettingsPageImport);
export const preloadSuperAdminSettingsPage = SuperAdminSettingsPageImport;

const SuperAdminServerConfigPageImport = () =>
  import("@/modules/admin/pages/SuperAdminServerConfigPage");
export const SuperAdminServerConfigPage = lazy(
  SuperAdminServerConfigPageImport,
);
export const preloadSuperAdminServerConfigPage =
  SuperAdminServerConfigPageImport;

/* ───────────────── OTHER COMPONENTS ───────────────── */

export const OnboardingModal = lazy(() =>
  import("@/modules/auth/components/OnboardingModal").then((m) => ({
    default: m.OnboardingModal,
  })),
);
