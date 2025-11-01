import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import { Outlet } from "react-router-dom";
import SuperAdminHeader from "../components/SuperAdminHeader";
import SuperAdminSidebar from "../components/SuperAdminSidebar";

export default function SuperAdminDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <section className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <SuperAdminSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Content area (shifted by sidebar width) */}
      <div
        className={cn(
          "flex flex-col flex-1 min-w-0 transition-all duration-300",
          "md:ml-[260px]"
        )}
      >
        <SuperAdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <motion.main
          layout
          className="p-6 md:p-10 w-full max-w-7xl mx-auto space-y-10"
        >
          <Outlet />
        </motion.main>
      </div>
    </section>
  );
}
