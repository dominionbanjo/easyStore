import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AboutPage from "./pages/website/AboutPage";
import NotFoundPage from "./pages/website/NotFoundPage";
import LandingPage from "./pages/website/LandingPage";
import LoginPage from "./pages/auth/Login";
import SignupPage from "./pages/auth/Signup";
import ShopPage from "./pages/users/Shop";
import CategoriesPage from "./pages/users/Categories";
import ProductDetailPage from "./pages/users/ProductDetailsPage";
import FavouritesPage from "./pages/users/FavouritesPage";
import OrdersPage from "./pages/users/OrdersPage";
import OrderDetailsPage from "./pages/users/OrderDetailsPage";

// Seller dashboard imports
import DashboardLayout from "./modules/sellerDashboard/layouts/DashboardLayout";
import DashboardHome from "./pages/sellers/DashboardHome";
import MyStore from "./pages/sellers/MyStore";
import Orders from "./pages/sellers/Orders";
import Profile from "./pages/sellers/Profile";
import Settings from "./pages/sellers/Settings";
import AddProductPage from "./pages/sellers/addProductPage";
import EditProductPage from "./pages/sellers/editProductPage";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Website Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/favourites" element={<FavouritesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />

        {/* Authentication */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Misc */}
        <Route path="/about" element={<AboutPage />} />

        {/* Seller Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="store" element={<MyStore />} />
          <Route path="store/add-product" element={<AddProductPage />} />
          <Route path="store/edit/:id" element={<EditProductPage />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
