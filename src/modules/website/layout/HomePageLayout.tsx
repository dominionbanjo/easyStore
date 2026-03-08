import { Outlet } from "react-router-dom";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
export default function HomepageLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-foreground transition-colors duration-300">
      {/* 🌐 Header */}
      <div className="mb-20">
        <Header />
      </div>

      {/* 🧭 Main Content Area (auto renders nested routes) */}
      <main className="flex-1 fade-in-up mt-6 md:mt-8 px-1.5 md:px-14 xl:px-16 w-full ">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
