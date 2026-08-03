import { lazyWithRecovery as lazy } from "./lazyWithRecovery";

/* ───────────────── LAYOUTS (Direct Imports for snappier Shell) ───────────────── */
import HomepageLayout from "@/modules/website/layout/HomePageLayout";
import AccountsLayout from "@/modules/website/layout/AccountsLayout";
import VendorDashboardLayout from "@/modules/vendor/layout/VendorDashboardLayout";
import SuperAdminDashboardLayout from "@/modules/admin/layout/SuperAdminDashboardLayout";
import StorefrontLayout from "@/modules/vendor/layout/StorefrontLayout";
import LandingPage from "@/app/page";

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

const AboutPageImport = () => import("@/app/about/page");
export const AboutPage = lazy(AboutPageImport);
export const preloadAboutPage = AboutPageImport;

const StoresPageImport = () => import("@/app/stores/page");
export const StoresPage = lazy(StoresPageImport);
export const preloadStoresPage = StoresPageImport;

const StoreDetailsPageImport = () => import("@/app/stores/[slug]/page");
export const StoreDetailsPage = lazy(StoreDetailsPageImport);
export const preloadStoreDetailsPage = StoreDetailsPageImport;

const StoreProductDetailsPageImport = () =>
  import("@/app/stores/[slug]/products/[productSlug]/page");
export const StoreProductDetailsPage = lazy(StoreProductDetailsPageImport);
export const preloadStoreProductDetailsPage = StoreProductDetailsPageImport;

const CategoriesPageImport = () => import("@/app/categories/page");
export const CategoriesPage = lazy(CategoriesPageImport);
export const preloadCategoriesPage = CategoriesPageImport;

const CategoryDetailsPageImport = () => import("@/app/categories/[slug]/page");
export const CategoryDetailsPage = lazy(CategoryDetailsPageImport);
export const preloadCategoryDetailsPage = CategoryDetailsPageImport;

const ProductDetailPageImport = () => import("@/app/product/[slug]/page");
export const ProductDetailPage = lazy(ProductDetailPageImport);
export const preloadProductDetailPage = ProductDetailPageImport;

const OrdersPageImport = () => import("@/app/account/orders/page");
export const OrdersPage = lazy(OrdersPageImport);
export const preloadOrdersPage = OrdersPageImport;
const OrderDetailsPageImport = () => import("@/app/account/orders/[id]/page");
export const OrderDetailsPage = lazy(OrderDetailsPageImport);
export const preloadOrderDetailsPage = OrderDetailsPageImport;

const WishlistPageImport = () => import("@/app/account/wishlist/page");
export const WishlistPage = lazy(WishlistPageImport);
export const preloadWishlistPage = WishlistPageImport;

const CartPageImport = () => import("@/app/cart/page");
export const CartPage = lazy(CartPageImport);
export const preloadCartPage = CartPageImport;

const CheckoutPageImport = () => import("@/app/cart/preview/page");
export const CheckoutPage = lazy(CheckoutPageImport);
export const preloadCheckoutPage = CheckoutPageImport;

const VerifyPaymentPageImport = () =>
  import("@/app/account/verify-payment/page");
export const VerifyPaymentPage = lazy(VerifyPaymentPageImport);
export const preloadVerifyPaymentPage = VerifyPaymentPageImport;

const SettingsPageImport = () => import("@/app/account/settings/page");
export const SettingsPage = lazy(SettingsPageImport);
export const preloadSettingsPage = SettingsPageImport;

const UserProfilePageImport = () => import("@/app/account/profile/page");
export const UserProfilePage = lazy(UserProfilePageImport);
export const preloadUserProfilePage = UserProfilePageImport;
const MessagesPageImport = () => import("@/app/account/messages/page");
export const MessagesPage = lazy(MessagesPageImport);
export const preloadMessagesPage = MessagesPageImport;

