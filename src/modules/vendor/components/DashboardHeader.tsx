import { useLocation, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Bell, Sun, Moon, LogOut, Home, Settings } from "lucide-react";
import { getBaseDomain, getAppPath } from "@/utils/subdomain";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useLogoutMutation } from "@/services/authApi";
import type { RootState } from "@/store";
import { toast } from "sonner";
import NavigationProgressBar from "@/components/shared/NavigationProgressBar";
import { useEffect, useState } from "react";

interface DashboardHeaderProps {
  onMenuToggle: () => void;
}

export default function DashboardHeader({}: DashboardHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutUser] = useLogoutMutation();
  const { currentUser } = useSelector((state: RootState) => state.user);

  // ─── Dynamic Title Logic ───
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/products")) return "Products";
    if (path.includes("/orders")) return "Orders";
    if (path.includes("/customers")) return "Customers";
    if (path.includes("/settings")) return "Settings";
    if (path.includes("/analytics")) return "Analytics";
    if (path.includes("/templates")) return "Templates";
    if (path.includes("/help")) return "Help";
    return "Overview";
  };

  // 🌗 Local theme management
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved =
      (localStorage.getItem("theme") as "light" | "dark") || "light";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      toast.success("Logged out successfully");
      navigate("/auth/login");
    } catch {
      toast.error("Failed to log out");
    }
  };

  return (
    <header className="flex items-center justify-between px-3 sm:px-6 py-5 border-b border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex flex-col">
        <h2 className="font-black text-2xl sm:text-3xl tracking-tight text-foreground uppercase">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-sm">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage
                  src={currentUser?.avatar || undefined}
                  alt={currentUser?.first_name || "User"}
                />
                <AvatarFallback>
                  {currentUser?.first_name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {currentUser?.first_name} {currentUser?.last_name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentUser?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                (window.location.href = `${window.location.protocol}//${getBaseDomain()}`)
              }
              className="cursor-pointer font-medium"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Website
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={getAppPath("/settings")} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Store Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <NavigationProgressBar />
    </header>
  );
}
