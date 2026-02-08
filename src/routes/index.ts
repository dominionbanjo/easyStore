/**
 * Centralized Route Configuration
 * All application routes are defined here for easy management and updates
 */

// 🌐 Public-facing website routes
export const WEBSITE_ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  STORES: "/stores",
  STORE_DETAILS: "/stores/:slug",
  CATEGORIES: "/categories",
  CATEGORY_DETAILS: "/categories/:slug",
  PRODUCT_DETAILS: "/product/:slug",
  SEARCH: "/s",
  CAREERS: "/careers",
  DISCOVERY: "/discovery",
  FEATURED: "/featured",
  TRENDING: "/trending",
  NEW_ARRIVALS: "/new-arrivals",
  NOT_FOUND: "*",
} as const;

// 👤 Auth-related routes
export const AUTH_ROUTES = {
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  VERIFY_OTP: "/auth/verify-otp",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
} as const;

// 🛒 User account routes
export const ACCOUNT_ROUTES = {
  BASE: "/account",
  PROFILE: "/account/profile",
  SETTINGS: "/account/settings",
  CART: "/account/cart",
  WISHLIST: "/account/wishlist",
  CHECKOUT: "/account/cart/preview",
  VERIFY_PAYMENT: "/account/verify-payment",
  ORDERS: "/account/orders",
  ORDER_DETAILS: "/account/orders/:id",
} as const;

// 🧑‍💼 Vendor dashboard routes
export const VENDOR_ROUTES = {
  BASE: "/vendor",
  DASHBOARD: "/vendor",
  ANALYTICS: "/vendor/analytics",

  // Products
  PRODUCTS: "/vendor/products",
  ADD_PRODUCT: "/vendor/products/new",
  EDIT_PRODUCT: "/vendor/products/:slug/edit",
  PRODUCT_PREVIEW: "/vendor/products/preview",

  // Orders
  ORDERS: "/vendor/orders",
  ORDER_DETAILS: "/vendor/orders/:id",

  // Customers
  CUSTOMERS: "/vendor/customers",

  // Settings
  SETTINGS: "/vendor/settings",
  HELP: "/vendor/help",
} as const;

// 👑 Admin dashboard routes
export const ADMIN_ROUTES = {
  BASE: "/admin",
  DASHBOARD: "/admin",
  VENDORS: "/admin/vendors",
  USERS: "/admin/users",
  TRANSACTIONS: "/admin/transactions",
  REPORTS: "/admin/reports",
  LOGS: "/admin/logs",
  NOTIFICATIONS: "/admin/notifications",
  ANALYTICS: "/admin/analytics",
  ACCESS_CONTROL: "/admin/access-control",
  SETTINGS: "/admin/settings",
  SYSTEM: "/admin/system",
} as const;

// Helper function to build dynamic routes
export const buildRoute = {
  storeDetails: (slug: string) => `/stores/${slug}`,
  categoryDetails: (slug: string) => `/categories/${slug}`,
  productDetails: (slug: string) => `/product/${slug}`,
  orderDetails: (id: string) => `/account/orders/${id}`,
  vendorOrderDetails: (id: string) => `/vendor/orders/${id}`,
  editProduct: (slug: string) => `/vendor/products/${slug}/edit`,
} as const;

// Export all routes as a single object for convenience
export const ROUTES = {
  WEBSITE: WEBSITE_ROUTES,
  AUTH: AUTH_ROUTES,
  ACCOUNT: ACCOUNT_ROUTES,
  VENDOR: VENDOR_ROUTES,
  ADMIN: ADMIN_ROUTES,
} as const;

// Legacy type exports for backward compatibility
export type { WEBSITE_ROUTES as WebsiteRoutes };
export type { AUTH_ROUTES as AuthRoutes };
export type { ACCOUNT_ROUTES as UserRoutes };
export type { VENDOR_ROUTES as SellerDashboardRoutes };
