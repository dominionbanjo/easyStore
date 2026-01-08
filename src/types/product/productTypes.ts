/* ───────────────── IMAGE ───────────────── */
export interface IProductImage {
  url: string;
  public_id: string;
}

/* ───────────────── CATEGORY ───────────────── */
export interface IProductCategoryRef {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

/* ───────────────── BASE PRODUCT (LIST / CARD / RELATED) ───────────────── */
export interface IProduct {
  id: string;
  name: string;
  slug: string;

  price: number;
  discount_price?: number | null;

  rating_average?: number;
  stock: number;

  image?: string | IProductImage | null;

  /* legacy / list usage */
  store_name?: string;
  is_in_wishlist: boolean;
}

/* ───────────────── FULL PRODUCT (DETAIL PAGE) ───────────────── */
export interface IProductDetails extends IProduct {
  vendor_id?: string;
  store_id?: string;
  category_id?: string;

  category_ref?: IProductCategoryRef;

  description?: string;

  tags?: string[];

  gallery?: IProductImage[] | null;

  highlights?: string[] | null;
  specs?: Record<string, string> | null;

  colors?: string[];
  sizes?: string[];

  shipping_note?: string | null;
  returns_note?: string | null;
  location?: string | null;
  shipping_cost?: number | null;

  rating_count?: number;
  review_count?: number;
  total_sold?: number;

  featured?: boolean;

  created_at?: string;
  updated_at?: string;
}

/* ───────────────── STORE (SINGLE PRODUCT) ───────────────── */
export interface IProductStore {
  id: string;
  store_name: string;
  slug: string;
  rating_average: string;
  rating_count: number;
  logo: string | null;
}

/* ───────────────── REVIEW ───────────────── */
export interface IProductReview {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
  };
}

/* ───────────────── GROUPED CATEGORY (BY CATEGORY) ───────────────── */
export interface IGroupedCategory {
  id: string;
  name: string;
  slug: string;
  products: IProduct[];
}

/* ───────────────── RESPONSES ───────────────── */

/* 🔹 SINGLE PRODUCT */
export interface GetSingleProductResponse {
  status: "success" | "error";
  message: string;
  data: {
    product: IProductDetails;
    store: IProductStore;
    reviews: IProductReview[];
    related_products: IProduct[];
  };
}

/* 🔹 PAGINATED LIST */
export interface IPaginatedResponse<T> {
  message: string;
  data: {
    items: T[];
    meta: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

/* 🔹 FEATURED PRODUCTS */
export interface IFeaturedProductsResponse {
  status: string;
  message: string;
  data: IProduct[];
}

/* 🔹 PRODUCTS GROUPED BY CATEGORY */
export interface IProductsGroupedByCategoryResponse {
  status: string;
  message: string;
  data: IGroupedCategory[];
}

/* ───────────────── QUERY ARGS ───────────────── */
export interface PaginationArgs {
  page?: number;
  limit?: number;
}

export interface SearchProductsArgs extends PaginationArgs {
  q: string;
}

export interface ProductsByCategoryArgs extends PaginationArgs {
  identifier: string; // slug or id
}

export interface ProductsByStoreArgs extends PaginationArgs {
  storeId: string;
}

/* ───────────────── MUTATIONS ───────────────── */
export interface CreateProductArgs {
  data: FormData;
}

export interface UpdateProductArgs {
  id: string;
  data: Partial<Record<string, any>>;
}
