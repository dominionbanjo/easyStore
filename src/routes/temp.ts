// 🌐 Public-facing website routes
export enum WEBSITE_ROUTES {
  HOME = "/",
  ABOUT = "/about",
  STORES = "/stores",
  CATEGORIES = "/categories",
  SETTINGS = "/settings",
  NOT_FOUND = "*",
}

// 👤 Auth-related routes
export enum AUTH_ROUTES {
  LOGIN = "/auth/login",
  SIGNUP = "/auth/signup",
  VERIFY_OTP = "/auth/verify-otp",
  FORGOT_PASSWORD = "/auth/forgot-password",
}

// 🛒 User-facing dashboard or account routes
export enum USER_ROUTES {
  SHOP = "/shop",
  CATEGORIES = "/categories",
  PRODUCT_DETAIL = "/product/:slug",
  WISHLIST = "/wishlist",
  ORDERS = "/orders",
  ORDER_DETAILS = "/orders/:id",
  PROFILE = "/account/profile",
  SETTINGS = "/account/settings",
  CART = "/account/cart",
}

// 🧑‍💼 Seller / Vendor dashboard routes
export enum SELLER_DASHBOARD_ROUTES {
  // Overview analytics
  DASHBOARD = "/vendor",
  ANALYTICS = "/vendor/analytics",

  // Store management
  PRODUCTS = "/vendor/products",
  ADD_PRODUCT = "/vendor/products/add",
  EDIT_PRODUCT = "/vendor/products/edit/:id",
  CATEGORIES = "/vendor/products/categories",

  // Orders management
  ORDERS = "/vendor/orders",
  ORDER_DETAIL = "/vendor/orders/:id",

  // Customers
  CUSTOMERS = "/vendor/customers",

  // Reviews & Ratings
  REVIEWS = "/vendor/reviews",

  // Reports
  REPORTS = "/vendor/reports",

  // Profile and Settings
  PROFILE = "/vendor/profile",
  SETTINGS = "/vendor/settings",
}
