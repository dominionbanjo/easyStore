import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import ScrollToTop from "@/components/shared/ScrollToTop";
import LoadingScreen from "@/Loading";
export default function HomepageLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-foreground transition-colors duration-300">
      {/* 🌐 Header */}
      <div className="mb-20">
        <Header />
      </div>

      {/* 🧭 Main Content Area (auto renders nested routes) */}
      <main className="flex-1 fade-in-up mt-6 md:mt-8 px-1.5 md:px-14 xl:px-16 max-w-[1780px] mx-auto w-full ">
        <Suspense fallback={<LoadingScreen />}>
          <div key={location.pathname}>
            <Outlet />
          </div>
        </Suspense>
      </main>
      {/* ⚓ Footer */}
      <Footer />
      <ScrollToTop />
    </div>
  );
}
