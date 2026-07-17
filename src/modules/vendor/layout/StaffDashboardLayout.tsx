import { Outlet, NavLink, useLocation } from "react-router-dom";
import { ShoppingCart, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Sales Terminal", icon: ShoppingCart, to: "/" },
  { label: "Settings", icon: Settings, to: "/settings" },
];

export function StaffDashboardLayout() {
  const location = useLocation();

  const handleLogout = () => {
    const cookies = document.cookie.split("; ");
    cookies.forEach((c) => {
      const [name] = c.split("=");
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-56 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg text-primary">Staff Panel</h2>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="p-2 border-t space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-3 text-sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
