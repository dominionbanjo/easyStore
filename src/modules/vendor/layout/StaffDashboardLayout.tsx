import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { ShoppingCart, Settings, LogOut, Receipt, Sun, Moon, PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/shared/ThemeContext";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { getWebsitePath } from "@/utils/subdomain";
import { AUTH_ROUTES } from "@/routes/temp";
import { StaffBottomNav } from "@/modules/vendor/components/StaffBottomNav";
import { useGetStaffPermissionsQuery } from "@/services/staffApi";

const navItems = [
  { label: "Sales Terminal", icon: ShoppingCart, to: "" },
  { label: "Sales History", icon: Receipt, to: "sales-history" },
  { label: "Settings", icon: Settings, to: "settings" },
];

export function StaffDashboardLayout() {
  const { theme, toggleTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { data: permissionsData } = useGetStaffPermissionsQuery();
  const canCreateProduct = permissionsData?.permissions?.includes("product:create") ?? false;
  const allNavItems = canCreateProduct
    ? [...navItems, { label: "Add Product", icon: PackagePlus, to: "add-product" }]
    : navItems;

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
      <div className="h-screen bg-background pb-16 lg:pb-0 flex flex-col">
        <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-56 border-r bg-card flex-col z-40">
          <div className="h-14 px-4 border-b flex items-center shrink-0">
            <h2 className="font-bold text-lg text-primary">Staff Panel</h2>
          </div>
          <nav className="flex-1 overflow-y-auto p-2 space-y-1">
            {allNavItems.map((item) => (
              <NavLink
                key={item.to}
                end={item.to === ""}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="p-2 border-t space-y-1 shrink-0">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-sm"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-sm" onClick={() => setShowLogoutConfirm(true)}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        <main className="lg:ml-56 flex-1 min-h-0 flex flex-col overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <StaffBottomNav />

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
