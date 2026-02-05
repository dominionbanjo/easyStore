import type {
  GetWishlistResponse,
  IWishlistItem,
  AddToWishlistArgs,
  RemoveFromWishlistArgs,
} from "@/types/wishlist/wishlistType";
import { apiManager } from "./apiManager";

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
      invalidatesTags: ["Wishlist", "Product"],
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
      invalidatesTags: ["Wishlist", "Product"],
    }),

    /* ───────── CLEAR WISHLIST ───────── */
    clearWishlist: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "wishlist",
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    /* ───────── MOVE ALL TO CART ───────── */
    moveAllToCart: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "wishlist/move-to-cart",
        method: "POST",
      }),
      invalidatesTags: ["Wishlist", "Cart"],
    }),
  }),
});

/* ───────────────── HOOK EXPORTS ───────────────── */

export const {
  useGetMyWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
  useMoveAllToCartMutation,
} = wishlistApi;
