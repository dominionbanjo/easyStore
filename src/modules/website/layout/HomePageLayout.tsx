import { Outlet } from "react-router-dom";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { BottomNav } from "@/components/shared/BottomNav";
import { HomeFloater } from "@/components/shared/HomeFloater";

export default function HomepageLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-foreground transition-colors duration-300">
      <Header />
      <main className="flex-1 fade-in-up w-full overflow-x-clip">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
      <HomeFloater />
    </div>
  );
}
