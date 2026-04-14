import { Suspense } from "react";
import { Outlet, useParams } from "react-router-dom";
import { getSubdomain } from "@/utils/subdomain";
import { useGetStoreDetailsQuery } from "@/services/storeApi";
import { StoreThemeProvider } from "../components/StoreThemeProvider";
import { StoreSkeleton } from "../components/skeletons/StoreSkeleton";
import { HomeFloater } from "@/components/shared/HomeFloater";

export default function StorefrontLayout() {
  let { slug } = useParams<{ slug: string }>();
  const subdomain = getSubdomain();
  if (subdomain && subdomain !== "vendor" && subdomain !== "admin") {
    slug = subdomain;
  }

  // Fetch the layout and theme configurations for the store
  const { data: storeResponse, isLoading } = useGetStoreDetailsQuery(
    { slug: slug || "", includeCategories: false },
    { skip: !slug }
  );

  if (isLoading) {
    return <StoreSkeleton />;
  }

  const themeData = storeResponse?.data.store.theme;

  // Render the outlet (which will map to the different templates based on provider context)
  return (
    <StoreThemeProvider themeData={themeData as any}>
      {/* 🧭 Main Storefront Content Area */}
      <main className="flex flex-col w-full bg-white dark:bg-neutral-950 text-foreground transition-colors duration-300 min-h-screen">
        <Suspense fallback={<StoreSkeleton />}>
          <Outlet />
        </Suspense>
      </main>
      <HomeFloater />
    </StoreThemeProvider>
  );
}
