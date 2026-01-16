import { apiManager } from "./apiManager";

/* ───────────────── TYPES ───────────────── */

export interface IProductReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment?: string | null;
  created_at: string;
  updated_at?: string;
}

/* ───────────────── DTO ARGS ───────────────── */

export interface CreateProductReviewArgs {
  productId: string;
  rating: number;
  comment?: string;
}

export interface DeleteProductReviewArgs {
  productId: string;
  reviewId: string;
}

/* ───────────────── API ───────────────── */

export const productReviewApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    /* ───────── ADD REVIEW (AUTH) ───────── */

    addProductReview: builder.mutation<IProductReview, CreateProductReviewArgs>(
      {
        query: ({ productId, ...body }) => ({
          url: `products/${productId}/reviews`,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Product"],
      }
    ),

    /* ───────── GET REVIEWS (PUBLIC) ───────── */

    getProductReviews: builder.query<IProductReview[], string>({
      query: (productId) => ({
        url: `products/${productId}/reviews`,
        method: "GET",
      }),
      providesTags: (_r, _e, productId) => [{ type: "Product", id: productId }],
    }),

    /* ───────── DELETE REVIEW (OWNER) ───────── */

    deleteProductReview: builder.mutation<
      { success: boolean; message: string },
      DeleteProductReviewArgs
    >({
      query: ({ productId, reviewId }) => ({
        url: `products/${productId}/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

/* ───────────────── HOOK EXPORTS ───────────────── */

export const {
  useAddProductReviewMutation,
  useGetProductReviewsQuery,
  useDeleteProductReviewMutation,
} = productReviewApi;
