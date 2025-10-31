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

// Seller Dashboard
import DashboardLayout from "./modules/sellerDashboard/layouts/DashboardLayout";
import DashboardHome from "./pages/sellers/DashboardHome";
import MyStore from "./pages/sellers/MyStore";
import Orders from "./pages/sellers/Orders";
import Profile from "./pages/sellers/Profile";
import Settings from "./pages/sellers/Settings";
import AddProductPage from "./pages/sellers/addProductPage";
import EditProductPage from "./pages/sellers/editProductPage";
import StoreDetailsPage from "./pages/sellers/StoreDetailsPage";
import ScrollToTop from "./utils/ScrollToTop";

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

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="store" element={<MyStore />} />
          <Route path="store/add-product" element={<AddProductPage />} />
          <Route path="store/edit/:id" element={<EditProductPage />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
