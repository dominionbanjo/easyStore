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
  CART: "/cart",
  CHECKOUT: "/cart/preview",
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
  WISHLIST: "/account/wishlist",
  VERIFY_PAYMENT: "/account/verify-payment",
  ORDERS: "/account/orders",
  ORDER_DETAILS: "/account/orders/:id",
  MESSAGES: "/account/messages",
} as const;

// 🧑‍💼 Vendor dashboard routes
export const VENDOR_ROUTES = {
  BASE: "/",
  DASHBOARD: "/",
  ANALYTICS: "/analytics",

  // Products
  PRODUCTS: "/products",
  ADD_PRODUCT: "/products/new",
  EDIT_PRODUCT: "/products/:slug/edit",
  PRODUCT_PREVIEW: "/products/preview",

  // Orders
  ORDERS: "/orders",
  ORDER_DETAILS: "/orders/:id",

  // Customers
  CUSTOMERS: "/customers",
  STAFF: "/staff",
  MESSAGES: "/messages",
  TEMPLATES: "/templates",

  // Settings
  SETTINGS: "/settings",
  HELP: "/help",
} as const;

// 👑 Admin dashboard routes
export const ADMIN_ROUTES = {
  BASE: "/",
  DASHBOARD: "/",
  VENDORS: "/vendors",
  ORDERS: "/orders",
  USERS: "/users",
  TRANSACTIONS: "/transactions",
  REPORTS: "/reports",
  LOGS: "/logs",
  NOTIFICATIONS: "/notifications",
  ANALYTICS: "/analytics",
  ACCESS_CONTROL: "/access-control",
  SETTINGS: "/settings",
  SYSTEM: "/system",
} as const;

// Helper function to build dynamic routes
export const buildRoute = {
  storeDetails: (slug: string) => `/stores/${slug}`,
  categoryDetails: (slug: string) => `/categories/${slug}`,
  productDetails: (slug: string) => `/product/${slug}`,
  orderDetails: (id: string) => `/account/orders/${id}`,
  vendorOrderDetails: (id: string) => `/orders/${id}`,
  editProduct: (slug: string) => `/products/${slug}/edit`,
  messages: (id: string) => `/account/messages/${id}`,
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
