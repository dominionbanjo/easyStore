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

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/favourites" element={<FavouritesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Misc */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
