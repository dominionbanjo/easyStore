import { Routes, Route, Outlet } from "react-router-dom";
import { Suspense, useEffect } from "react";
// Utils & Components
import ScrollToTop from "@/utils/ScrollToTop";
import { getSubdomain, getBaseDomain, areSubdomainsDisabled } from "@/utils/subdomain";
import ChunkLoadBoundary from "@/components/shared/ChunkLoadBoundary";
import SEO from "@/components/shared/SEO";
// Lazy-loaded Components
import * as Pages from "@/routes/lazyPages";
import {
  HomepageLayout,
  AccountsLayout,
  VendorDashboardLayout,
  SuperAdminDashboardLayout,
  StaffDashboardLayout,
} from "@/routes/lazyPages";
import LoadingScreen from "@/Loading";

/* ───────────────── APP ───────────────── */

export default function App() {
  const subdomain = getSubdomain();
  const subdomainsDisabled = areSubdomainsDisabled();

  useEffect(() => {
    if (subdomainsDisabled) return; // Skip all subdomain-management redirects on localhost

    const path = window.location.pathname;
    const query = window.location.search;
    const hash = window.location.hash;
    const baseHost = getBaseDomain();

    const redirectTo = (url: string) => {
      window.location.replace(url);
    };

    const PUBLIC_WEBSITE_ROUTES = [
      "/s",
      "/stores",
      "/categories",
      "/product/",
      "/about",
      "/privacy-policy",
      "/terms-of-service",
      "/careers",
      "/discovery",
      "/featured",
      "/trending",
      "/new-arrivals",
      "/cart",
      "/account",
    ];

    if (subdomain) {
      if (
        path.startsWith("/auth") ||
        PUBLIC_WEBSITE_ROUTES.some((route) => path.startsWith(route))
      ) {
        redirectTo(
          `${window.location.protocol}//${baseHost}${path}${query}${hash}`,
        );
        return;
      }
    }

    // Force strict paths on the base domain to respective subdomains
    if (!subdomain && path.startsWith("/vendor")) {
      const newPath = path.replace(/^\/vendor/, "") || "/";
      redirectTo(
        `${window.location.protocol}//vendor.${baseHost}${newPath}${query}${hash}`,
      );
    } else if (!subdomain && path.startsWith("/admin")) {
      const newPath = path.replace(/^\/admin/, "") || "/";
      redirectTo(
        `${window.location.protocol}//admin.${baseHost}${newPath}${query}${hash}`,
      );
    } else if (subdomain) {
      // Clean up /stores/slug on individual store subdomains
      if (subdomain !== "vendor" && subdomain !== "admin" && path.startsWith(`/stores/${subdomain}`)) {
        const newPath = path.replace(`/stores/${subdomain}`, "") || "/";
        redirectTo(newPath + query + hash);
        return;
      }
      
      // Redirect legacy /dashboard to root on vendor/admin subdomains
      if ((subdomain === "vendor" || subdomain === "admin") && (path === "/dashboard" || path === "/dashboard/")) {
        redirectTo("/" + query + hash);
        return;
      }
    }
  }, [subdomain, subdomainsDisabled]);

  return (
    <>
      <SEO />
      <ScrollToTop />

      {/* ─── GLOBAL SUSPENSE ─── */}
      <ChunkLoadBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>

            {/* ══════════════════════════════════════════
                DEV MODE (subdomains disabled)
                All route trees declared statically so React Router
                matches by path — no snapshot checks on pathname.
                ══════════════════════════════════════════ */}
            {subdomainsDisabled && (
              <>
                {/* ─── VENDOR DASHBOARD  (/vendor/*) ─── */}
                <Route path="/vendor" element={<VendorDashboardLayout />}>
                  <Route index element={<Pages.VendorDashboardPage />} />
                  <Route path="customers" element={<Pages.CustomersPage />} />
                  <Route path="orders" element={<Pages.VendorOrdersPage />} />
                  <Route path="products" element={<Pages.ProductsPage />} />
                  <Route path="products/new" element={<Pages.AddProductPage />} />
                  <Route path="products/:slug/edit" element={<Pages.AddProductPage />} />
                  <Route path="products/preview" element={<Pages.ProductPreviewPage />} />
                  <Route path="analytics" element={<Pages.AnalyticsPage />} />
                  <Route path="payouts" element={<Pages.VendorPayoutsPage />} />
                  <Route path="messages/:id?" element={<Pages.VendorMessagesPage />} />
                  <Route path="templates" element={<Pages.VendorTemplatesPage />} />
                  <Route path="settings" element={<Pages.VendorSettingsPage />} />
                  <Route path="help" element={<Pages.HelpPage />} />
                  <Route path="staff" element={<Pages.StaffManagementPage />} />
                  <Route path="sales-terminal" element={<Pages.SalesTerminalPage />} />
                  <Route path="sales-history" element={<Pages.SalesHistoryPage />} />
                  <Route path="school-zones" element={<Pages.VendorSchoolZonesPage />} />
                  <Route path="school-zones/:id" element={<Pages.VendorSchoolZoneDetailPage />} />
                </Route>

                {/* ─── STAFF DASHBOARD (dev mode) ─── */}
                <Route path="/staff" element={<StaffDashboardLayout />}>
                  <Route index element={<Pages.SalesTerminalPage />} />
                  <Route path="sales-history" element={<Pages.SalesHistoryPage />} />
                  <Route path="settings" element={<Pages.StaffSettingsPage />} />
                </Route>

                {/* ─── ADMIN DASHBOARD  (/admin/*) ─── */}
                <Route path="/admin" element={<SuperAdminDashboardLayout />}>
                  <Route index element={<Pages.SuperAdminOverviewPage />} />
                  <Route path="vendors" element={<Pages.SuperAdminVendorsPage />} />
                  <Route path="school-zones" element={<Pages.SuperAdminSchoolZonesPage />} />
                  <Route path="school-zones/:id" element={<Pages.SuperAdminSchoolZoneDetailPage />} />
                  <Route path="orders" element={<Pages.SuperAdminOrdersPage />} />
                  <Route path="installments" element={<Pages.SuperAdminInstallmentsPage />} />
                  <Route path="users" element={<Pages.SuperAdminUsersPage />} />
                  <Route path="transactions" element={<Pages.SuperAdminTransactionsPage />} />
                  <Route path="payouts" element={<Pages.SuperAdminPayoutsPage />} />
                  <Route path="reports" element={<Pages.SuperAdminReportsPage />} />
                  <Route path="logs" element={<Pages.SuperAdminLogsPage />} />
                  <Route path="notifications" element={<Pages.SuperAdminNotificationsPage />} />
                  <Route path="analytics" element={<Pages.SuperAdminPlatformAnalysisPage />} />
                  <Route path="access-control" element={<Pages.SuperAdminAccessControlPage />} />
                  <Route path="settings" element={<Pages.SuperAdminSettingsPage />} />
                  <Route path="system" element={<Pages.SuperAdminServerConfigPage />} />
                </Route>
              </>
            )}

            {/* ══════════════════════════════════════════
                PRODUCTION MODE (subdomains enabled)
                Routes are gated by the detected subdomain.
                ══════════════════════════════════════════ */}
            {!subdomainsDisabled && subdomain === "vendor" && (
              <Route path="/" element={<VendorDashboardLayout />}>
                <Route index element={<Pages.VendorDashboardPage />} />
                <Route path="customers" element={<Pages.CustomersPage />} />
                <Route path="orders" element={<Pages.VendorOrdersPage />} />
                <Route path="products" element={<Pages.ProductsPage />} />
                <Route path="products/new" element={<Pages.AddProductPage />} />
                <Route path="products/:slug/edit" element={<Pages.AddProductPage />} />
                <Route path="products/preview" element={<Pages.ProductPreviewPage />} />
                <Route path="analytics" element={<Pages.AnalyticsPage />} />
                <Route path="payouts" element={<Pages.VendorPayoutsPage />} />
                <Route path="messages/:id?" element={<Pages.VendorMessagesPage />} />
                <Route path="templates" element={<Pages.VendorTemplatesPage />} />
                <Route path="settings" element={<Pages.VendorSettingsPage />} />
                <Route path="help" element={<Pages.HelpPage />} />
                <Route path="staff" element={<Pages.StaffManagementPage />} />
                <Route path="sales-terminal" element={<Pages.SalesTerminalPage />} />
                <Route path="sales-history" element={<Pages.SalesHistoryPage />} />
                <Route path="school-zones" element={<Pages.VendorSchoolZonesPage />} />
                <Route path="school-zones/:id" element={<Pages.VendorSchoolZoneDetailPage />} />
              </Route>
            )}

            {!subdomainsDisabled && subdomain === "staff" && (
              <Route path="/" element={<StaffDashboardLayout />}>
                <Route index element={<Pages.SalesTerminalPage />} />
                <Route path="sales-history" element={<Pages.SalesHistoryPage />} />
                <Route path="settings" element={<Pages.StaffSettingsPage />} />
              </Route>
            )}

            {!subdomainsDisabled && subdomain === "admin" && (
              <Route path="/" element={<SuperAdminDashboardLayout />}>
                <Route index element={<Pages.SuperAdminOverviewPage />} />
                <Route path="vendors" element={<Pages.SuperAdminVendorsPage />} />
                <Route path="school-zones" element={<Pages.SuperAdminSchoolZonesPage />} />
                <Route path="school-zones/:id" element={<Pages.SuperAdminSchoolZoneDetailPage />} />
                <Route path="orders" element={<Pages.SuperAdminOrdersPage />} />
                <Route path="installments" element={<Pages.SuperAdminInstallmentsPage />} />
                <Route path="users" element={<Pages.SuperAdminUsersPage />} />
                <Route path="transactions" element={<Pages.SuperAdminTransactionsPage />} />
                <Route path="payouts" element={<Pages.SuperAdminPayoutsPage />} />
                <Route path="reports" element={<Pages.SuperAdminReportsPage />} />
                <Route path="logs" element={<Pages.SuperAdminLogsPage />} />
                <Route path="notifications" element={<Pages.SuperAdminNotificationsPage />} />
                <Route path="analytics" element={<Pages.SuperAdminPlatformAnalysisPage />} />
                <Route path="access-control" element={<Pages.SuperAdminAccessControlPage />} />
                <Route path="settings" element={<Pages.SuperAdminSettingsPage />} />
                <Route path="system" element={<Pages.SuperAdminServerConfigPage />} />
              </Route>
            )}

            {/* ─── STORE SUBDOMAIN (production only) ─── */}
            {!subdomainsDisabled && subdomain && subdomain !== "vendor" && subdomain !== "admin" && (
              <Route path="/" element={<Pages.StorefrontLayout />}>
                <Route index element={<Pages.StoreDetailsPage />} />
                <Route
                  path="products/:productSlug"
                  element={<Pages.StoreProductDetailsPage />}
                />
              </Route>
            )}

            {/* ─── WEBSITE (all modes) ─── */}
            <Route element={<HomepageLayout />}>
              {/* Landing page: shown on base domain (production) OR always in dev */}
              {(!subdomain || subdomainsDisabled) && (
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
              <Route path="/start-selling" element={<Pages.StartSellingPage />} />
              <Route path="/featured" element={<Pages.FeaturedProductsPage />} />
              <Route path="/trending" element={<Pages.TrendingProductsPage />} />
              <Route path="/new-arrivals" element={<Pages.NewArrivalsPage />} />
              <Route path="/products" element={<Pages.AllProductsPage />} />
              <Route path="/zones" element={<Pages.ZonesPage />} />
              <Route
                path="/zones/:identifier"
                element={<Pages.ZoneDetailsPage />}
              />
              {/* Alias: /school-zones/:identifier also resolves to the zone marketplace */}
              <Route path="/school-zones" element={<Pages.ZonesPage />} />
              <Route
                path="/school-zones/:identifier"
                element={<Pages.ZoneDetailsPage />}
              />
              <Route path="/cart" element={<Pages.CartPage />} />
              <Route path="/cart/preview" element={<Pages.CheckoutPage />} />
            </Route>

            {/* ─── VENDOR STOREFRONTS via path  /stores/:slug ─── */}
            <Route path="/stores/:slug" element={<Pages.StorefrontLayout />}>
              <Route index element={<Pages.StoreDetailsPage />} />
              <Route
                path="products/:productSlug"
                element={<Pages.StoreProductDetailsPage />}
              />
            </Route>

            {/* ─── ACCOUNT (all) ─── */}
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
              <Route path="messages/:id?" element={<Pages.MessagesPage />} />
            </Route>

            {/* ─── AUTH (all) ─── */}
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
      </ChunkLoadBoundary>
      <ChunkLoadBoundary>
        <Suspense fallback={null}>
          <Pages.OnboardingModal />
        </Suspense>
      </ChunkLoadBoundary>
    </>
  );
}
