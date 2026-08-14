import { useState } from "react";
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
  MessageSquare,
  Banknote as BanknoteIcon,
  UserCog,
  Receipt,
  Check,
  Plus,
  ChevronDown,
  GraduationCap,
  Wallet,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StoreSetupTracker } from "./shared/StoreSetupTracker";
import { getAppPath } from "@/utils/subdomain";
import { useEffect } from "react";
import { CreateStoreModal } from "@/modules/vendor/components/modals/CreateStoreModal";
import { useStoreSwitcher } from "@/modules/vendor/hooks/useStoreSwitcher";

// Inline dynamic imports — avoids circular dependency with lazyPages → VendorDashboardLayout → DashboardSidebar
const preloadMap: Record<string, () => void> = {
  "/": () => { import("@/app/(dashboard)/vendor/page"); },
  "/products": () => { import("@/app/(dashboard)/vendor/products/page"); },
  "/orders": () => { import("@/app/(dashboard)/vendor/orders/page"); },
  "/installments": () => { import("@/app/(dashboard)/vendor/installments/page"); },
  "/customers": () => { import("@/app/(dashboard)/vendor/customers/page"); },
  "/templates": () => { import("@/app/(dashboard)/vendor/templates/page"); },
  "/settings": () => { import("@/app/(dashboard)/vendor/settings/page"); },
  "/analytics": () => { import("@/app/(dashboard)/vendor/analytics/page"); },
  "/payouts": () => { import("@/app/(dashboard)/vendor/payouts/page"); },
  "/help": () => { import("@/app/(dashboard)/vendor/help/page"); },
  "/messages": () => { import("@/app/(dashboard)/vendor/messages/page"); },
  "/school-zones": () => { import("@/app/(dashboard)/vendor/school-zones/page"); },
  "/staff": () => { import("@/modules/vendor/components/staff/StaffManagementPage"); },
  "/sales-terminal": () => { import("@/modules/vendor/components/sales-terminal/SalesTerminalPage"); },
  "/sales-history": () => { import("@/modules/vendor/components/sales-history/SalesHistoryPage"); },
};

const allVendorPreloaders: Array<() => void> = [
  () => { import("@/app/(dashboard)/vendor/page"); },
  () => { import("@/app/(dashboard)/vendor/products/page"); },
  () => { import("@/app/(dashboard)/vendor/orders/page"); },
  () => { import("@/app/(dashboard)/vendor/installments/page"); },
  () => { import("@/app/(dashboard)/vendor/customers/page"); },
  () => { import("@/app/(dashboard)/vendor/templates/page"); },
  () => { import("@/app/(dashboard)/vendor/settings/page"); },
  () => { import("@/app/(dashboard)/vendor/analytics/page"); },
  () => { import("@/app/(dashboard)/vendor/payouts/page"); },
  () => { import("@/app/(dashboard)/vendor/help/page"); },
  () => { import("@/app/(dashboard)/vendor/messages/page"); },
  () => { import("@/app/(dashboard)/vendor/school-zones/page"); },
  () => { import("@/app/(dashboard)/vendor/products/new/page"); },
  () => { import("@/modules/vendor/components/sales-terminal/SalesTerminalPage"); },
  () => { import("@/modules/vendor/components/sales-history/SalesHistoryPage"); },
];

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/", exact: true },
  { label: "Products", icon: Package, to: "/products" },
  { label: "Orders", icon: ShoppingCart, to: "/orders" },
  { label: "Installments", icon: Wallet, to: "/installments" },
  { label: "Customers", icon: Users, to: "/customers" },
  { label: "Staff", icon: UserCog, to: "/staff" },
  { label: "Sales Terminal", icon: Receipt, to: "/sales-terminal" },
  { label: "Sales History", icon: Receipt, to: "/sales-history" },
  { label: "School Zones", icon: GraduationCap, to: "/school-zones" },
  { label: "Payouts", icon: BanknoteIcon, to: "/payouts" },
  { label: "Templates", icon: Palette, to: "/templates" },
  { label: "Messages", icon: MessageSquare, to: "/messages" },
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

  const [showCreateModal, setShowCreateModal] = useState(false);
  const {
    stores,
    isLoading: isStoresLoading,
    isSwitching,
    activeStore,
    handleSwitchStore,
  } = useStoreSwitcher();

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
          {isStoresLoading ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <Store className="h-6 w-6 text-primary shrink-0" />
              {!isCollapsed && <span className="font-semibold text-lg truncate">Loading...</span>}
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={isSwitching}>
                <button className="flex items-center gap-2 overflow-hidden flex-1 text-left">
                  <Store className="h-6 w-6 text-primary shrink-0" />
                  {!isCollapsed && (
                    <span className="font-semibold text-lg truncate flex items-center gap-1">
                      {activeStore?.store_name ?? "Select Store"}
                      <ChevronDown className="h-3.5 w-3.5 opacity-50 shrink-0" />
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {stores.map((store) => (
                  <DropdownMenuItem
                    key={store.id}
                    onClick={() => handleSwitchStore(store.id)}
                    className="flex items-center gap-3 py-2"
                  >
                    <div className="w-6 h-6 rounded-sm bg-primary/10 text-primary flex items-center justify-center text-[9px] font-black shrink-0 overflow-hidden">
                      {store.logo ? (
                        <img src={store.logo} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Store className="h-3 w-3" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{store.store_name}</p>
                      <Badge
                        variant="outline"
                        className={`text-[8px] px-1 py-0 font-medium mt-0.5 ${
                          store.status === "active"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : store.status === "pending"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              : "bg-red-500/10 text-red-600 border-red-500/20"
                        }`}
                      >
                        {store.status.charAt(0).toUpperCase() + store.status.slice(1)}
                      </Badge>
                    </div>
                    {store.id === activeStore?.id && (
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 py-2 text-primary font-bold text-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Another Store
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onCollapse}
            className="h-8 w-8 hover:bg-muted shrink-0"
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
                  <span
                    className="truncate"
                  >
                    {label}
                  </span>
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

      <CreateStoreModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </>
  );
}

