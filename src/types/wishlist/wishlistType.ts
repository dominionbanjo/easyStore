/* ───────────────── RESPONSES ───────────────── */

/* ───────────────── TYPES ───────────────── */

import type { IProduct } from "../product/productTypes";

export interface IWishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  name: string;
  image?: string | null;
  price: string;
  created_at: string;
  product?: IProduct;
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

export interface GetWishlistResponse {
  status: "success" | "error";
  message: string;
  data: {
    wishlist: IWishlistItem[];
  };
}
