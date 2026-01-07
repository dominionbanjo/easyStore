import { apiManager } from "./apiManager";

/* ───────────────── TYPES ───────────────── */

export interface IWishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  name: string;
  image?: string | null;
  price: number;
  created_at: string;
}

/* ───────────────── RESPONSES ───────────────── */

export interface GetWishlistResponse {
  message: string;
  wishlist: IWishlistItem[];
}

/* ───────────────── DTO ARGS ───────────────── */

export interface AddToWishlistArgs {
  product_id: string;
  name: string;
  image?: string | null;
  price: number;
}

export interface RemoveFromWishlistArgs {
  productId: string;
}

/* ───────────────── API ───────────────── */

export const wishlistApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    /* ───────── GET MY WISHLIST ───────── */

    getMyWishlist: builder.query<GetWishlistResponse, void>({
      query: () => ({
        url: "wishlist",
        method: "GET",
      }),
      providesTags: ["Wishlist"],
    }),

    /* ───────── ADD TO WISHLIST ───────── */

    addToWishlist: builder.mutation<
      { message: string; wishlist: IWishlistItem },
      AddToWishlistArgs
    >({
      query: (body) => ({
        url: "wishlist",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wishlist"],
    }),

    /* ───────── REMOVE FROM WISHLIST ───────── */

    removeFromWishlist: builder.mutation<
      { message: string },
      RemoveFromWishlistArgs
    >({
      query: ({ productId }) => ({
        url: `wishlist/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    /* ───────── CLEAR WISHLIST ───────── */

    clearWishlist: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "wishlist",
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

/* ───────────────── HOOK EXPORTS ───────────────── */

export const {
  useGetMyWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
} = wishlistApi;
