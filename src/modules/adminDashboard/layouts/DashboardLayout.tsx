"use client";

import { Outlet } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-emerald-50 text-foreground">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 px-6 py-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
