import React from "react";
import type { CSSProperties } from "react";

import type { IStoreTheme } from "@/types/Store/storeTypes";
import { ThemeContext } from "./storeThemeContext";

export type { StoreThemeData, ThemeConfig } from "./storeThemeContext";

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
    "--theme-primary": activeConfig.primary_color || "var(--primary)",
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
