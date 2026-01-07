import type {
  PaginationArgs,
  IFeaturedProductsResponse,
  IPaginatedResponse,
  IProduct,
  ProductsByCategoryArgs,
  ProductsByStoreArgs,
  SearchProductsArgs,
  CreateProductArgs,
  UpdateProductArgs,
  IProductsGroupedByCategoryResponse,
} from "@/types/product/productTypes";
import { apiManager } from "./apiManager";

/* ───────────────── TYPES ───────────────── */

/* ───────────────── API ───────────────── */

export const productApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    /* ───────── LISTING ───────── */

    getProductsGroupedByCategory: builder.query<
      IProductsGroupedByCategoryResponse,
      PaginationArgs
    >({
      query: (params) => ({
        url: "product/by-category",
        method: "GET",
        params,
      }),
    }),

    getFeaturedProducts: builder.query<
      IFeaturedProductsResponse,
      PaginationArgs
    >({
      query: (params) => ({
        url: "product/featured",
        method: "GET",
        params,
      }),
    }),

    getAllProducts: builder.query<IPaginatedResponse<IProduct>, PaginationArgs>(
      {
        query: (params) => ({
          url: "product",
          method: "GET",
          params,
        }),
      }
    ),

    getProductsByCategory: builder.query<
      IPaginatedResponse<IProduct>,
      ProductsByCategoryArgs
    >({
      query: ({ identifier, ...params }) => ({
        url: `product/category/${identifier}`,
        method: "GET",
        params,
      }),
    }),

    getProductsByStore: builder.query<
      IPaginatedResponse<IProduct>,
      ProductsByStoreArgs
    >({
      query: ({ storeId, ...params }) => ({
        url: `product/store/${storeId}`,
        method: "GET",
        params,
      }),
    }),

    searchProducts: builder.query<
      IPaginatedResponse<IProduct>,
      SearchProductsArgs
    >({
      query: ({ q, ...params }) => ({
        url: "product/search",
        method: "GET",
        params: { q, ...params },
      }),
    }),

    getSingleProduct: builder.query<
      { message: string; product: IProduct },
      string
    >({
      query: (identifier) => ({
        url: `product/${identifier}`,
        method: "GET",
      }),
    }),

    /* ───────── MUTATIONS ───────── */

    createProduct: builder.mutation<any, CreateProductArgs>({
      query: ({ data }) => ({
        url: "product",
        method: "POST",
        body: data, // FormData
      }),
      invalidatesTags: ["Store"],
    }),

    createManyProducts: builder.mutation<
      any,
      { products: Record<string, any>[] }
    >({
      query: (body) => ({
        url: "product/bulk",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Store"],
    }),

    updateProduct: builder.mutation<any, UpdateProductArgs>({
      query: ({ id, data }) => ({
        url: `product/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Store"],
    }),

    deleteProduct: builder.mutation<any, string>({
      query: (id) => ({
        url: `product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Store"],
    }),
  }),
});

/* ───────────────── HOOK EXPORTS ───────────────── */

export const {
  useGetProductsGroupedByCategoryQuery,
  useGetFeaturedProductsQuery,
  useGetAllProductsQuery,
  useGetProductsByCategoryQuery,
  useGetProductsByStoreQuery,
  useSearchProductsQuery,
  useGetSingleProductQuery,
  useCreateProductMutation,
  useCreateManyProductsMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
