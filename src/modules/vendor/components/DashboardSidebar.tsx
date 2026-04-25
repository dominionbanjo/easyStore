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
  ChevronLeft,
  ChevronRight,
  Palette,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StoreSetupTracker } from "./shared/StoreSetupTracker";
import { getAppPath } from "@/utils/subdomain";
import { useEffect } from "react";

// Inline dynamic imports — avoids circular dependency with lazyPages → VendorDashboardLayout → DashboardSidebar
const preloadMap: Record<string, () => void> = {
  "/": () => { import("@/modules/vendor/pages/VendorDashboardPage"); },
  "/products": () => { import("@/modules/vendor/pages/ProductsPage"); },
  "/orders": () => { import("@/modules/vendor/pages/OrdersPage"); },
  "/customers": () => { import("@/modules/vendor/pages/CustomersPage"); },
  "/templates": () => { import("@/modules/vendor/pages/VendorTemplatesPage"); },
  "/settings": () => { import("@/modules/vendor/pages/StoreSettingsPage"); },
  "/analytics": () => { import("@/modules/vendor/pages/AnalyticsPage"); },
  "/help": () => { import("@/modules/vendor/pages/HelpPage"); },
};

const allVendorPreloaders: Array<() => void> = [
  () => { import("@/modules/vendor/pages/VendorDashboardPage"); },
  () => { import("@/modules/vendor/pages/ProductsPage"); },
  () => { import("@/modules/vendor/pages/OrdersPage"); },
  () => { import("@/modules/vendor/pages/CustomersPage"); },
  () => { import("@/modules/vendor/pages/VendorTemplatesPage"); },
  () => { import("@/modules/vendor/pages/StoreSettingsPage"); },
  () => { import("@/modules/vendor/pages/AnalyticsPage"); },
  () => { import("@/modules/vendor/pages/HelpPage"); },
  () => { import("@/modules/vendor/pages/AddProductsPage"); },
];

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/", exact: true },
  { label: "Products", icon: Package, to: "/products" },
  { label: "Orders", icon: ShoppingCart, to: "/orders" },
  { label: "Customers", icon: Users, to: "/customers" },
  { label: "Templates", icon: Palette, to: "/templates" },
  { label: "Store Settings", icon: Settings, to: "/settings" },
  { label: "Analytics", icon: BarChart2, to: "/analytics" },
  { label: "Help", icon: HelpCircle, to: "/help" },
];

interface DashboardSidebarProps {
  open: boolean;
  onToggle: () => void;
  isCollapsed: boolean;
  onCollapse: () => void;
}

export default function DashboardSidebar({
  open,
  isCollapsed,
  onCollapse,
}: DashboardSidebarProps) {
  // Preload all vendor page chunks during browser idle time so navigation is instant
  useEffect(() => {
    const preload = () => {
      allVendorPreloaders.forEach((fn) => fn());
    };
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(preload, { timeout: 3000 });
      return () => cancelIdleCallback(id);
    } else {
      // Fallback for Safari
      const t = setTimeout(preload, 2000);
      return () => clearTimeout(t);
    }
  }, []);

  // Also eagerly preload all pages the moment the mobile drawer opens
  useEffect(() => {
    if (open) {
      allVendorPreloaders.forEach((fn) => fn());
    }
  }, [open]);

  const handlePreload = (path: string) => {
    preloadMap[path]?.();
  };

  return (
    <>
      {/* ─── Desktop Sidebar ─── */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-border/30 bg-card text-card-foreground transition-all duration-300",
          "fixed top-0 left-0 h-screen z-30",
          isCollapsed ? "w-[80px]" : "w-[260px]",
        )}
      >
        <div className="flex items-center justify-between px-4 py-[18.2px] border-b border-border/20">
          <div className="flex items-center gap-2 overflow-hidden">
            <Store className="h-6 w-6 text-primary shrink-0" />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-semibold text-lg truncate"
              >
                My Store
              </motion.span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCollapse}
            className="h-8 w-8 hover:bg-muted"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <nav className="flex flex-col gap-1 px-2 mt-4">
          {menuItems.map(({ label, icon: Icon, to, exact }) => {
            const finalPath = getAppPath(to);

            return (
              <NavLink
                key={label}
                to={finalPath}
                end={exact}
                title={isCollapsed ? label : ""}
                onMouseEnter={() => handlePreload(to)}
                onFocus={() => handlePreload(to)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-colors",
                    "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    isActive && "bg-muted text-foreground font-medium",
                    isCollapsed && "justify-center px-0",
                  )
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="truncate"
                  >
                    {label}
                  </motion.span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {!isCollapsed && (
          <div className="mt-auto p-4 border-t border-border/20">
            <StoreSetupTracker variant="minimal" />
          </div>
        )}
      </aside>

    </>
  );
}

