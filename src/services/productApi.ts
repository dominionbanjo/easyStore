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
  VendorProductSearchResponse,
  VendorProductSearchParams,
  ProductStatus,
} from "@/types/product/productTypes";

import { apiManager } from "./apiManager";
type ProductDeliveryRate = {
  id: string;
  product_id: string;
  country: string;
  state?: string | null;
  city?: string | null;
  price: number;
  estimated_days?: number | null;
};

type ApiResponse<T> = {
  message: string;
  data: T;
};

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

    /* ───────── MY STORE ───────── */
    getMyStoreProducts: builder.query<
      IStoreProductsResponse,
      VendorProductSearchParams
    >({
      query: (params) => ({
        url: "vendor/products",
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

    /* ───────── SINGLE PRODUCT ───────── */
    getSingleProduct: builder.query<GetSingleProductResponse, string>({
      query: (slug) => ({
        url: `product/${slug}`,
        method: "GET",
      }),
      providesTags: (result) => {
        const id = result?.data?.product?.id;
        return id
          ? [{ type: "Product", id }]
          : [{ type: "Product", id: "SINGLE" }];
      },
    }),

    /* ───────── CREATE ───────── */
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

    /* ───────── UPDATE ───────── */
    updateProduct: builder.mutation<any, UpdateProductArgs>({
      query: ({ id, data }) => ({
        url: `product/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Store"],
    }),

    /* ───────── DELETE ───────── */
    deleteProduct: builder.mutation<any, string>({
      query: (id) => ({
        url: `vendor/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Store"],
    }),

    /* ───────── CLOUDINARY CREATE ───────── */
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
    /* ───────── CLOUDINARY UPDATE ───────── */
    updateProductWithCloudinary: builder.mutation<
      { status: string; data: any },
      { id: string; data: CreateProductCloudinaryArgs }
    >({
      query: ({ id, data }) => ({
        url: `vendor/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_unused, __unused, { id }) => [
        { type: "Product", id },
        "Store",
      ],
    }),

    /* ───────── VENDOR SEARCH (FIXED) ───────── */
    searchMyStoreProducts: builder.query<
      IStoreProductsResponse,
      VendorProductSearchParams
    >({
      query: (params) => ({
        url: "vendor/products/store/me/search",
        method: "GET",
        params,
      }),

      transformResponse: (
        response: VendorProductSearchResponse,
      ): IStoreProductsResponse => ({
        status: response.status,
        message: response.message,
        data: {
          pagination: response.data.pagination,
          items: response.data.items.map((item) => ({
            ...item,
            // 🔧 ensure number conversion if API sends strings
            price: Number(item.price),
            discount_price: item.discount_price
              ? Number(item.discount_price)
              : null,
            rating_average: Number(item.rating_average),
            shipping_cost: Number(item.shipping_cost),

            // 🔧 normalize mismatched fields
            specs: item.specs as Record<string, any> | null,
            colors: item.colors as string[] | null,
            sizes: item.sizes as string[] | null,

            highlights: item.highlights ?? null,
          })),
        },
      }),

      providesTags: ["Product"],
    }),

    /* ───────── UPDATE STATUS ───────── */
    updateProductStatus: builder.mutation<
      { status: string; data: any },
      { id: string; status: ProductStatus }
    >({
      query: ({ id, status }) => ({
        url: `vendor/products/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_unused, __unused, { id }) => [
        { type: "Product", id },
        "Store",
      ],
    }),

    /* ───────── UPDATE ON SALE ───────── */
    updateProductOnSale: builder.mutation<
      { status: string; data: any },
      { id: string; on_sale: boolean }
    >({
      query: ({ id, on_sale }) => ({
        url: `vendor/products/${id}/on-sale`,
        method: "PATCH",
        body: { on_sale },
      }),
      invalidatesTags: (_unused, __unused, { id }) => [
        { type: "Product", id },
        "Store",
      ],
    }),

    getProductDeliveryRates: builder.query<
      ApiResponse<ProductDeliveryRate[]>,
      string
    >({
      query: (productId) => `product-delivery-rates/product/${productId}`,
      providesTags: (result, _error, productId) =>
        result?.data
          ? [
              ...result.data.map((rate) => ({
                type: "Product" as const,
                id: rate.id,
              })),
              { type: "Product", id: productId },
            ]
          : [{ type: "Product", id: productId }],
    }),

    createProductDeliveryRate: builder.mutation<
      ApiResponse<ProductDeliveryRate>,
      {
        productId: string;
        data: {
          country: string;
          state?: string | null;
          city?: string | null;
          price: number;
          estimated_days?: number | null;
        };
      }
    >({
      query: ({ productId, data }) => ({
        url: `product-delivery-rates/product/${productId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_res, _err, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),

    updateProductDeliveryRate: builder.mutation<
      ApiResponse<ProductDeliveryRate>,
      {
        rateId: string;
        data: Partial<{
          country: string;
          state?: string | null;
          city?: string | null;
          price: number;
          estimated_days?: number | null;
        }>;
      }
    >({
      query: ({ rateId, data }) => ({
        url: `product-delivery-rates/${rateId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_res, _err, { rateId }) => [
        { type: "Product", id: rateId },
      ],
    }),

    deleteProductDeliveryRate: builder.mutation<
      ApiResponse<{ success: boolean }>,
      { rateId: string; productId: string }
    >({
      query: ({ rateId }) => ({
        url: `product-delivery-rates/${rateId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, { productId }) => [
        { type: "Product", id: productId },
      ],
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
  useGetMyStoreProductsQuery,
  useSearchProductsQuery,
  useGetSingleProductQuery,

  useCreateProductMutation,
  useCreateManyProductsMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,

  useCreateProductWithCloudinaryMutation,
  useUpdateProductWithCloudinaryMutation,

  useSearchMyStoreProductsQuery,

  useUpdateProductStatusMutation,
  useUpdateProductOnSaleMutation,

  /* ───────── DELIVERY RATES ───────── */
  useGetProductDeliveryRatesQuery,
  useCreateProductDeliveryRateMutation,
  useUpdateProductDeliveryRateMutation,
  useDeleteProductDeliveryRateMutation,
} = productApi;
