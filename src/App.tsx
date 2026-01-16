import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ScrollToTop from "./utils/ScrollToTop";
import AppLoader from "./components/shared/AppLoader";

/* ───────────────── LAYOUTS ───────────────── */

// Website
const HomepageLayout = lazy(
  () => import("./modules/website/layout/HomePageLayout")
);
const AccountsLayout = lazy(
  () => import("./modules/website/layout/AccountsLayout")
);

// Vendor
const VendorDashboardLayout = lazy(
  () => import("./modules/vendor/layout/VendorDashboardLayout")
);

// Admin
const SuperAdminDashboardLayout = lazy(
  () => import("./modules/admin/layout/SuperAdminDashboardLayout")
);

/* ───────────────── WEBSITE PAGES ───────────────── */

const LandingPage = lazy(() => import("./modules/website/pages/LandingPage"));
const AboutPage = lazy(() => import("./modules/website/pages/AboutPage"));
const StoresPage = lazy(() => import("./modules/website/pages/StoresPage"));
const StoreDetailsPage = lazy(
  () => import("./modules/vendor/pages/storeDetailsPage")
);
const CategoriesPage = lazy(() => import("./modules/website/pages/Categories"));
const CategoryDetailsPage = lazy(
  () => import("./modules/website/pages/SingleCategoryPage")
);
const ProductDetailPage = lazy(
  () => import("./modules/website/pages/ProductDetailsPage")
);
const OrdersPage = lazy(() => import("./modules/website/pages/OrdersPage"));
const OrderDetailsPage = lazy(
  () => import("./modules/website/pages/OrderDetailsPage")
);
const WishlistPage = lazy(() => import("./modules/website/pages/WishlistPage"));
const CartPage = lazy(() => import("./modules/website/pages/CartPage"));
const SettingsPage = lazy(() => import("./modules/website/pages/SettingsPage"));
const UserProfilePage = lazy(
  () => import("./modules/website/pages/ProfilePage")
);
const SearchResultsPage = lazy(
  () => import("./modules/website/pages/SearchResultsPage")
);
const NotFoundPage = lazy(() => import("./modules/website/pages/NotFoundPage"));

/* ───────────────── AUTH PAGES ───────────────── */

const LoginPage = lazy(() => import("./modules/auth/pages/Login"));
const SignupPage = lazy(() => import("./modules/auth/pages/Register"));
const VerifyOtpPage = lazy(() => import("./modules/auth/pages/VerifyOtp"));
const ForgotPasswordPage = lazy(
  () => import("./modules/auth/pages/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(
  () => import("./modules/auth/pages/ResetPasswordPage")
);

/* ───────────────── VENDOR PAGES ───────────────── */

const VendorDashboardPage = lazy(
  () => import("./modules/vendor/pages/VendorDashboardPage")
);
const CustomersPage = lazy(
  () => import("./modules/vendor/pages/CustomersPage")
);
const VendorOrdersPage = lazy(
  () => import("./modules/vendor/pages/OrdersPage")
);
const ProductsPage = lazy(() => import("./modules/vendor/pages/ProductsPage"));
const VendorSettingsPage = lazy(
  () => import("./modules/vendor/pages/SettingsPage")
);
const HelpPage = lazy(() => import("./modules/vendor/pages/HelpPage"));
const AnalyticsPage = lazy(
  () => import("./modules/vendor/pages/AnalyticsPage")
);

/* ───────────────── ADMIN PAGES ───────────────── */

const SuperAdminOverviewPage = lazy(
  () => import("./modules/admin/pages/SuperAdminOverviewPage")
);
const SuperAdminVendorsPage = lazy(
  () => import("./modules/admin/pages/SuperAdminVendorsPage")
);
const SuperAdminUsersPage = lazy(
  () => import("./modules/admin/pages/SuperAdminUsersPage")
);
const SuperAdminTransactionsPage = lazy(
  () => import("./modules/admin/pages/SuperAdminTransactionsPage")
);
const SuperAdminReportsPage = lazy(
  () => import("./modules/admin/pages/SuperAdminReportsPage")
);
const SuperAdminLogsPage = lazy(
  () => import("./modules/admin/pages/SuperAdminLogsPage")
);
const SuperAdminNotificationsPage = lazy(
  () => import("./modules/admin/pages/SuperAdminNotificationsPage")
);
const SuperAdminPlatformAnalysisPage = lazy(
  () => import("./modules/admin/pages/SuperAdminPlatformAnalysisPage")
);
const SuperAdminAccessControlPage = lazy(
  () => import("./modules/admin/pages/SuperAdminAccessControlPage")
);
const SuperAdminSettingsPage = lazy(
  () => import("./modules/admin/pages/SuperAdminSettingsPage")
);
const SuperAdminServerConfigPage = lazy(
  () => import("./modules/admin/pages/SuperAdminServerConfigPage")
);

/* ───────────────── APP ───────────────── */

export default function App() {
  return (
    <Router>
      <ScrollToTop />

      {/* Global Suspense Boundary */}
      <Suspense fallback={<AppLoader />}>
        <Routes>
          {/* ─── WEBSITE ─── */}
          <Route path="/" element={<HomepageLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="s" element={<SearchResultsPage />} />
            <Route path="stores" element={<StoresPage />} />
            <Route path="stores/:slug" element={<StoreDetailsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="categories/:slug" element={<CategoryDetailsPage />} />
            <Route path="product/:slug" element={<ProductDetailPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailsPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
          </Route>

          {/* ─── ACCOUNT ─── */}
          <Route path="/account" element={<AccountsLayout />}>
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="cart" element={<CartPage />} />
          </Route>

          {/* ─── AUTH ─── */}
          <Route path="/auth">
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="verify-otp" element={<VerifyOtpPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
          </Route>

          {/* ─── VENDOR ─── */}
          <Route path="/vendor" element={<VendorDashboardLayout />}>
            <Route index element={<VendorDashboardPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="orders" element={<VendorOrdersPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="settings" element={<VendorSettingsPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>

          {/* ─── ADMIN ─── */}
          <Route path="/admin" element={<SuperAdminDashboardLayout />}>
            <Route index element={<SuperAdminOverviewPage />} />
            <Route path="vendors" element={<SuperAdminVendorsPage />} />
            <Route path="users" element={<SuperAdminUsersPage />} />
            <Route
              path="transactions"
              element={<SuperAdminTransactionsPage />}
            />
            <Route path="reports" element={<SuperAdminReportsPage />} />
            <Route path="logs" element={<SuperAdminLogsPage />} />
            <Route
              path="notifications"
              element={<SuperAdminNotificationsPage />}
            />
            <Route
              path="analytics"
              element={<SuperAdminPlatformAnalysisPage />}
            />
            <Route
              path="access-control"
              element={<SuperAdminAccessControlPage />}
            />
            <Route path="settings" element={<SuperAdminSettingsPage />} />
            <Route path="system" element={<SuperAdminServerConfigPage />} />
          </Route>

          {/* ─── FALLBACK ─── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
