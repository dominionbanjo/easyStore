import { Routes, Route, Outlet } from "react-router-dom";
import { Suspense, useEffect } from "react";
// Utils & Components
import ScrollToTop from "@/utils/ScrollToTop";
import { getSubdomain, getBaseDomain } from "@/utils/subdomain";

// Lazy-loaded Components
import * as Pages from "@/routes/lazyPages";
import {
  HomepageLayout,
  AccountsLayout,
  VendorDashboardLayout,
  SuperAdminDashboardLayout,
} from "@/routes/lazyPages";
import LoadingScreen from "@/Loading";

/* ───────────────── APP ───────────────── */

export default function App() {
  const subdomain = getSubdomain();

  useEffect(() => {
    const path = window.location.pathname;
    const baseHost = getBaseDomain();

    // Redirect all auth pages on subdomains to the base domain
    if (subdomain && path.startsWith("/auth")) {
      window.location.href = `${window.location.protocol}//${baseHost}${path}${window.location.search}`;
      return;
    }

    // Force strict paths on the base domain to respective subdomains
    if (!subdomain && path.startsWith("/vendor")) {
      const newPath = path.replace(/^\/vendor/, "") || "/";
      window.location.href = `${window.location.protocol}//vendor.${baseHost}${newPath}${window.location.search}`;
    } else if (!subdomain && path.startsWith("/admin")) {
      const newPath = path.replace(/^\/admin/, "") || "/";
      window.location.href = `${window.location.protocol}//admin.${baseHost}${newPath}${window.location.search}`;
    } else if (subdomain && subdomain !== "vendor" && subdomain !== "admin") {
      // Clean up /stores/slug on individual store subdomains
      if (path.startsWith(`/stores/${subdomain}`)) {
        const newPath = path.replace(`/stores/${subdomain}`, "") || "/";
        window.location.href = newPath + window.location.search;
      }
    }
  }, [subdomain]);

  return (
    <>
      <ScrollToTop />

      {/* ─── GLOBAL SUSPENSE ─── */}
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* ─── SITE ROOT ─── */}
          {subdomain && subdomain !== "vendor" && subdomain !== "admin" && (
            <Route path="/" element={<Pages.StorefrontLayout />}>
              <Route index element={<Pages.StoreDetailsPage />} />
              <Route
                path="products/:productId"
                element={<Pages.StoreProductDetailsPage />}
              />
            </Route>
          )}

          {/* ─── VENDOR DASHBOARD ─── */}
          {subdomain === "vendor" && (
            <Route path="/" element={<VendorDashboardLayout />}>
              <Route index element={<Pages.VendorDashboardPage />} />
              <Route path="customers" element={<Pages.CustomersPage />} />
              <Route path="orders" element={<Pages.VendorOrdersPage />} />
              <Route path="products" element={<Pages.ProductsPage />} />
              <Route path="products/new" element={<Pages.AddProductPage />} />
              <Route path="products/:slug/edit" element={<Pages.AddProductPage />} />
              <Route path="products/preview" element={<Pages.ProductPreviewPage />} />
              <Route path="analytics" element={<Pages.AnalyticsPage />} />
              <Route path="templates" element={<Pages.VendorTemplatesPage />} />
              <Route path="settings" element={<Pages.VendorSettingsPage />} />
              <Route path="help" element={<Pages.HelpPage />} />
            </Route>
          )}

          {/* ─── ADMIN DASHBOARD ─── */}
          {subdomain === "admin" && (
            <Route path="/" element={<SuperAdminDashboardLayout />}>
              <Route index element={<Pages.SuperAdminOverviewPage />} />
              <Route path="vendors" element={<Pages.SuperAdminVendorsPage />} />
              <Route path="users" element={<Pages.SuperAdminUsersPage />} />
              <Route path="transactions" element={<Pages.SuperAdminTransactionsPage />} />
              <Route path="reports" element={<Pages.SuperAdminReportsPage />} />
              <Route path="logs" element={<Pages.SuperAdminLogsPage />} />
              <Route path="notifications" element={<Pages.SuperAdminNotificationsPage />} />
              <Route path="analytics" element={<Pages.SuperAdminPlatformAnalysisPage />} />
              <Route path="access-control" element={<Pages.SuperAdminAccessControlPage />} />
              <Route path="settings" element={<Pages.SuperAdminSettingsPage />} />
              <Route path="system" element={<Pages.SuperAdminServerConfigPage />} />
            </Route>
          )}

          {/* ─── WEBSITE ─── */}
          <Route element={<HomepageLayout />}>
            {!subdomain && (
              <Route path="/" element={<Pages.LandingPage />} />
            )}
            <Route path="/s" element={<Pages.SearchResultsPage />} />
            <Route path="/stores" element={<Pages.StoresPage />} />
            <Route path="/categories" element={<Pages.CategoriesPage />} />
            <Route
              path="/categories/:slug"
              element={<Pages.CategoryDetailsPage />}
            />
            <Route path="/product/:slug" element={<Pages.ProductDetailPage />} />
            <Route path="/about" element={<Pages.AboutPage />} />
            <Route
              path="/privacy-policy"
              element={<Pages.PrivacyPolicyPage />}
            />
            <Route
              path="/terms-of-service"
              element={<Pages.TermsOfServicePage />}
            />
            <Route path="/careers" element={<Pages.CareersPage />} />
            <Route path="/discovery" element={<Pages.DiscoveryPage />} />
            <Route path="/featured" element={<Pages.FeaturedProductsPage />} />
            <Route path="/trending" element={<Pages.TrendingProductsPage />} />
            <Route path="/new-arrivals" element={<Pages.NewArrivalsPage />} />
            <Route path="/cart" element={<Pages.CartPage />} />
            <Route path="/cart/preview" element={<Pages.CheckoutPage />} />
          </Route>

          {/* ─── VENDOR STOREFRONTS ─── */}
          <Route path="/stores/:slug" element={<Pages.StorefrontLayout />}>
            <Route index element={<Pages.StoreDetailsPage />} />
            <Route
              path="products/:productId"
              element={<Pages.StoreProductDetailsPage />}
            />
          </Route>


          {/* ─── ACCOUNT ROUTING (All domains) ─── */}
          <Route path="/account" element={<AccountsLayout />}>
            <Route path="profile" element={<Pages.UserProfilePage />} />
            <Route path="settings" element={<Pages.SettingsPage />} />
            <Route path="wishlist" element={<Pages.WishlistPage />} />
            <Route
              path="verify-payment"
              element={<Pages.VerifyPaymentPage />}
            />
            <Route path="orders" element={<Pages.OrdersPage />} />
            <Route path="orders/:id" element={<Pages.OrderDetailsPage />} />
          </Route>

          {/* ─── AUTH ROUTING (All domains) ─── */}
          <Route path="/auth" element={<Outlet />}>
            <Route path="login" element={<Pages.LoginPage />} />
            <Route path="signup" element={<Pages.SignupPage />} />
            <Route path="verify-otp" element={<Pages.VerifyOtpPage />} />
            <Route
              path="forgot-password"
              element={<Pages.ForgotPasswordPage />}
            />
            <Route
              path="reset-password"
              element={<Pages.ResetPasswordPage />}
            />
          </Route>

          {/* ─── FALLBACK ─── */}
          <Route path="*" element={<Pages.NotFoundPage />} />
        </Routes>
      </Suspense>
      <Suspense fallback={null}>
        <Pages.OnboardingModal />
      </Suspense>
    </>
  );
}
