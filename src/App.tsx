import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { Suspense } from "react";
// Utils & Components
import ScrollToTop from "@/utils/ScrollToTop";

// Lazy-loaded Components
import * as Pages from "@/routes/lazyComponents";
import LoadingScreen from "./Loading";
import { OnboardingModal } from "@/modules/auth/components/OnboardingModal";

/* ───────────────── APP ───────────────── */

export default function App() {
  return (
    <Router>
      <ScrollToTop />

      {/* Routes directly rendered to avoid root-level flickering */}
      <Routes>
        {/* ─── WEBSITE ─── */}
        <Route path="/" element={<Pages.HomepageLayout />}>
          <Route index element={<Pages.LandingPage />} />
          <Route path="s" element={<Pages.SearchResultsPage />} />
          <Route path="stores" element={<Pages.StoresPage />} />
          <Route path="stores/:slug" element={<Pages.StoreDetailsPage />} />
          <Route path="categories" element={<Pages.CategoriesPage />} />
          <Route
            path="categories/:slug"
            element={<Pages.CategoryDetailsPage />}
          />
          <Route path="product/:slug" element={<Pages.ProductDetailPage />} />
          <Route path="about" element={<Pages.AboutPage />} />
          <Route path="privacy-policy" element={<Pages.PrivacyPolicyPage />} />
          <Route
            path="terms-of-service"
            element={<Pages.TermsOfServicePage />}
          />
          <Route path="careers" element={<Pages.CareersPage />} />
          <Route path="discovery" element={<Pages.DiscoveryPage />} />
          <Route path="featured" element={<Pages.FeaturedProductsPage />} />
          <Route path="trending" element={<Pages.TrendingProductsPage />} />
          <Route path="new-arrivals" element={<Pages.NewArrivalsPage />} />
        </Route>

        {/* ─── ACCOUNT ─── */}
        <Route path="/account" element={<Pages.AccountsLayout />}>
          <Route path="profile" element={<Pages.UserProfilePage />} />
          <Route path="settings" element={<Pages.SettingsPage />} />
          <Route path="cart" element={<Pages.CartPage />} />
          <Route path="wishlist" element={<Pages.WishlistPage />} />
          <Route path="cart/preview" element={<Pages.CheckoutPage />} />
          <Route path="verify-payment" element={<Pages.VerifyPaymentPage />} />
          <Route path="orders" element={<Pages.OrdersPage />} />
          <Route path="orders/:id" element={<Pages.OrderDetailsPage />} />
        </Route>

        {/* ─── AUTH ─── */}
        <Route
          path="/auth"
          element={
            <Suspense fallback={<LoadingScreen fullPage={false} />}>
              <Outlet />
            </Suspense>
          }
        >
          <Route path="login" element={<Pages.LoginPage />} />
          <Route path="signup" element={<Pages.SignupPage />} />
          <Route path="verify-otp" element={<Pages.VerifyOtpPage />} />
          <Route
            path="forgot-password"
            element={<Pages.ForgotPasswordPage />}
          />
          <Route path="reset-password" element={<Pages.ResetPasswordPage />} />
        </Route>

        {/* ─── VENDOR ─── */}
        <Route path="/vendor" element={<Pages.VendorDashboardLayout />}>
          <Route index element={<Pages.VendorDashboardPage />} />
          <Route path="customers" element={<Pages.CustomersPage />} />
          <Route path="orders" element={<Pages.VendorOrdersPage />} />

          {/* Products */}
          <Route path="products" element={<Pages.ProductsPage />} />
          <Route path="products/new" element={<Pages.AddProductPage />} />
          <Route
            path="products/:slug/edit"
            element={<Pages.AddProductPage />}
          />
          <Route
            path="products/preview"
            element={<Pages.ProductPreviewPage />}
          />

          <Route path="analytics" element={<Pages.AnalyticsPage />} />
          <Route path="settings" element={<Pages.VendorSettingsPage />} />
          <Route path="help" element={<Pages.HelpPage />} />
        </Route>

        {/* ─── ADMIN ─── */}
        <Route path="/admin" element={<Pages.SuperAdminDashboardLayout />}>
          <Route index element={<Pages.SuperAdminOverviewPage />} />
          <Route path="vendors" element={<Pages.SuperAdminVendorsPage />} />
          <Route path="users" element={<Pages.SuperAdminUsersPage />} />
          <Route
            path="transactions"
            element={<Pages.SuperAdminTransactionsPage />}
          />
          <Route path="reports" element={<Pages.SuperAdminReportsPage />} />
          <Route path="logs" element={<Pages.SuperAdminLogsPage />} />
          <Route
            path="notifications"
            element={<Pages.SuperAdminNotificationsPage />}
          />
          <Route
            path="analytics"
            element={<Pages.SuperAdminPlatformAnalysisPage />}
          />
          <Route
            path="access-control"
            element={<Pages.SuperAdminAccessControlPage />}
          />
          <Route path="settings" element={<Pages.SuperAdminSettingsPage />} />
          <Route path="system" element={<Pages.SuperAdminServerConfigPage />} />
        </Route>

        {/* ─── FALLBACK ─── */}
        <Route
          path="*"
          element={
            <Suspense fallback={<LoadingScreen fullPage={false} />}>
              <Pages.NotFoundPage />
            </Suspense>
          }
        />
      </Routes>
      <OnboardingModal />
    </Router>
  );
}
