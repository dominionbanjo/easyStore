import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/public": path.resolve(__dirname, "./public"),
      "@/src": path.resolve(__dirname, "./src"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/styles": path.resolve(__dirname, "./src/styles"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/modules": path.resolve(__dirname, "./src/modules"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // 1MB
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": [
            "@radix-ui/react-icons",
            "lucide-react",
            "clsx",
            "tailwind-merge",
          ],
          "vendor-charts": ["recharts"],
          "vendor-animation": ["framer-motion"],
        },
      },
    },
  },
});
