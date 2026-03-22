import { Outlet, useParams } from "react-router-dom";
import { getSubdomain } from "@/utils/subdomain";
import { useGetStoreThemeQuery } from "@/services/storeApi";
import { StoreThemeProvider } from "../components/StoreThemeProvider";

export default function StorefrontLayout() {
  let { slug } = useParams<{ slug: string }>();
  const subdomain = getSubdomain();
  if (subdomain && subdomain !== "vendor" && subdomain !== "admin") {
    slug = subdomain;
  }

  // Fetch the layout and theme configurations for the store
  const { data: themeResponse, isLoading } = useGetStoreThemeQuery(slug || "", {
    skip: !slug,
  });

  if (isLoading) {
    return (
      <div className="flex w-full min-h-screen items-center justify-center p-8 bg-white dark:bg-neutral-950">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const themeData = themeResponse;

  // Render the outlet (which will map to the different templates based on provider context)
  return (
    <StoreThemeProvider themeData={themeData}>
      {/* 🧭 Main Storefront Content Area */}
      <main className="flex flex-col w-full bg-white dark:bg-neutral-950 text-foreground transition-colors duration-300 min-h-screen">
        <Outlet />
      </main>
    </StoreThemeProvider>
  );
}
