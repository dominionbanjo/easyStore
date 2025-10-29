import { apiManager } from "./apiManager";

export interface ICartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}
export interface ICartResponse {
  status: number;
  success: boolean;
  message: string;
  cartItems: ICartItem[];
}

export const cartApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    // 🧾 Fetch all cart items
    getCart: builder.query<ICartResponse, void>({
      query: () => ({
        url: "/api/v1/cart",
        method: "GET",
      }),

      // 👇 Generate tags for every item & list
      providesTags: (result) =>
        result
          ? [
              ...result.cartItems.map(({ id }) => ({
                type: "Cart" as const,
                id,
              })),
              { type: "Cart", id: "LIST" },
            ]
          : [{ type: "Cart", id: "LIST" }],
    }),

    // ➕ Add new item(s)
    addToCart: builder.mutation<ICartResponse, ICartItem[]>({
      query: (body) => ({
        url: "/api/v1/cart",
        method: "POST",
        body,
      }),
      // New item added → refresh full cart list
      invalidatesTags: [{ type: "Cart", id: "LIST" }],
    }),

    // 🔄 Update a specific cart item
    updateCartItem: builder.mutation<
      ICartResponse,
      { id: string; quantity: number }
    >({
      query: ({ id, quantity }) => ({
        url: `/api/v1/cart/${id}`,
        method: "PATCH",
        body: { quantity },
      }),
      // Invalidate only that specific item
      invalidatesTags: (_result, _error, { id }) => [{ type: "Cart", id }],
    }),

    // 🗑️ Remove a specific item from cart
    removeCartItem: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/api/v1/cart/${id}`,
        method: "DELETE",
      }),
      // Invalidate only that item
      invalidatesTags: (_result, _error, id) => [{ type: "Cart", id }],
    }),

    // ❌ Clear entire cart
    clearCart: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/api/v1/cart",
        method: "DELETE",
      }),
      // Invalidate everything
      invalidatesTags: [{ type: "Cart", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi;
