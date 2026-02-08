import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
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
  LogOut,
  ShoppingBag,
  Heart,
  User as UserIcon,
  X,
  Sun,
  Moon,
  Compass,
} from "lucide-react";
import { useTheme } from "./ThemeContext";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import { AUTH_ROUTES, USER_ROUTES, WEBSITE_ROUTES } from "@/routes/temp";
import { toast } from "sonner";
import { motion } from "framer-motion";
import FancyHoverText from "./FancyTextHover";
import { CartDrawer } from "@/modules/website/components/cart/CartDrawer";
import { useGetCartQuery } from "@/services/cartApi";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const [logoutUser] = useLogoutMutation();
  const [query, setQuery] = useState("");
  const { theme, toggleTheme } = useTheme();

  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !useSelector((state: RootState) => state.user.isAuthenticated),
  });
  const cartItemsCount = cartData?.data?.cart?.items?.length || 0;

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
            ? "max-w-[100%] sm:max-w-[95%] bg-white/80 dark:bg-neutral-900/80 rounded-none sm:rounded-xl shadow-md sm:top-3 border border-border/20"
            : "max-w-[100%] bg-white/30 dark:bg-neutral-900/30 sm:top-3 border border-transparent",
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
                    <Menu className="h-6 w-6 text-foreground" />
                  </motion.div>
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-64 p-0 bg-white dark:bg-neutral-950 border-r dark:border-white/10"
              >
                <SheetHeader className="p-6 border-b dark:border-white/10 flex flex-row items-center justify-between">
                  <div>
                    <SheetTitle>Navigation Menu</SheetTitle>
                    <SheetDescription className="sr-only">
                      Access secondary navigation links and user account
                      options.
                    </SheetDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="p-2"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5 text-neutral-200" />
                    ) : (
                      <Moon className="h-5 w-5 text-neutral-800" />
                    )}
                  </Button>
                </SheetHeader>
                <div className="p-6">
                  <nav className="space-y-4 text-base font-medium">
                    {[
                      { name: "Home", path: WEBSITE_ROUTES.HOME, icon: Home },
                      {
                        name: "Discover",
                        path: WEBSITE_ROUTES.DISCOVERY,
                        icon: Compass,
                      },
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
                              : "text-foreground hover:text-primary",
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
                          className="flex items-center gap-3 py-2 text-foreground hover:text-primary"
                        >
                          <UserIcon className="h-4 w-4" />
                          Sign In
                        </Link>

                        <Link
                          to={AUTH_ROUTES.SIGNUP}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 py-2 text-foreground hover:text-primary"
                        >
                          <Store className="h-4 w-4" />
                          Create Account
                        </Link>
                      </div>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link
            to={WEBSITE_ROUTES.HOME}
            className="flex items-center flex-shrink-0"
          >
            <img
              src={
                theme === "dark"
                  ? "/logos/EasyStore logo with tagline.png"
                  : "/logos/inline-stripe-transparent.png"
              }
              alt="EasyStore logo"
              className={cn(
                "w-auto transition-all duration-300 object-contain",
                theme === "dark"
                  ? "h-10 sm:h-11 lg:h-12"
                  : "h-9 sm:h-10 lg:h-11",
              )}
              loading="lazy"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium whitespace-nowrap">
            {[
              { name: "Home", path: WEBSITE_ROUTES.HOME },
              { name: "Discover", path: WEBSITE_ROUTES.DISCOVERY },
              { name: "Stores", path: WEBSITE_ROUTES.STORES },
              { name: "Categories", path: WEBSITE_ROUTES.CATEGORIES },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "transition-colors duration-200 relative inline-block group",
                  location.pathname === item.path
                    ? "text-primary font-semibold"
                    : "text-foreground hover:text-primary",
                )}
              >
                <FancyHoverText text={item.name} />
              </Link>
            ))}
          </nav>
        </div>

        {/* ---------- MIDDLE: Search ---------- */}
        <div className="hidden md:flex flex-1 justify-center px-4 lg:px-6 max-w-[600px] mx-auto">
          <form
            onSubmit={handleSearch}
            className="flex w-full items-center rounded-full bg-white dark:bg-neutral-900 border border-border/50 dark:border-white/10 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-300"
          >
            <div className="pl-5 flex-shrink-0">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>

            <Input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 shadow-none bg-transparent py-6 focus-visible:ring-0 text-base px-4 flex-1 min-w-0 placeholder:text-muted-foreground/70"
            />

            <Button
              type="submit"
              className="rounded-full mr-1.5 h-10 px-6 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all"
            >
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

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                className="relative p-2 flex-shrink-0"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="h-5 w-5 text-foreground" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white ring-2 ring-white dark:ring-neutral-900 shadow-sm tabular-nums transition-transform animate-in zoom-in-50 duration-300">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hidden sm:flex p-2 flex-shrink-0"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-neutral-200" />
              ) : (
                <Moon className="h-5 w-5 text-neutral-800" />
              )}
            </Button>

            {/* Profile/Login */}
            {isAuthenticated && user ? (
              <Popover open={profileOpen} onOpenChange={setProfileOpen}>
                <PopoverTrigger asChild>
                  <button className="flex items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all p-1 flex-shrink-0 group">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.first_name || "User"}
                        className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <User className="h-6 w-6 text-neutral-700 dark:text-neutral-400 group-hover:text-emerald-400 transition-colors" />
                    )}
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  align="end"
                  className="w-56 p-3 bg-white dark:bg-neutral-950 shadow-md rounded-lg border border-border dark:border-white/10 fade-in"
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

                    {/* 🔹 CONDITIONAL DASHBOARD LINK */}
                    {(user.account_type === "vendor" ||
                      user.account_type === "admin") && (
                      <Link
                        to={
                          user.account_type === "vendor" ? "/vendor" : "/admin"
                        }
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 rounded transition-colors"
                      >
                        <Layers className="h-4 w-4" />
                        Go to Dashboard
                      </Link>
                    )}

                    <Link
                      to={USER_ROUTES.PROFILE}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 rounded transition-colors"
                    >
                      <UserIcon className="h-4 w-4" />
                      Profile
                    </Link>

                    <Link
                      to={USER_ROUTES.ORDERS}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 rounded transition-colors"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Orders
                    </Link>

                    <Link
                      to={USER_ROUTES.CART}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 rounded transition-colors"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Cart
                    </Link>

                    <Link
                      to={USER_ROUTES.WISHLIST}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 rounded transition-colors"
                    >
                      <Heart className="h-4 w-4" />
                      Wishlist
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        setProfileOpen(false);
                      }}
                      className="flex items-center gap-3 w-full text-left px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <>
                {/* Desktop Buttons */}
                <div className="hidden lg:flex items-center gap-2">
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

                {/* Mobile/Medium Profile Icon (Login Link) */}
                <Link
                  to={AUTH_ROUTES.LOGIN}
                  className="lg:hidden flex items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all p-1 flex-shrink-0 group"
                >
                  <User className="h-6 w-6 text-foreground group-hover:text-emerald-400 transition-colors" />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Expand Search */}
      {searchOpen && (
        <div className="fixed top-[64px] left-0 w-full z-40 md:hidden bg-white dark:bg-neutral-900 border-b dark:border-white/10 shadow-md px-4 py-4 fade-slide-down">
          <form onSubmit={handleSearch} className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 h-10 bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary/20"
                autoFocus
              />
            </div>
            <Button
              size="sm"
              type="submit"
              className="bg-primary text-primary-foreground h-10 px-4"
            >
              Search
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-destructive"
              onClick={() => setSearchOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </form>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
