import { createContext, useContext } from "react";

import type { IStoreTheme, ThemeConfig } from "@/types/Store/storeTypes";

export type { ThemeConfig };

export interface StoreThemeData extends IStoreTheme {
  custom_config: ThemeConfig | null;
}

export interface StoreThemeContextValue {
  theme: ThemeConfig;
  templateName: string;
}

export const ThemeContext = createContext<StoreThemeContextValue | null>(null);

export function useStoreTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useStoreTheme must be used within a StoreThemeProvider");
  }
  return context;
}
