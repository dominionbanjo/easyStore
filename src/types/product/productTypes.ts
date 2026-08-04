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
  store_slug?: string;
  is_in_wishlist: boolean;

  options?: { name: string; values: string[] }[] | null;
  variants?:
    | {
        id: string;
        sku?: string;
        combinations?: Record<string, string>;
        size?: string;
        price: number;
        stock: number;
        discount_price?: number;
        image_url?: string | null;
      }[]
    | null;

  /* legacy */
  colors?: {
    id: string;
    name: string;
    hex: string;
  }[];
  sizes?: string[];

  category?: string;
  on_sale?: boolean;
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

  options?: { name: string; values: string[] }[] | null;

  /* legacy */
  colors?: {
    id: string;
    name: string;
    hex: string;
  }[];
  sizes?: string[];

  shipping_note?: string | null;
  returns_note?: string | null;

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
  data: {
    items: IProduct[];
    pagination: IPagination;
  };
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
  sort?: string;
  state?: string;
  local?: boolean;
}

export interface SearchProductsArgs extends PaginationArgs {
  q: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  filter?: string;
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
  data: Partial<CreateProductCloudinaryArgs>;
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
    /** Aggregated variant combination options across all results.
     *  Keys are combination attribute names (e.g. "Color", "Size"),
     *  values are the sorted unique values found in the result set.
     *  Used to dynamically populate sidebar filter chips. */
    filters: Record<string, string[]>;
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
  specs: Record<string, string> | null;

  options: { name: string; values: string[] }[] | null;
  variants:
    | {
        sku?: string;
        combinations?: Record<string, string>;
        size?: string;
        price: number;
        stock: number;
        discount_price?: number;
      }[]
    | null;

  /* legacy */
  colors?: string[] | null;
  sizes?: string[] | null;

  shipping_note: string | null;
  returns_note: string | null;
  status?: "active" | "inactive" | "draft";

  rating_average: number;
  rating_count: number;
  review_count: number;

  total_sold: number;
  featured: boolean;
  on_sale: boolean;
  is_out_of_stock: boolean;

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

/* ───────────────── PRODUCT DRAFTS ───────────────── */
export type SaveProductDraftArgs = Partial<CreateProductCloudinaryArgs> & {
  id?: string;
};

export interface IProductDraft {
  id: string;
  vendor_id?: string;
  store_id?: string;
  category_id?: string | null;

  name?: string | null;
  slug?: string | null;
  description?: string | null;

  price?: number | null;
  discount_price?: number | null;

  stock?: number | null;
  tags?: string[] | null;
  image?: IProductImage | null;
  gallery?: IProductImage[] | null;

  highlights?: string[] | null;
  specs?: Record<string, string> | null;

  options?: { name: string; values: string[] }[] | null;
  variants?: unknown[] | null;

  shipping_note?: string | null;
  returns_note?: string | null;

  status?: "draft";
  updated_at?: string;
  created_at?: string;
}

export interface IProductDraftsResponse {
  message: string;
  data: {
    drafts: IProductDraft[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
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
  price?: number | null;
  stock?: number | null;

  /* ───────── OPTIONAL DETAILS ───────── */
  description?: string | null;
  discount_price?: number | null;
  barcode?: string | null;

  /* ───────── PRODUCT META ───────── */
  tags?: string[];
  highlights?: string[];
  options?: { name: string; values: string[] }[] | null;
  variants?: {
    sku?: string;
    combinations?: Record<string, string>;
    size?: string;
    price: number;
    stock: number;
    discount_price?: number | null;
  }[];

  /* legacy */
  sizes?: string[];
  colors?: string[];

  /* ───────── SPECIFICATIONS ───────── */
  specs?: Record<string, string> | null;

  /* ───────── SHIPPING ───────── */
  shipping_note?: string | null;
  returns_note?: string | null;
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
  isOutOfStock?: boolean | string;
  onSale?: boolean | string;
  status?: string;
  filter?: string;
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
  specs: Record<string, string> | null;
  options: { name: string; values: string[] }[] | null;
  variants:
    | {
        sku?: string;
        combinations?: Record<string, string>;
        size?: string;
        price: number;
        stock: number;
        discount_price?: number;
      }[]
    | null;

  /* legacy */
  colors?: unknown | null;
  sizes?: unknown | null;

  shipping_note: string | null;
  returns_note: string | null;

  status: "active" | "inactive" | "draft";
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

export type ProductStatus = "active" | "inactive" | "draft";

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
