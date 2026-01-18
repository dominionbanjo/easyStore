import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { clearUser } from "@/features/userSlice";
import { useLogoutMutation } from "@/services/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Menu,
  User,
  Search,
  Home,
  Store,
  Layers,
  Info,
  LogOut,
  ShoppingBag,
  Heart,
  User as UserIcon,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import { AUTH_ROUTES, USER_ROUTES, WEBSITE_ROUTES } from "@/routes/temp";
import { toast } from "sonner";
import { motion } from "framer-motion";
import FancyHoverText from "./FancyTextHover";

export default function Header() {
  const dispatch = useDispatch();
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const [logoutUser] = useLogoutMutation();
  const [query, setQuery] = useState("");

  const user = useSelector((state: RootState) => state.user.currentUser);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated,
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(clearUser());
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to log out");
    }
  };

  const navigate = useNavigate();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) return;

    const params = new URLSearchParams();
    params.set("q", trimmed);

    // If already on /s → just update params
    if (location.pathname === "/s") {
      navigate({ search: params.toString() }, { replace: true });
    } else {
      navigate(`/s?${params.toString()}`);
    }

    setSearchOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
      )}
    >
      <nav
        className={cn(
          "flex w-full items-center justify-between backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] px-4 sm:px-6 py-3",
          "fixed top-0 left-1/2 -translate-x-1/2",
          "will-change-[transform,background-color,border-color,box-shadow]",
          isScrolled
            ? "max-w-[100%] sm:max-w-[95%] bg-white/80 rounded-none sm:rounded-xl shadow-md sm:top-3 border border-border/20"
            : "max-w-[100%] bg-white/30 sm:top-3 border border-transparent",
        )}
      >
        {/* ---------- LEFT: Logo + Desktop Nav ---------- */}
        <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0">
          {/* Mobile Menu */}
          <div className="flex lg:hidden flex-shrink-0">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="p-2">
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Menu className="h-6 w-6 text-neutral-800" />
                  </motion.div>
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-64 p-6 bg-white">
                <nav className="space-y-4 text-base font-medium">
                  {[
                    { name: "Home", path: WEBSITE_ROUTES.HOME, icon: Home },
                    {
                      name: "Stores",
                      path: WEBSITE_ROUTES.STORES,
                      icon: Store,
                    },
                    {
                      name: "Categories",
                      path: WEBSITE_ROUTES.CATEGORIES,
                      icon: Layers,
                    },
                    { name: "About", path: WEBSITE_ROUTES.ABOUT, icon: Info },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 transition-all duration-200",
                          location.pathname === item.path
                            ? "text-primary font-semibold"
                            : "text-neutral-800 hover:text-primary",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    );
                  })}

                  <div className="border-t my-3" />

                  <div className="border-t my-3" />

                  {isAuthenticated ? (
                    /* ===== LOGGED IN ===== */
                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="flex items-center gap-3 text-red-600 py-2 w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  ) : (
                    /* ===== LOGGED OUT ===== */
                    <div className="space-y-2">
                      <Link
                        to={AUTH_ROUTES.LOGIN}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 py-2 text-neutral-800 hover:text-primary"
                      >
                        <UserIcon className="h-4 w-4" />
                        Sign In
                      </Link>

                      <Link
                        to={AUTH_ROUTES.SIGNUP}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 py-2 text-neutral-800 hover:text-primary"
                      >
                        <Store className="h-4 w-4" />
                        Create Account
                      </Link>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link
            to={WEBSITE_ROUTES.HOME}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <img
              src="/logos/inline-stripe-transparent.png"
              alt="EasyStore logo"
              className="h-9 w-auto sm:h-10 lg:h-11"
              loading="lazy"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium whitespace-nowrap">
            {[
              { name: "Home", path: WEBSITE_ROUTES.HOME },
              { name: "Stores", path: WEBSITE_ROUTES.STORES },
              { name: "Categories", path: WEBSITE_ROUTES.CATEGORIES },
              { name: "About", path: WEBSITE_ROUTES.ABOUT },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "transition-colors duration-200 relative inline-block group",
                  location.pathname === item.path
                    ? "text-primary font-semibold"
                    : "text-neutral-800 hover:text-primary",
                )}
              >
                <FancyHoverText text={item.name} />
              </Link>
            ))}
          </nav>
        </div>

        {/* ---------- MIDDLE: Search ---------- */}
        <div className="hidden md:flex flex-1 justify-center px-4 lg:px-6 max-w-[500px]">
          <form
            onSubmit={handleSearch}
            className="flex w-[80%] items-center rounded-full bg-white border-2 border-border/40 overflow-hidden shadow-sm focus-within:ring-1 focus-within:ring-primary/10 transition-all"
          >
            <div className="pl-4 flex-shrink-0">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>

            <Input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 shadow-none bg-white py-6 focus-visible:ring-0 text-sm px-3 flex-1 min-w-0"
            />

            <Button type="submit" size="sm" className="rounded-full mr-2">
              Search
            </Button>
          </form>
        </div>

        {/* ---------- RIGHT: Auth / Cart / Mobile Search ---------- */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 flex-shrink-0">
          {/* Mobile Search Trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden p-2 flex-shrink-0"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Profile/Login */}
          {isAuthenticated && user ? (
            <Popover open={profileOpen} onOpenChange={setProfileOpen}>
              <PopoverTrigger asChild>
                <button className="flex items-center justify-center rounded-full border border-border hover:shadow-sm transition p-1 flex-shrink-0">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.first_name || "User"}
                      className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-neutral-700" />
                  )}
                </button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-56 p-3 bg-white shadow-md rounded-lg border border-border fade-in"
              >
                <div className="space-y-2">
                  <div className="border-b pb-2">
                    <p className="font-semibold text-sm">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>

                  {/* 🔹 CONDITIONAL DASHBOARD LINK (ADD ABOVE PROFILE) */}
                  {(user.account_type === "vendor" ||
                    user.account_type === "admin") && (
                    <Link
                      to={user.account_type === "vendor" ? "/vendor" : "/admin"}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-2 py-1.5 text-sm hover:bg-gray-100 rounded"
                    >
                      <Layers className="h-4 w-4" />
                      Go to Dashboard
                    </Link>
                  )}

                  <Link
                    to={USER_ROUTES.PROFILE}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-2 py-1.5 text-sm hover:bg-gray-100 rounded"
                  >
                    <UserIcon className="h-4 w-4" />
                    Profile
                  </Link>

                  <Link
                    to={USER_ROUTES.ORDERS}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-2 py-1.5 text-sm hover:bg-gray-100 rounded"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Orders
                  </Link>

                  <Link
                    to={USER_ROUTES.CART}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-2 py-1.5 text-sm hover:bg-gray-100 rounded"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Cart
                  </Link>

                  <Link
                    to={USER_ROUTES.WISHLIST}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-2 py-1.5 text-sm hover:bg-gray-100 rounded"
                  >
                    <Heart className="h-4 w-4" />
                    Wishlist
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setProfileOpen(false);
                    }}
                    className="flex items-center gap-3 w-full text-left px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              <Link to={AUTH_ROUTES.LOGIN}>
                <Button
                  variant="outline"
                  className="rounded-full px-4 text-sm h-9"
                >
                  Sign In
                </Button>
              </Link>
              <Link to={AUTH_ROUTES.SIGNUP}>
                <Button className="rounded-full px-4 text-sm h-9 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Expand Search */}
      {searchOpen && (
        <div className="fixed top-[64px] left-0 w-full z-40 md:hidden bg-white border-b shadow-md px-4 py-3 fade-slide-down">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button size="sm" type="submit">
              Search
            </Button>
          </form>
        </div>
      )}
    </header>
  );
}