const SearchResultsPageImport = () => import("@/app/s/page");
export const SearchResultsPage = lazy(SearchResultsPageImport);
export const preloadSearchResultsPage = SearchResultsPageImport;
export const NotFoundPage = lazy(() => import("@/app/not-found/page"));
export const PrivacyPolicyPage = lazy(
  () => import("@/app/privacy-policy/page"),
);
export const TermsOfServicePage = lazy(
  () => import("@/app/terms-of-service/page"),
);
export const CareersPage = lazy(() => import("@/app/careers/page"));
const DiscoveryPageImport = () => import("@/app/discovery/page");
export const DiscoveryPage = lazy(DiscoveryPageImport);
export const preloadDiscoveryPage = DiscoveryPageImport;
export const FeaturedStoresPage = lazy(
  () => import("@/app/featured-stores/page"),
);
const FeaturedProductsPageImport = () => import("@/app/featured/page");
export const FeaturedProductsPage = lazy(FeaturedProductsPageImport);
export const preloadFeaturedProductsPage = FeaturedProductsPageImport;
const TrendingProductsPageImport = () => import("@/app/trending/page");
export const TrendingProductsPage = lazy(TrendingProductsPageImport);
export const preloadTrendingProductsPage = TrendingProductsPageImport;
const NewArrivalsPageImport = () => import("@/app/new-arrivals/page");
export const NewArrivalsPage = lazy(NewArrivalsPageImport);
export const preloadNewArrivalsPage = NewArrivalsPageImport;

const ZonesPageImport = () => import("@/app/zones/page");
export const ZonesPage = lazy(ZonesPageImport);
export const preloadZonesPage = ZonesPageImport;

const ZoneDetailsPageImport = () => import("@/app/zones/[identifier]/page");
export const ZoneDetailsPage = lazy(ZoneDetailsPageImport);
export const preloadZoneDetailsPage = ZoneDetailsPageImport;

/* ───────────────── AUTH PAGES ───────────────── */
const LoginPageImport = () => import("@/app/(auth)/login/page");
export const LoginPage = lazy(LoginPageImport);
export const preloadLoginPage = LoginPageImport;

const SignupPageImport = () => import("@/app/(auth)/signup/page");
export const SignupPage = lazy(SignupPageImport);
export const preloadSignupPage = SignupPageImport;

const VerifyOtpPageImport = () => import("@/app/(auth)/verify-otp/page");
export const VerifyOtpPage = lazy(VerifyOtpPageImport);
export const preloadVerifyOtpPage = VerifyOtpPageImport;

const ForgotPasswordPageImport = () =>
  import("@/app/(auth)/forgot-password/page");
export const ForgotPasswordPage = lazy(ForgotPasswordPageImport);
export const preloadForgotPasswordPage = ForgotPasswordPageImport;

const ResetPasswordPageImport = () =>
  import("@/app/(auth)/reset-password/page");
export const ResetPasswordPage = lazy(ResetPasswordPageImport);
export const preloadResetPasswordPage = ResetPasswordPageImport;

/* ───────────────── VENDOR PAGES ───────────────── */
const VendorDashboardPageImport = () => import("@/app/(dashboard)/vendor/page");
export const VendorDashboardPage = lazy(VendorDashboardPageImport);
export const preloadVendorDashboardPage = VendorDashboardPageImport;

const CustomersPageImport = () =>
  import("@/app/(dashboard)/vendor/customers/page");
export const CustomersPage = lazy(CustomersPageImport);
export const preloadCustomersPage = CustomersPageImport;

const VendorOrdersPageImport = () =>
  import("@/app/(dashboard)/vendor/orders/page");
export const VendorOrdersPage = lazy(VendorOrdersPageImport);
export const preloadVendorOrdersPage = VendorOrdersPageImport;

const ProductsPageImport = () =>
  import("@/app/(dashboard)/vendor/products/page");
export const ProductsPage = lazy(ProductsPageImport);
export const preloadProductsPage = ProductsPageImport;

const AddProductPageImport = () =>
  import("@/app/(dashboard)/vendor/products/new/page");
export const AddProductPage = lazy(AddProductPageImport);
export const preloadAddProductPage = AddProductPageImport;

const ProductPreviewPageImport = () =>
  import("@/app/(dashboard)/vendor/products/preview/page");
