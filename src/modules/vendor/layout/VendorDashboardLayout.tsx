"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { Outlet } from "react-router-dom";

export default function VendorDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <section className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <DashboardSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main content shifts right by sidebar width on desktop */}
      <div
        className={cn(
          "flex flex-col flex-1 min-w-0 transition-all duration-300",
          "md:ml-[260px]" // ensures header/content align beside sidebar
        )}
      >
        <DashboardHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <motion.main layout className="p-6 md:p-10 w-full max-w-7xl mx-auto">
          <Outlet />
        </motion.main>
      </div>
    </section>
  );
}
