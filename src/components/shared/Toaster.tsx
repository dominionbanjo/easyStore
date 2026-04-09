import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "./ThemeContext";

export function Toaster() {
  const { theme } = useTheme();

  return (
    <SonnerToaster
      position="top-right"
      expand={true}
      theme={theme as "light" | "dark"}
      toastOptions={{
        style: {
          borderRadius: "var(--radius-sm)",
          fontSize: "0.9rem",
          marginTop: "60px",
        },
      }}
    />
  );
}
