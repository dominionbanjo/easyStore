export interface ICheckStoreNameResponse {
  status: "success" | "error";
  message: string;
  data: null;
}

/* ───────────────── STORE ───────────────── */

export interface IStore {
  id: string;
  store_name: string;
  slug: string;
  subdomain: string | null;
  category: string | null;
  description: string | null;
  logo: string | null;
  rating_average: string; // comes as string from backend
  total_products: number;
  address: string | null;
}

/* ───────────────── PAGINATION ───────────────── */

export interface IStorePagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/* ───────────────── LIST RESPONSE ───────────────── */

export interface IGetStoresResponse {
  status: "success" | "error";
  message: string;
  data: {
    items: IStore[];
    pagination: IStorePagination;
  };
}

/* ───────────────── QUERY ARGS ───────────────── */

export interface GetStoresArgs {
  page?: number;
  limit?: number;
  search?: string;
  state?: string;
}

/* ───────────────── SEARCH STORES ───────────────── */

export interface SearchStoresArgs {
  q: string;
  page?: number;
  limit?: number;
  state?: string;
}

export interface ISearchStoresResponse {
  status: "success" | "error";
  message: string;
  data: {
    items: IStore[];
    pagination: IStorePagination;
  };
}

/* ───────────────── STORE DETAILS ───────────────── */

export interface IStoreDetails {
  id: string;
  user_id: string;
  vendor_id: string;
  store_name: string;
  slug: string;
  subdomain: string | null;
  category: string | null;
  description: string | null;
  logo: string | null;
  cover_image: string | null;
  cover_image_public_id: string | null;
  email: string | null;
  phone_number: string | null;
  social_links: Record<string, string> | null;
  rating_average: string;
  rating_count: number;
  total_products: number;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_country: string | null;
  address_postal_code: string | null;
  setup_stage: number;
  last_bank_update: string | null;
  bank_code: string | null;
  account_number: string | null;
  bank_name: string | null;
  recipient_code: string | null;
  payout_verified: boolean;
  status: "active" | "pending" | "restricted" | "banned";
  user?: {
    first_name: string;
    last_name: string;
    username: string;
    avatar: string | null;
    account_status?: "active" | "pending" | "restricted" | "banned";
  };
  created_at: string;
  theme?: {
    template: ITemplate;
    custom_config: ThemeConfig;
  };
}

export interface IStoreCategory {
  id: string;
  name: string;
  slug: string;
}

export interface IStorePagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IStoreDetailsResponse {
  status: "success" | "error";
  message: string;
  data: {
    store: IStoreDetails;
    products: {
      data: IStoreProduct[];
      pagination: IStorePagination;
    };
    categories: IStoreCategory[];
  };
}

export interface GetStoreDetailsArgs {
  slug: string;
  includeProducts?: boolean;
  includeCategories?: boolean;
}

/* ───────── STORE PRODUCT ITEM ───────── */

export interface IStoreProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount_price?: number | null;
  on_sale?: boolean;
  image: string;
  rating_average: number;
  stock: number;
  is_in_wishlist?: boolean;
  store_slug?: string;
  colors?: { id: string; name: string; hex: string }[];
  sizes?: string[];
  category?: string;
  store_name?: string;
  created_at?: string;
  options?: { name: string; values: string[] }[] | null;
  variants?:
    | {
        id: string;
        combinations?: Record<string, string>;
        price: number;
        stock: number;
        discount_price?: number;
        image_url?: string | null;
      }[]
    | null;
}

/* ───────── GET STORE PRODUCTS ARGS ───────── */

export interface GetStoreProductsArgs {
  slug: string;
  page?: number;
  limit?: number;
  q?: string;
}

/* ───────── GET STORE PRODUCTS RESPONSE ───────── */

export interface IGetStoreProductsResponse {
  status: "success";
  message: string;
  data: {
    items: IStoreProduct[];
    pagination: IStorePagination;
  };
}

export interface GetStoreCategoryProductsArgs {
  slug: string;
  categoryId: string;
  page?: number;
  limit?: number;
  q?: string;
}

// Reuse IStoreProduct since the shape matches
export type IStoreCategoryProduct = IStoreProduct;

export interface IGetStoreCategoryProductsResponse {
  status: string;
  message: string;
  data: {
    items: IStoreCategoryProduct[];
    pagination: IStorePagination;
  };
}

/* ───────── TEMPLATES & THEMES ───────── */

export interface ThemeConfig {
  header_style?: string;
  primary_color?: string;
  font_family?: string;
  layout_style?: string;
  dark_mode_default?: boolean;
}

export interface ITemplate {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  default_config: ThemeConfig;
  preview_url: string | null;
  is_active: boolean;
}

export interface IStoreTheme {
  id: string;
  store_id: string;
  template_id: string;
  custom_config: ThemeConfig | null;
  template: ITemplate;
}

/* ───────── ANALYTICS ───────── */

export interface IStoreDeliveryRate {
  id: string;
  store_id: string;
  state: string;
  location: string;
  fee: number;
  duration: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface IStoreAnalytics {
  summary: {
    total_sales: number;
    orders: number;
    total_products: number;
    customers: number;
    out_of_stock_count: number;
    pending_orders_count: number;
    conversion_rate: number;
    account_status?: "active" | "pending" | "restricted" | "banned";
    store_status?: "active" | "pending" | "restricted" | "banned";
    payout_verified?: boolean;
  };
  trends: {
    monthly: {
      year: number;
      month: number;
      revenue: number;
      orders: number;
    }[];
  };
  top_products: {
    product_id: string;
    name: string;
    slug: string;
    image: string | null;
    total_sold: number;
    total_revenue: number;
  }[];
  customers: {
    id: string;
    name: string;
    email: string;
    location: string | null;
    spent: number;
    orders: number;
  }[];
}