export const ProductPreviewPage = lazy(ProductPreviewPageImport);
export const preloadProductPreviewPage = ProductPreviewPageImport;

const VendorSettingsPageImport = () =>
  import("@/app/(dashboard)/vendor/settings/page");
export const VendorSettingsPage = lazy(VendorSettingsPageImport);
export const preloadVendorSettingsPage = VendorSettingsPageImport;

const HelpPageImport = () => import("@/app/(dashboard)/vendor/help/page");
export const HelpPage = lazy(HelpPageImport);
export const preloadHelpPage = HelpPageImport;

const AnalyticsPageImport = () =>
  import("@/app/(dashboard)/vendor/analytics/page");
export const AnalyticsPage = lazy(AnalyticsPageImport);
export const preloadAnalyticsPage = AnalyticsPageImport;
const VendorPayoutsPageImport = () =>
  import("@/app/(dashboard)/vendor/payouts/page");
export const VendorPayoutsPage = lazy(VendorPayoutsPageImport);
export const preloadVendorPayoutsPage = VendorPayoutsPageImport;

const VendorTemplatesPageImport = () =>
  import("@/app/(dashboard)/vendor/templates/page");
export const VendorTemplatesPage = lazy(VendorTemplatesPageImport);
export const preloadVendorTemplatesPage = VendorTemplatesPageImport;

const VendorMessagesPageImport = () => import("@/app/(dashboard)/vendor/messages/page");
export const VendorMessagesPage = lazy(VendorMessagesPageImport);
export const preloadVendorMessagesPage = VendorMessagesPageImport;

const VendorSchoolZonesPageImport = () =>
  import("@/app/(dashboard)/vendor/school-zones/page");
export const VendorSchoolZonesPage = lazy(VendorSchoolZonesPageImport);
export const preloadVendorSchoolZonesPage = VendorSchoolZonesPageImport;

const VendorSchoolZoneDetailPageImport = () =>
  import("@/app/(dashboard)/vendor/school-zones/[id]/page");
export const VendorSchoolZoneDetailPage = lazy(VendorSchoolZoneDetailPageImport);
export const preloadVendorSchoolZoneDetailPage =
  VendorSchoolZoneDetailPageImport;

/* ───────────────── STAFF PAGES ───────────────── */
const StaffManagementPageImport = () =>
  import("@/modules/vendor/components/staff/StaffManagementPage").then((m) => ({ default: m.StaffManagementPage }));
export const StaffManagementPage = lazy(StaffManagementPageImport);
export const preloadStaffManagementPage = StaffManagementPageImport;

const SalesTerminalPageImport = () =>
  import("@/modules/vendor/components/sales-terminal/SalesTerminalPage").then((m) => ({ default: m.SalesTerminalPage }));
export const SalesTerminalPage = lazy(SalesTerminalPageImport);
export const preloadSalesTerminalPage = SalesTerminalPageImport;

const StaffSettingsPageImport = () =>
  import("@/modules/staff/StaffSettingsPage").then((m) => ({ default: m.StaffSettingsPage }));
export const StaffSettingsPage = lazy(StaffSettingsPageImport);
export const preloadStaffSettingsPage = StaffSettingsPageImport;

const SalesHistoryPageImport = () =>
  import("@/modules/vendor/components/sales-history/SalesHistoryPage").then((m) => ({ default: m.SalesHistoryPage }));
export const SalesHistoryPage = lazy(SalesHistoryPageImport);
export const preloadSalesHistoryPage = SalesHistoryPageImport;

import { StaffDashboardLayout as _StaffDashboardLayout } from "@/modules/vendor/layout/StaffDashboardLayout";
export const StaffDashboardLayout = _StaffDashboardLayout;

/* ───────────────── ADMIN PAGES ───────────────── */
const SuperAdminOverviewPageImport = () =>
  import("@/app/(dashboard)/admin/page");
export const SuperAdminOverviewPage = lazy(SuperAdminOverviewPageImport);
export const preloadSuperAdminOverviewPage = SuperAdminOverviewPageImport;

