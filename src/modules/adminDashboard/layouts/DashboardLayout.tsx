import { Outlet } from "react-router-dom";
import Sidebar from "@/modules/adminDashboard/components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Sidebar (fixed) */}
      <Sidebar />

      {/* Main Content */}
      <main
        className="
          md:ml-64 
          pt-16 md:pt-0 
          overflow-y-auto 
          h-screen 
        "
      >
        <DashboardHeader />
        <section className="p-5">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
