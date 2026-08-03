import { createContext, useContext } from "react";

export interface StoreData {
  status: string;
  message: string;
  data: {
    store: Record<string, unknown>;
    theme?: Record<string, unknown> | null;
    categories?: Record<string, unknown>[];
  };
}

export const StoreDataContext = createContext<StoreData | null>(null);

export function useStoreData(): StoreData | null {
  return useContext(StoreDataContext);
}