const SuperAdminVendorsPageImport = () =>
  import("@/app/(dashboard)/admin/vendors/page");
export const SuperAdminVendorsPage = lazy(SuperAdminVendorsPageImport);
export const preloadSuperAdminVendorsPage = SuperAdminVendorsPageImport;

const SuperAdminSchoolZonesPageImport = () =>
  import("@/app/(dashboard)/admin/school-zones/page");
export const SuperAdminSchoolZonesPage = lazy(SuperAdminSchoolZonesPageImport);
export const preloadSuperAdminSchoolZonesPage = SuperAdminSchoolZonesPageImport;

const SuperAdminSchoolZoneDetailPageImport = () =>
  import("@/app/(dashboard)/admin/school-zones/[id]/page");
export const SuperAdminSchoolZoneDetailPage = lazy(
  SuperAdminSchoolZoneDetailPageImport,
);
export const preloadSuperAdminSchoolZoneDetailPage =
  SuperAdminSchoolZoneDetailPageImport;

const SuperAdminUsersPageImport = () =>
  import("@/app/(dashboard)/admin/users/page");
export const SuperAdminUsersPage = lazy(SuperAdminUsersPageImport);
export const preloadSuperAdminUsersPage = SuperAdminUsersPageImport;

const SuperAdminTransactionsPageImport = () =>
  import("@/app/(dashboard)/admin/transactions/page");
export const SuperAdminTransactionsPage = lazy(
  SuperAdminTransactionsPageImport,
);
export const preloadSuperAdminTransactionsPage =
  SuperAdminTransactionsPageImport;

const SuperAdminOrdersPageImport = () =>
  import("@/app/(dashboard)/admin/orders/page");
export const SuperAdminOrdersPage = lazy(SuperAdminOrdersPageImport);
export const preloadSuperAdminOrdersPage = SuperAdminOrdersPageImport;

const SuperAdminPayoutsPageImport = () =>
  import("@/app/(dashboard)/admin/payouts/page");
export const SuperAdminPayoutsPage = lazy(SuperAdminPayoutsPageImport);
export const preloadSuperAdminPayoutsPage = SuperAdminPayoutsPageImport;

const SuperAdminReportsPageImport = () =>
  import("@/app/(dashboard)/admin/reports/page");
export const SuperAdminReportsPage = lazy(SuperAdminReportsPageImport);
export const preloadSuperAdminReportsPage = SuperAdminReportsPageImport;

const SuperAdminLogsPageImport = () =>
  import("@/app/(dashboard)/admin/logs-page/page");
export const SuperAdminLogsPage = lazy(SuperAdminLogsPageImport);
export const preloadSuperAdminLogsPage = SuperAdminLogsPageImport;

const SuperAdminNotificationsPageImport = () =>
  import("@/app/(dashboard)/admin/notifications/page");
export const SuperAdminNotificationsPage = lazy(
  SuperAdminNotificationsPageImport,
);
export const preloadSuperAdminNotificationsPage =
  SuperAdminNotificationsPageImport;

const SuperAdminPlatformAnalysisPageImport = () =>
  import("@/app/(dashboard)/admin/analytics/page");
export const SuperAdminPlatformAnalysisPage = lazy(
  SuperAdminPlatformAnalysisPageImport,
);
export const preloadSuperAdminPlatformAnalysisPage =
  SuperAdminPlatformAnalysisPageImport;

const SuperAdminAccessControlPageImport = () =>
  import("@/app/(dashboard)/admin/access-control/page");
export const SuperAdminAccessControlPage = lazy(
  SuperAdminAccessControlPageImport,
);
export const preloadSuperAdminAccessControlPage =
  SuperAdminAccessControlPageImport;

const SuperAdminSettingsPageImport = () =>
  import("@/app/(dashboard)/admin/settings/page");
export const SuperAdminSettingsPage = lazy(SuperAdminSettingsPageImport);
export const preloadSuperAdminSettingsPage = SuperAdminSettingsPageImport;

const SuperAdminServerConfigPageImport = () =>
  import("@/app/(dashboard)/admin/system/page");
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
