import React, { createContext, useContext } from "react";
import type { CSSProperties } from "react";

import type { IStoreTheme, ThemeConfig } from "@/types/Store/storeTypes";

export type { ThemeConfig };

export interface StoreThemeData extends IStoreTheme {
  custom_config: ThemeConfig | null;
}

const ThemeContext = createContext<{
  theme: ThemeConfig;
  templateName: string;
} | null>(null);

export function useStoreTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useStoreTheme must be used within a StoreThemeProvider");
  }
  return context;
}

export function StoreThemeProvider({
  themeData,
  children,
}: {
  themeData?: IStoreTheme;
  children: React.ReactNode;
}) {
  const activeConfig = {
    ...themeData?.template?.default_config,
    ...themeData?.custom_config,
  };

  const templateName = themeData?.template?.name || "Default";

  // Map specific config values to CSS variables
  const styleContext: CSSProperties & { [key: string]: string } = {
    ...(activeConfig.primary_color && {
      "--theme-primary": activeConfig.primary_color,
    }),
    ...(activeConfig.font_family && {
      "--theme-font": activeConfig.font_family,
    }),
  };

  return (
    <ThemeContext.Provider value={{ theme: activeConfig, templateName }}>
      <div
        className={`w-full min-h-screen store-theme-wrapper ${
          activeConfig.dark_mode_default ? "dark" : ""
        }`}
        style={styleContext}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
