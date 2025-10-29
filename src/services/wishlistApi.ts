import { apiManager } from "./apiManager";

// 🧩 Wishlist Item Interface
export interface IWishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product_type?: string;
  name: string;
  image?: string;
  price: number;
  currency?: string;
  stock?: number;
  added_at?: string;
}

// 🧾 API Response Interface
export interface IWishlistResponse {
  status: number;
  success: boolean;
  message: string;
  wishlist?: IWishlistItem | null;
}

// ⚙️ Wishlist API
export const wishlistApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    /** 🧭 GET: Retrieve the user's wishlist (only one allowed) */
    getWishlist: builder.query<IWishlistResponse, void>({
      query: () => ({
        url: "/api/v1/wishlist",
        method: "GET",
      }),
      providesTags: ["Wishlist"],
    }),

    /** ➕ POST: Add a new product to the wishlist (replaces existing one) */
    addToWishlist: builder.mutation<IWishlistResponse, Partial<IWishlistItem>>({
      query: (body) => ({
        url: "/api/v1/wishlist",
        method: "POST",
        body,
      }),
      // ensures fresh wishlist after add
      invalidatesTags: ["Wishlist"],
    }),

    /** ❌ DELETE: Remove a product from wishlist by product_id */
    removeFromWishlist: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (productId) => ({
        url: `/api/v1/wishlist/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    /** 🗑️ DELETE: Clear entire wishlist (rarely used, but supported) */
    clearWishlist: builder.mutation<
      { success: boolean; message: string },
      void
    >({
      query: () => ({
        url: "/api/v1/wishlist",
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

// 🧩 Export RTK Query Hooks
export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
} = wishlistApi;
