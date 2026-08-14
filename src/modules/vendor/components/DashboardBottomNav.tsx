import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Tag, ShoppingCart, People, More } from "iconsax-react";
import { cn } from "@/lib/utils";
import { getAppPath } from "@/utils/subdomain";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Palette, Settings, BarChart2, HelpCircle, LogOut, MessageSquare, Banknote, UserCog, Receipt, Store, Plus, Check, GraduationCap, Wallet } from "lucide-react";
import { useLogoutMutation } from "@/services/authApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useStoreSwitcher } from "@/modules/vendor/hooks/useStoreSwitcher";
import { CreateStoreModal } from "@/modules/vendor/components/modals/CreateStoreModal";

export function DashboardBottomNav() {
  const navigate = useNavigate();
  const [logoutUser] = useLogoutMutation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const {
    stores,
    isLoading: isStoresLoading,
    isSwitching,
    activeStore,
    handleSwitchStore,
  } = useStoreSwitcher();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      toast.success("Logged out successfully");
      navigate("/auth/login");
      setIsDrawerOpen(false);
    } catch {
      toast.error("Failed to log out");
    }
  };

  const navItems = [
    { name: "Home", path: "/", icon: Home, exact: true },
    { name: "Products", path: "/products", icon: Tag },
    { name: "Orders", path: "/orders", icon: ShoppingCart },
    { name: "Customers", path: "/customers", icon: People },
  ];

  const moreItems = [
    { name: "School Zones", path: "/school-zones", icon: GraduationCap },
    { name: "Messages", path: "/messages", icon: MessageSquare },
    { name: "Templates", path: "/templates", icon: Palette },
    { name: "Staff", path: "/staff", icon: UserCog },
    { name: "Sales Terminal", path: "/sales-terminal", icon: Receipt },
    { name: "Sales History", path: "/sales-history", icon: Receipt },
    { name: "Installments", path: "/installments", icon: Wallet },
    { name: "Analytics", path: "/analytics", icon: BarChart2 },
    { name: "Payouts", path: "/payouts", icon: Banknote },
    { name: "Settings", path: "/settings", icon: Settings },
    { name: "Help", path: "/help", icon: HelpCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-[100] w-full lg:hidden bg-background/80 backdrop-blur-xl border-t border-border/50 pb-safe-offset-2">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const fullPath = getAppPath(item.path);

          return (
            <NavLink
              key={item.path}
              to={fullPath}
              end={item.exact}
            >
              {({ isActive }) => (
                <div className={cn(
                  "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all duration-300 relative",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}>
                  <div
                    className={cn(
                      "p-1.5 rounded-sm transition-colors relative active:scale-90",
                      isActive && "bg-primary/10",
                    )}
                  >
                    <Icon
                      variant={isActive ? "Bold" : "Outline"}
                      color="currentColor"
                      size={20}
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {item.name}
                  </span>
                  {isActive && (
                    <div className="absolute -bottom-1 w-6 h-1 bg-primary rounded-t-full" />
                  )}
                </div>
              )}
            </NavLink>
          );
        })}

        {/* MORE DRAWER */}
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center justify-center gap-1 min-w-[64px] text-muted-foreground hover:text-foreground transition-all duration-300">
              <div className="p-1.5 rounded-sm active:scale-90">
                <More variant="Outline" color="currentColor" size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">
                More
              </span>
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[280px] p-0 border-l border-border/30 shadow-2xl flex flex-col"
          >
            <SheetHeader className="p-6 border-b border-border/20">
              <SheetTitle className="text-left font-black tracking-tight">
                Menu
              </SheetTitle>
            </SheetHeader>

            {/* ─── STORE SWITCHER (mobile) ─── */}
            <div className="px-4 pt-4 pb-3 border-b border-border/20">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Switch Store
              </p>
              {isStoresLoading ? (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-sm bg-muted/60">
                  <Store className="h-4 w-4 text-primary shrink-0 animate-pulse" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    Loading stores...
                  </span>
                </div>
              ) : (
                <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                  {stores.map((store) => (
                    <button
                      key={store.id}
                      onClick={() => {
                        setIsDrawerOpen(false);
                        handleSwitchStore(store.id);
                      }}
                      disabled={isSwitching}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm bg-muted/60 hover:bg-muted transition-colors text-left disabled:opacity-60"
                    >
                      <div className="w-7 h-7 rounded-sm bg-primary/10 text-primary flex items-center justify-center text-[9px] font-black shrink-0 overflow-hidden">
                        {store.logo ? (
                          <img src={store.logo} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Store className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">
                          {store.store_name}
                        </p>
                        <p
                          className={cn(
                            "text-[10px] font-medium",
                            store.status === "active"
                              ? "text-emerald-600"
                              : store.status === "pending"
                                ? "text-amber-600"
                                : "text-red-600",
                          )}
                        >
                          {store.status.charAt(0).toUpperCase() +
                            store.status.slice(1)}
                        </p>
                      </div>
                      {store.id === activeStore?.id && (
                        <Check className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setShowCreateModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-primary hover:bg-primary/10 transition-colors text-left"
                  >
                    <Plus className="h-4 w-4 shrink-0" />
                    <span className="text-xs font-bold">Add Another Store</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4">
                <div className="grid gap-2">
                  {moreItems.map((item) => {
                    const Icon = item.icon;
                    const fullPath = getAppPath(item.path);
                    return (
                      <NavLink
                        key={item.path}
                        to={fullPath}
                        onClick={() => setIsDrawerOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-4 px-4 py-3 rounded-sm transition-all hover:bg-muted group",
                            isActive
                              ? "bg-muted text-primary font-bold"
                              : "text-muted-foreground",
                          )
                        }
                      >
                        <div
                          className={cn(
                            "p-2 rounded-sm bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-all",
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-base lowercase first-letter:uppercase">
                          {item.name}
                        </span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              <div className="p-6 border-t border-border/20 mt-auto">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 px-4 py-3 w-full rounded-sm bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all group"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-base font-bold">Logout</span>
                </button>
              </div>
          </SheetContent>
        </Sheet>
      </div>

      <CreateStoreModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </nav>
  );
}
