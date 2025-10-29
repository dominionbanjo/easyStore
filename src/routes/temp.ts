// src/enums/routes.ts

export enum WEBSITE_ROUTES {
  HOME = "/", // renamed from LANDING for clarity
  ABOUT = "/about",
  NOT_FOUND = "*",
  SHOP = "/shop",
  CATEGORIES = "/categories",
  SETTINGS = "/settings",
}

export enum USER_ROUTES {
  SHOP = "/shop",
  CATEGORIES = "/categories",
  PRODUCT_DETAIL = "/product/:id",
  WISHLIST = "/wishlist",
  ORDERS = "/orders",
  ORDER_DETAILS = "/orders/:id",
}

export enum AUTH_ROUTES {
  LOGIN = "/auth/login",
  SIGNUP = "/auth/signup",
  VERIFY_OTP = "/auth/verify-otp",
  FORGOT_PASSWORD = "/auth/forgot-password",
}

export enum SELLER_DASHBOARD_ROUTES {
  DASHBOARD = "/dashboard",
  HOME = "/dashboard", // index route
  STORE = "/dashboard/store",
  ADD_PRODUCT = "/dashboard/store/add-product",
  EDIT_PRODUCT = "/dashboard/store/edit/:id",
  ORDERS = "/dashboard/orders",
  PROFILE = "/dashboard/profile",
  SETTINGS = "/dashboard/settings",
}
