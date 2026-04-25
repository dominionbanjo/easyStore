import React, { createContext, useContext, useEffect, useState } from "react";
import { getCookieDomain } from "@/utils/subdomain";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    // 1. Check Cookie (Shared across subdomains)
    const getCookie = (name: string) => {
      const match = document.cookie.match(
        new RegExp("(^| )" + name + "=([^;]+)"),
      );
      return match ? (match[2] as Theme) : null;
    };
    const savedCookieTheme = getCookie("theme");

    // 2. Check LocalStorage (Fallback)
    const savedLocalTheme = localStorage.getItem("theme") as Theme | null;

    // 3. Check System Preference
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    const initialTheme = savedCookieTheme || savedLocalTheme || systemTheme;
    setThemeState(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);

    // Save to LocalStorage
    localStorage.setItem("theme", newTheme);

    // Save to Cookie (Shared across subdomains)
    const cookieDomain = getCookieDomain();
    const domainStr = cookieDomain ? `; domain=${cookieDomain}` : "";
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000${domainStr}`;

    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
