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
  store_name: string;
  slug: string;
  category: string | null;
  description: string | null;
  logo: string | null;
  cover_image: string | null;
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
  bank_code: string | null;
  account_number: string | null;
  bank_name: string | null;
  recipient_code: string | null;
  payout_verified: boolean;
  user?: {
    first_name: string;
    last_name: string;
    username: string;
    avatar: string | null;
  };
  created_at: string;
}

export interface IStoreCategory {
  id: string;
  name: string;
  slug: string;
}

export interface IStoreDetailsResponse {
  status: "success" | "error";
  message: string;
  data: {
    store: IStoreDetails;
    products: {
      data: IStoreProduct[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
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
  image: string;
  rating_average: number;
  stock: number;
  is_in_wishlist?: boolean;
  colors?: { id: string; name: string; hex: string }[];
  sizes?: string[];
  category?: string;
  store_name?: string;
  created_at?: string;
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
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface GetStoreCategoryProductsArgs {
  slug: string;
  categoryId: string;
  page?: number;
  limit?: number;
}

// Reuse IStoreProduct since the shape matches
export type IStoreCategoryProduct = IStoreProduct;

export interface IGetStoreCategoryProductsResponse {
  status: string;
  message: string;
  data: {
    items: IStoreCategoryProduct[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}
