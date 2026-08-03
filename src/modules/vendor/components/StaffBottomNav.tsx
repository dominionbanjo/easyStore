import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ShoppingCart, Receipt, Settings, MoreHorizontal, Sun, Moon, LogOut, PackagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/shared/themeContextCore";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { getWebsitePath } from "@/utils/subdomain";
import { AUTH_ROUTES } from "@/routes/temp";
import { useGetStaffPermissionsQuery } from "@/services/staffApi";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { name: "Terminal", path: "", icon: ShoppingCart, exact: true },
  { name: "History", path: "sales-history", icon: Receipt },
  { name: "Settings", path: "settings", icon: Settings },
];

export function StaffBottomNav() {
  const { theme, toggleTheme } = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data: permissionsData } = useGetStaffPermissionsQuery();
  const canCreateProduct = permissionsData?.permissions?.includes("product:create") ?? false;
  const allNavItems = canCreateProduct
    ? [...navItems, { name: "Add Product", path: "add-product", icon: PackagePlus }]
    : navItems;
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    const cookies = document.cookie.split("; ");
    cookies.forEach((c) => {
      const [name] = c.split("=");
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    localStorage.clear();
    const loginPath = getWebsitePath(AUTH_ROUTES.LOGIN) || AUTH_ROUTES.LOGIN;
    window.location.href = loginPath;
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 z-[100] w-full lg:hidden bg-background/80 backdrop-blur-xl border-t border-border/50">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {allNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className="flex flex-col items-center justify-center gap-0.5 min-w-[64px]"
              >
                {({ isActive }) => (
                  <div
                    className={cn(
                      "flex flex-col items-center gap-0.5 transition-all duration-300 relative py-1",
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <div className={cn("p-1.5 rounded-sm transition-colors", isActive && "bg-primary/10")}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
                    {isActive && <div className="absolute -bottom-1 w-5 h-0.5 bg-primary rounded-t-full" />}
                  </div>
                )}
              </NavLink>
            );
          })}

          {/* MORE DRAWER */}
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center gap-0.5 min-w-[64px] text-muted-foreground hover:text-foreground transition-all duration-300 py-1">
                <div className="p-1.5 rounded-sm">
                  <MoreHorizontal className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0 border-l">
              <SheetHeader className="p-6 border-b">
                <SheetTitle className="text-left font-bold">Staff Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-[calc(100%-80px)]">
                <div className="flex-1" />
                <div className="p-6 border-t space-y-3">
                  <button
                    onClick={() => { toggleTheme(); setIsDrawerOpen(false); }}
                    className="flex items-center gap-4 px-4 py-3 w-full rounded-sm hover:bg-muted transition-colors text-left"
                  >
                    <div className="p-2 rounded-sm bg-muted">
                      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </div>
                    <span className="text-base font-medium">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                  </button>
                  <button
                    onClick={() => { setIsDrawerOpen(false); setShowLogoutConfirm(true); }}
                    className="flex items-center gap-4 px-4 py-3 w-full rounded-sm bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <div className="p-2 rounded-sm bg-red-500/20">
                      <LogOut className="h-5 w-5" />
                    </div>
                    <span className="text-base font-bold">Logout</span>
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <ConfirmDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        onConfirm={handleLogout}
        title="Logout"
        description="Are you sure you want to logout?"
        confirmText="Logout"
        variant="destructive"
      />
    </>
  );
}
