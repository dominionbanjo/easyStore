import type {
  IRecommendationResponse,
  IUserPreferencesResponse,
  RecommendationQueryArgs,
  SavePreferencesArgs,
} from "@/types/recommendation/recommendationTypes";

import { apiManager } from "./apiManager";

export const recommendationApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    /* ───────── FOR YOU (PERSONALIZED) ───────── */
    getForYouRecommendations: builder.query<
      IRecommendationResponse,
      RecommendationQueryArgs
    >({
      query: (params) => ({
        url: "recommendations/for-you",
        method: "GET",
        params,
      }),
    }),

    /* ───────── TRENDING (FALLBACK RAIL) ───────── */
    getTrendingRecommendations: builder.query<
      IRecommendationResponse,
      RecommendationQueryArgs
    >({
      query: (params) => ({
        url: "recommendations/trending",
        method: "GET",
        params,
      }),
    }),

    /* ───────── DEALS OF THE DAY ───────── */
    getDealRecommendations: builder.query<
      IRecommendationResponse,
      RecommendationQueryArgs
    >({
      query: (params) => ({
        url: "recommendations/deals",
        method: "GET",
        params,
      }),
    }),

    /* ───────── USER PREFERENCES ───────── */
    getUserPreferences: builder.query<IUserPreferencesResponse, void>({
      query: () => ({
        url: "recommendations/preferences",
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    saveUserPreferences: builder.mutation<
      { success: boolean; message?: string },
      SavePreferencesArgs
    >({
      query: (body) => ({
        url: "recommendations/preferences",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

/* ───────────────── HOOK EXPORTS ───────────────── */

export const {
  useGetForYouRecommendationsQuery,
  useGetTrendingRecommendationsQuery,
  useGetDealRecommendationsQuery,
  useGetUserPreferencesQuery,
  useSaveUserPreferencesMutation,
} = recommendationApi;
