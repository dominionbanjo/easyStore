"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart2,
  HelpCircle,
  Store,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/vendor" },
  { label: "Products", icon: Package, to: "/vendor/products" },
  { label: "Orders", icon: ShoppingCart, to: "/vendor/orders" },
  { label: "Customers", icon: Users, to: "/vendor/customers" },
  { label: "Store Settings", icon: Settings, to: "/vendor/settings" },
  { label: "Analytics", icon: BarChart2, to: "/vendor/analytics" },
  { label: "Help", icon: HelpCircle, to: "/vendor/help" },
];

interface DashboardSidebarProps {
  open: boolean;
  onToggle: () => void;
}

export default function DashboardSidebar({
  open,
  onToggle,
}: DashboardSidebarProps) {
  return (
    <>
      {/* ─── Desktop Sidebar (always open from md↑) ─── */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-border/30 bg-card text-card-foreground",
          "fixed top-0 left-0 h-screen w-[260px] z-30"
        )}
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-border/20">
          <div className="flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">My Store</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-2 mt-4">
          {menuItems.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={label}
              to={to}
              end
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  isActive && "bg-muted text-foreground font-medium"
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* ─── Mobile Sidebar (slides in on click) ─── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onToggle}
              className="fixed inset-0 bg-black/70 z-40 md:hidden"
            />
            {/* Sidebar Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className={cn(
                "flex flex-col border-r border-border/30 bg-card text-card-foreground",
                "fixed left-0 top-0 h-screen w-[260px] z-50 md:hidden"
              )}
            >
              <div className="flex items-center justify-between px-4 py-5 border-b border-border/20">
                <div className="flex items-center gap-2">
                  <Store className="h-6 w-6 text-primary" />
                  <span className="font-semibold text-lg">My Store</span>
                </div>
              </div>

              <nav className="flex flex-col gap-1 px-2 mt-4">
                {menuItems.map(({ label, icon: Icon, to }) => (
                  <NavLink
                    key={label}
                    to={to}
                    end
                    onClick={onToggle}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                        "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "bg-muted text-foreground font-medium"
                      )
                    }
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
