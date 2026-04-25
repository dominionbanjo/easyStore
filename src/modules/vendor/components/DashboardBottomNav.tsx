import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Tag, ShoppingCart, People, More } from "iconsax-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { getAppPath } from "@/utils/subdomain";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Palette, Settings, BarChart2, HelpCircle, LogOut } from "lucide-react";
import { useLogoutMutation } from "@/services/authApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function DashboardBottomNav() {
  const navigate = useNavigate();
  const [logoutUser] = useLogoutMutation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
    { name: "Templates", path: "/templates", icon: Palette },
    { name: "Analytics", path: "/analytics", icon: BarChart2 },
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
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "p-1.5 rounded-sm transition-colors relative",
                      isActive && "bg-primary/10",
                    )}
                  >
                    <Icon
                      variant={isActive ? "Bold" : "Outline"}
                      color="currentColor"
                      size={20}
                    />
                  </motion.div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {item.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabDashboard"
                      className="absolute -bottom-1 w-6 h-1 bg-primary rounded-t-full"
                    />
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
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-sm"
              >
                <More variant="Outline" color="currentColor" size={20} />
              </motion.div>
              <span className="text-[10px] font-bold uppercase tracking-widest">
                More
              </span>
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[280px] p-0 border-l border-border/30 shadow-2xl"
          >
            <SheetHeader className="p-6 border-b border-border/20">
              <SheetTitle className="text-left font-black tracking-tight">
                Menu
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col h-[calc(100%-80px)]">
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
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
