import { useState, useEffect } from "react";
import {
  Menu,
  Bell,
  UserCog,
  Sun,
  Moon,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NavigationProgressBar from "@/components/shared/NavigationProgressBar";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { selectCurrentUser, clearUser } from "@/features/userSlice";
import { useNavigate } from "react-router-dom";
import { ConfirmActionDialog } from "./shared/ConfirmActionDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface SuperAdminHeaderProps {
  onMenuToggle: () => void;
}

export default function SuperAdminHeader({
  onMenuToggle,
}: SuperAdminHeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);

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

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user) return "AD";
    return (
      `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() ||
      "AD"
    );
  };

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/30 bg-background sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="font-semibold text-lg hidden sm:block">
            Super Admin Dashboard
          </h2>
          <h2 className="font-semibold text-lg sm:hidden">Admin</h2>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="hidden xs:flex">
            <Bell className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full p-0"
              >
                <Avatar className="h-10 w-10 border border-border/50">
                  <AvatarImage
                    src={user?.avatar || ""}
                    alt={user?.first_name || "Admin"}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="end">
              <div className="flex flex-col space-y-4">
                <div className="px-2 py-1.5 flex items-center gap-3">
                  <Avatar className="h-9 w-9 border border-border/50">
                    <AvatarImage
                      src={user?.avatar || ""}
                      alt={user?.first_name || "Admin"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-semibold leading-none truncate max-w-[140px]">
                      {user
                        ? `${user.first_name} ${user.last_name}`
                        : "Admin User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                      {user?.email || "admin@easystore.com"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 h-9 text-sm"
                    onClick={() => navigate("/admin/settings")}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 h-9 text-sm"
                    onClick={() => navigate("/admin/settings")}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                </div>

                <Separator />

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 h-9 text-sm text-destructive hover:text-destructive hover:bg-destructive/5"
                  onClick={() => setShowLogoutModal(true)}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <NavigationProgressBar />
      </header>

      <ConfirmActionDialog
        open={showLogoutModal}
        title="Confirm Logout"
        description="Are you sure you want to log out of the Super Admin dashboard?"
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        confirmLabel="Logout"
        confirmVariant="destructive"
      />
    </>
  );
}
