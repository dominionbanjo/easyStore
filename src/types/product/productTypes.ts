export interface IProductImage {
  url: string;
  public_id: string;
}

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discount_price?: number | null;
  stock: number;
  rating_average?: number;
  created_at?: string;

  image?: string | IProductImage | null;
  gallery?: IProductImage[] | null;

  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;

  store_name?: string;
}

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

export interface IFeaturedProductsResponse {
  status: string;
  message: string;
  data: IProduct[];
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
  identifier: string; // id or slug
}

export interface ProductsByStoreArgs extends PaginationArgs {
  storeId: string;
}

/* ───────────────── MUTATION ARGS ───────────────── */

export interface CreateProductArgs {
  data: FormData;
}

export interface UpdateProductArgs {
  id: string;
  data: Partial<Record<string, any>>; // JSON update
}

export interface IGroupedCategory {
  id: string;
  name: string;
  slug: string;
  products: IProduct[];
}

export interface IProductsGroupedByCategoryResponse {
  status: string;
  message: string;
  data: IGroupedCategory[];
}
