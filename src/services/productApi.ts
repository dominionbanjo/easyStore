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
  GetSingleProductResponse,
  ISearchProductsResponse,
  IStoreProductsResponse,
  CreateProductCloudinaryArgs,
} from "@/types/product/productTypes";
import { apiManager } from "./apiManager";

/* ───────────────── API ───────────────── */

export const productApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    /* ───────── GROUPED BY CATEGORY ───────── */
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

    /* ───────── FEATURED ───────── */
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
    /* ───────── ALL PRODUCTS ───────── */
    getAllProducts: builder.query<IPaginatedResponse<IProduct>, PaginationArgs>(
      {
        query: (params) => ({
          url: "product",
          method: "GET",
          params,
        }),
      },
    ),

    /* ───────── BY CATEGORY ───────── */
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

    /* ───────── BY STORE ───────── */
    getProductsByStore: builder.query<
      IStoreProductsResponse,
      ProductsByStoreArgs
    >({
      query: ({ storeId, ...params }) => ({
        url: `product/store/${storeId}`,
        method: "GET",
        params,
      }),
    }),

    /* ───────── MY STORE (AUTH USER) ───────── */
    getMyStoreProducts: builder.query<IStoreProductsResponse, PaginationArgs>({
      query: (params) => ({
        url: "product/store/me",
        method: "GET",
        params,
      }),
      providesTags: ["Store"],
    }),

    /* ───────── SEARCH ───────── */
    searchProducts: builder.query<ISearchProductsResponse, SearchProductsArgs>({
      query: ({ q, ...params }) => ({
        url: "product/search",
        method: "GET",
        params: { q, ...params },
      }),
    }),

    /* ───────── SINGLE PRODUCT (FIXED) ───────── */
    getSingleProduct: builder.query<GetSingleProductResponse, string>({
      query: (slug) => ({
        url: `product/${slug}`,
        method: "GET",
      }),

      providesTags: (result) => {
        const productId = result?.data?.product?.id;

        return productId
          ? [
              { type: "Product", id: productId },
              { type: "Product", id: "SINGLE" }, // ✅ fallback
            ]
          : [{ type: "Product", id: "SINGLE" }];
      },
    }),

    /* ───────── MUTATIONS ───────── */
    createProduct: builder.mutation<any, CreateProductArgs>({
      query: ({ data }) => ({
        url: "product",
        method: "POST",
        body: data,
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

    /* ───────── VENDOR: CREATE PRODUCT (CLOUDINARY) ───────── */
    createProductWithCloudinary: builder.mutation<
      { status: string; data: any },
      CreateProductCloudinaryArgs
    >({
      query: (data) => ({
        url: "vendor/products",
        method: "POST",
        body: data,
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
  useGetMyStoreProductsQuery,
  useCreateProductWithCloudinaryMutation,
} = productApi;
