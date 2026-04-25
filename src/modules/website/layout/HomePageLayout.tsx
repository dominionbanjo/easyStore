import { Outlet } from "react-router-dom";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { BottomNav } from "@/components/shared/BottomNav";
import { HomeFloater } from "@/components/shared/HomeFloater";

export default function HomepageLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-foreground transition-colors duration-300">
      {/* 🌐 Header */}
      <div className="mb-14">
        <Header />
      </div>

      {/* 🧭 Main Content Area (auto renders nested routes) */}
      <main className="flex-1 fade-in-up mt-6 md:mt-8 w-full overflow-x-clip">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
      <HomeFloater />
    </div>
  );
}
