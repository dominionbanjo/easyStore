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
}

/* ───────────────── SEARCH STORES ───────────────── */

export interface SearchStoresArgs {
  q: string;
  page?: number;
  limit?: number;
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
  website: string | null;
  rating_average: string;
  rating_count: number;
  total_products: number;
  address: string | null;
  created_at: string;
}

export interface IStoreProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  rating_average: number;
  stock: number;
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
  image: string;
  rating_average: number;
  stock: number;
}

/* ───────── GET STORE PRODUCTS ARGS ───────── */

export interface GetStoreProductsArgs {
  slug: string;
  page?: number;
  limit?: number;
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

export interface IStoreCategoryProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  rating_average: number;
  stock: number;
}

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
