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
    target: "esnext",
    minify: "esbuild",
    cssMinify: true,
    chunkSizeWarningLimit: 512,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("lucide-react") || id.includes("iconsax")) return "vendor-icons";
            if (id.includes("react-dom") || id.includes("scheduler")) return "vendor-react-dom";
            if (id.includes("react-router")) return "vendor-router";
            if (id.includes("@reduxjs") || id.includes("react-redux") || id.includes("immer") || id.includes("redux")) return "vendor-redux";
            if (id.includes("@radix-ui")) return "vendor-radix";
            if (id.includes("react")) {
              const match = id.match(/node_modules[\\/](?:\.pnpm[\\/][^\\/]+[\\/]node_modules[\\/])?(react[^\\/]*)/);
              if (match) {
                const pkg = match[1].replaceAll("@", "").replaceAll("/", "-");
                return `vendor-${pkg}`;
              }
              return "vendor-react";
            }
            if (id.includes("recharts") || id.includes("d3-")) return "vendor-charts";
            if (id.includes("framer-motion") || id.includes("motion")) return "vendor-animation";
            if (id.includes("react-hook-form") || id.includes("hookform") || id.includes("zod")) return "vendor-forms";
            if (id.includes("date-fns") || id.includes("react-day-picker")) return "vendor-date";
            if (id.includes("tailwind") || id.includes("postcss")) return "vendor-css";
            if (id.includes("axios")) return "vendor-http";
            if (id.includes("@tanstack") || id.includes("react-table")) return "vendor-table";
            if (id.includes("sonner")) return "vendor-toast";
            if (id.includes("country-state-city")) return "vendor-lazy";
            const parts = id.split("node_modules")[1];
            if (parts) {
              const pkg = parts.startsWith("/.pnpm/") ? parts.split("/")[3] : parts.split("/")[1];
              if (pkg?.startsWith("@")) return `vendor-${pkg.replace("@", "").replace("/", "-")}`;
              if (pkg && !pkg.startsWith(".")) return `vendor-${pkg}`;
            }
            return `vendor-misc`;
          }
        },
      },
    },
  },
});
