import ScrollToTop from "./utils/ScrollToTop";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Public Website Pages
import LandingPage from "./pages/website/LandingPage";
import AboutPage from "./pages/website/AboutPage";
import NotFoundPage from "./pages/website/NotFoundPage";
import HomepageLayout from "./components/layout/homepage/HomePageLayout";

// User Pages
import ShopPage from "./pages/users/Shop";
import CategoriesPage from "./pages/users/Categories";
import ProductDetailPage from "./pages/users/ProductDetailsPage";
import OrdersPage from "./pages/users/OrdersPage";
import OrderDetailsPage from "./pages/users/OrderDetailsPage";
import CartPage from "./pages/users/CartPage";
import WishlistPage from "./pages/users/WishlistPage";
import SettingsPage from "./pages/users/SettingsPage";
import CategoryDetailsPage from "./pages/users/SingleCategoryPage";

// Auth Pages
import LoginPage from "./pages/auth/Login";
import SignupPage from "./pages/auth/Register";
import VerifyOtpPage from "./pages/auth/VerifyOtp";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

//vendor
import VendorDashboardPage from "./modules/vendor/pages/VendorDashboardPage";
import VendorDashboardLayout from "./modules/vendor/layout/VendorDashboardLayout";
import CustomersPage from "./modules/vendor/pages/CustomersPage";
import VendorOrdersPage from "./modules/vendor/pages/OrdersPage";
import ProductsPage from "./modules/vendor/pages/ProductsPage";
import VendorSettingsPage from "./modules/vendor/pages/SettingsPage";
import HelpPage from "./modules/vendor/pages/HelpPage";
import AnalyticsPage from "./modules/vendor/pages/AnalyticsPage";

import StoreDetailsPage from "./modules/store/storeDetailsPage";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/vendor" element={<VendorDashboardLayout />}>
          <Route path="" element={<VendorDashboardPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="orders" element={<VendorOrdersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="settings" element={<VendorSettingsPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>

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

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
