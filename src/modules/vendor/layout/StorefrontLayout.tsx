import { Suspense, createContext, useContext } from "react";
import { Outlet, useParams } from "react-router-dom";
import { getSubdomain } from "@/utils/subdomain";
import { useGetStoreDetailsQuery } from "@/services/storeApi";
import { StoreThemeProvider } from "../components/StoreThemeProvider";
import { StoreSkeleton } from "../components/skeletons/StoreSkeleton";
import { HomeFloater } from "@/components/shared/HomeFloater";

// Context to share store response with child pages (avoids duplicate fetches)
export interface StoreData {
  status: string;
  message: string;
  data: {
    store: Record<string, unknown>;
    theme?: Record<string, unknown> | null;
    categories?: Record<string, unknown>[];
  };
}
const StoreDataContext = createContext<StoreData | null>(null);
export function useStoreData(): StoreData | null {
  return useContext(StoreDataContext);
}

export default function StorefrontLayout() {
  let { slug } = useParams<{ slug: string }>();
  const subdomain = getSubdomain();
  if (subdomain && subdomain !== "vendor" && subdomain !== "admin") {
    slug = subdomain;
  }

  const { data: storeResponse, isLoading } = useGetStoreDetailsQuery(
    { slug: slug || "", includeCategories: true, includeProducts: false },
    { skip: !slug }
  );

  if (isLoading) {
    return <StoreSkeleton />;
  }

  const storeData = storeResponse as unknown as StoreData;
  const themeData = storeData?.data?.store
    ? ((storeData.data.store as Record<string, unknown>).theme as Record<string, unknown>) ?? null
    : null;

  return (
    <StoreDataContext.Provider value={storeData ?? null}>
      <StoreThemeProvider themeData={themeData as any}>
        <main className="flex flex-col w-full bg-white dark:bg-neutral-950 text-foreground transition-colors duration-300 min-h-screen">
          <Suspense fallback={<StoreSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
        <HomeFloater />
      </StoreThemeProvider>
    </StoreDataContext.Provider>
  );
}
