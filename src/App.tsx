import ScrollToTop from "./utils/ScrollToTop";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Public Website Pages
import LandingPage from "./modules/website/pages/LandingPage";
import AboutPage from "./modules/website/pages/AboutPage";
import NotFoundPage from "./modules/website/pages/NotFoundPage";
import HomepageLayout from "./modules/website/layout/HomePageLayout";

// User Pages
import ShopPage from "./modules/website/pages/Shop";
import CategoriesPage from "./modules/website/pages/Categories";
import ProductDetailPage from "./modules/website/pages/ProductDetailsPage";
import OrdersPage from "./modules/website/pages/OrdersPage";
import OrderDetailsPage from "./modules/website/pages/OrderDetailsPage";
import CartPage from "./modules/website/pages/CartPage";
import WishlistPage from "./modules/website/pages/WishlistPage";
import SettingsPage from "./modules/website/pages/SettingsPage";
import CategoryDetailsPage from "./modules/website/pages/SingleCategoryPage";

// Auth Pages
import LoginPage from "./modules/auth/pages/Login";
import SignupPage from "./modules/auth/pages/Register";
import VerifyOtpPage from "./modules/auth/pages/VerifyOtp";
import ForgotPasswordPage from "./modules/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./modules/auth/pages/ResetPasswordPage";

// Vendor
import VendorDashboardPage from "./modules/vendor/pages/VendorDashboardPage";
import VendorDashboardLayout from "./modules/vendor/layout/VendorDashboardLayout";
import CustomersPage from "./modules/vendor/pages/CustomersPage";
import VendorOrdersPage from "./modules/vendor/pages/OrdersPage";
import ProductsPage from "./modules/vendor/pages/ProductsPage";
import VendorSettingsPage from "./modules/vendor/pages/SettingsPage";
import HelpPage from "./modules/vendor/pages/HelpPage";
import AnalyticsPage from "./modules/vendor/pages/AnalyticsPage";

// Super Admin
import StoreDetailsPage from "./modules/vendor/pages/storeDetailsPage";
import SuperAdminDashboardLayout from "./modules/admin/layout/SuperAdminDashboardLayout";
import SuperAdminOverviewPage from "./modules/admin/pages/SuperAdminOverviewPage";
import SuperAdminVendorsPage from "./modules/admin/pages/SuperAdminVendorsPage";
import SuperAdminUsersPage from "./modules/admin/pages/SuperAdminUsersPage";
import SuperAdminTransactionsPage from "./modules/admin/pages/SuperAdminTransactionsPage";
import SuperAdminReportsPage from "./modules/admin/pages/SuperAdminReportsPage";
import SuperAdminLogsPage from "./modules/admin/pages/SuperAdminLogsPage";
import SuperAdminNotificationsPage from "./modules/admin/pages/SuperAdminNotificationsPage";
import SuperAdminPlatformAnalysisPage from "./modules/admin/pages/SuperAdminPlatformAnalysisPage";
import SuperAdminAccessControlPage from "./modules/admin/pages/SuperAdminAccessControlPage";
import SuperAdminSettingsPage from "./modules/admin/pages/SuperAdminSettingsPage";
import SuperAdminServerConfigPage from "./modules/admin/pages/SuperAdminServerConfigPage";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomepageLayout />}>
          <Route path="" element={<LandingPage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="shop/:id" element={<StoreDetailsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/:id" element={<CategoryDetailsPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="/auth">
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="verify-otp" element={<VerifyOtpPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>

        <Route path="/vendor" element={<VendorDashboardLayout />}>
          <Route path="" element={<VendorDashboardPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="orders" element={<VendorOrdersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="settings" element={<VendorSettingsPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>

        <Route path="/admin" element={<SuperAdminDashboardLayout />}>
          <Route index element={<SuperAdminOverviewPage />} />
          <Route path="vendors" element={<SuperAdminVendorsPage />} />
          <Route path="users" element={<SuperAdminUsersPage />} />
          <Route path="transactions" element={<SuperAdminTransactionsPage />} />
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

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
