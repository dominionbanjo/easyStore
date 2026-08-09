import type { IProduct, IPagination } from "@/types/product/productTypes";

/* ───────────────── RECOMMENDATION RAILS ───────────────── */
export interface IRecommendationResponse {
  status?: string;
  message: string;
  data: {
    items: IProduct[];
    pagination: IPagination;
    /** true when the rail was built from the user's signals (for-you only) */
    personalized: boolean;
  };
}

/* ───────────────── PREFERENCES ───────────────── */
export interface IUserPreferencesResponse {
  status?: string;
  message: string;
  data: {
    category_ids: string[];
  };
}

/* ───────────────── QUERY ARGS ───────────────── */
export interface RecommendationQueryArgs {
  page?: number;
  limit?: number;
  state?: string;
  local?: boolean;
}

export interface SavePreferencesArgs {
  category_ids: string[];
}
