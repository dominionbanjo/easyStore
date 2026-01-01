import type { ICheckStoreNameResponse } from "@/types/Store/storeTypes";
import { apiManager } from "./apiManager";

export const storeApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    /* ───────── CHECK STORE NAME AVAILABILITY ───────── */
    checkStoreName: builder.query<ICheckStoreNameResponse, { name: string }>({
      query: ({ name }) => ({
        url: "store/lookup/check-name",
        method: "GET",
        params: { name },
      }),
    }),
  }),
});

export const { useCheckStoreNameQuery, useLazyCheckStoreNameQuery } = storeApi;
