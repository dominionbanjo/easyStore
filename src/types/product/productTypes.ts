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

  colors?: {
    id: string;
    name: string;
    hex: string;
  }[];
  sizes?: string[];

  shipping_note?: string | null;
  returns_note?: string | null;

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
  address_city?: string | null;
  address_state?: string | null;
  address_country?: string | null;
  address_postal_code?: string | null;
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

// /* 🔹 PAGINATED LIST */
// export interface IPaginatedResponse<T> {
//   message: string;
//   data: {
//     items: T[];
//     meta: {
//       total: number;
//       page: number;
//       limit: number;
//       pages: number;
//     };
//   };
// }

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
  q?: string;
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

/* ───────────────── SEARCH PAGINATION ───────────────── */
export interface IPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/* ───────────────── SEARCH RESPONSE ───────────────── */
export interface ISearchProductsResponse {
  status: "success" | "error";
  message: string;
  data: {
    items: IProduct[];
    pagination: IPagination;
  };
}

/* ───────────────── PAGINATION ───────────────── */
export interface IPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/* ───────────────── PAGINATED RESPONSE ───────────────── */
export interface IPaginatedResponse<T> {
  status: "success" | "error";
  message: string;
  data: {
    items: T[];
    pagination: IPagination;
  };
}

/* ───────────────── STORE PRODUCT (STORE LIST RESPONSE) ───────────────── */
export interface IStoreProduct {
  id: string;
  vendor_id: string;
  store_id: string;
  category_id: string;

  name: string;
  slug: string;
  description: string;

  price: number;
  discount_price: number | null;

  stock: number;
  tags: string[];

  image: IProductImage | null;
  gallery: IProductImage[];

  highlights: string[] | null;
  specs: Record<string, any> | null;

  colors: string[] | null;
  sizes: string[] | null;

  shipping_note: string | null;
  returns_note: string | null;
  status?: "active" | "inactive";

  shipping_cost: number;

  rating_average: number;
  rating_count: number;
  review_count: number;

  total_sold: number;
  featured: boolean;
  on_sale: boolean;

  category_ref: IProductCategoryRef;
  store_name?: string;

  created_at: string;
  updated_at: string;
}

/* ───────────────── STORE PRODUCTS RESPONSE ───────────────── */
export interface IStoreProductsResponse {
  status: "success" | "error";
  message: string;
  data: {
    items: IStoreProduct[];
    pagination: IPagination;
  };
}

// types/product/createProductCloudinary.ts

export type CloudinaryAsset = {
  url: string;
  public_id: string;
};

export type CreateProductCloudinaryArgs = {
  /* ───────── REQUIRED CORE ───────── */
  category_id: string;
  name: string;
  price: number;
  stock: number;

  /* ───────── OPTIONAL DETAILS ───────── */
  description?: string;
  discount_price?: number;

  /* ───────── PRODUCT META ───────── */
  tags?: string[];
  highlights?: string[];
  sizes?: string[];
  colors?: string[]; // color IDs only

  /* ───────── SPECIFICATIONS ───────── */
  specs?: Record<string, string>;

  /* ───────── SHIPPING ───────── */
  shipping_cost?: number;
  shipping_note?: string;
  returns_note?: string;
  /* ───────── MEDIA ───────── */
  image?: CloudinaryAsset | null;
  gallery?: CloudinaryAsset[];
};

export interface VendorProductSearchParams {
  q?: string;
  page?: number;
  limit?: number;

  minPrice?: number;
  maxPrice?: number;

  rating?: number;
  inStock?: boolean | string;
  onSale?: boolean | string;
  status?: string;

  colors?: string[];
  sizes?: string[];
}

/* ───────────────── BASE UI PRODUCT ───────────────── */
export interface IBaseProduct {
  id: string;
  name: string;
  slug: string;

  price: number;
  discount_price?: number | null;

  rating_average?: number;
  stock: number;

  image?: string | IProductImage | null;
  is_in_wishlist?: boolean;
}

export interface ProductImage {
  url: string;
  public_id: string;
}

export interface ProductCategoryRef {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}
export interface VendorProductSearchItem {
  id: string;
  vendor_id: string;
  store_id: string;
  category_id: string;

  name: string;
  slug: string;
  description: string;

  price: string;
  discount_price: string | null;

  stock: number;
  tags: string[];

  image: ProductImage | null;
  gallery: ProductImage[];

  highlights: string[];
  specs: Record<string, any> | null;
  colors: unknown | null;
  sizes: unknown | null;

  shipping_note: string | null;
  returns_note: string | null;

  status: "active" | "inactive";
  shipping_cost: string;
  rating_average: string;
  rating_count: number;
  review_count: number;
  total_sold: number;

  featured: boolean;
  on_sale: boolean;

  created_at: string;
  updated_at: string;

  /** new */
  category_ref: ProductCategoryRef;
}

export type ProductStatus = "active" | "inactive";

export interface VendorProductSearchResponse {
  status: "success";
  message: string;
  data: {
    items: VendorProductSearchItem[];
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
