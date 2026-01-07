import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { clearUser } from "@/features/userSlice";
import { useLogoutMutation } from "@/services/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, User, Search } from "lucide-react";
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
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("products");
  const location = useLocation();
  const [logout] = useLogoutMutation();
  const [query, setQuery] = useState("");

  const user = useSelector((state: RootState) => state.user.currentUser);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
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
    await logout();
    dispatch(clearUser());
    toast.success("Logged out successfully");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info(`Searching for: ${query}`);
    setSearchOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      )}
    >
      <nav
        className={cn(
          "flex w-full items-center justify-between backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] px-4 sm:px-6 py-3",
          "fixed top-0 left-1/2 -translate-x-1/2",
          "will-change-[transform,background-color,border-color,box-shadow]",
          isScrolled
            ? "max-w-[100%] sm:max-w-[95%] bg-white/80 rounded-none sm:rounded-xl shadow-md sm:top-3 border border-border/20"
            : "max-w-[100%] bg-white/30 sm:top-3 border border-transparent"
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
                    { name: "Home", path: WEBSITE_ROUTES.HOME },
                    { name: "Shop", path: WEBSITE_ROUTES.SHOP },
                    { name: "Categories", path: WEBSITE_ROUTES.CATEGORIES },
                    { name: "About", path: WEBSITE_ROUTES.ABOUT },
                  ].map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        location.pathname === item.path
                          ? "text-primary font-semibold"
                          : "text-neutral-800 hover:text-primary",
                        "transition-all duration-200 hover:scale-[1.04] block"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}

                  <div className="border-t my-3" />

                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="text-red-600 py-2 text-left w-full"
                    >
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link
                        to={AUTH_ROUTES.LOGIN}
                        onClick={() => setMenuOpen(false)}
                        className="block py-2"
                      >
                        Sign In
                      </Link>
                      <Link
                        to={AUTH_ROUTES.SIGNUP}
                        onClick={() => setMenuOpen(false)}
                        className="block py-2 text-primary"
                      >
                        Sign Up
                      </Link>
                    </>
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
              { name: "Shop", path: WEBSITE_ROUTES.SHOP },
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
                    : "text-neutral-800 hover:text-primary"
                )}
              >
                <FancyHoverText text={item.name} />
              </Link>
            ))}
          </nav>
        </div>

        {/* ---------- MIDDLE: Search ---------- */}
        <div className="hidden md:flex flex-1 justify-center px-4 lg:px-6 max-w-[500px]">
          <div className="flex w-full items-center rounded-full bg-white border-2 border-border/40 overflow-hidden shadow-sm focus-within:ring-1 focus-within:ring-primary/10 transition-all">
            <div className="pl-4 flex-shrink-0">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>

            <Input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(e);
                }
              }}
              className="border-0 shadow-none bg-white py-6 focus-visible:ring-0 text-sm px-3 flex-1 min-w-0"
            />

            <div className="h-6 w-px bg-border/40 mx-2 flex-shrink-0" />

            <div className="flex-shrink-0 pr-2">
              <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                <PopoverTrigger asChild>
                  <button className="flex items-center justify-between gap-2 h-auto border-none bg-transparent text-sm px-2 text-neutral-700 hover:text-neutral-900 transition-colors capitalize min-w-[90px]">
                    <span className="truncate">{selectedFilter}</span>
                    <svg
                      className={cn(
                        "h-4 w-4 flex-shrink-0 transition-transform duration-200",
                        filterOpen && "rotate-180"
                      )}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  sideOffset={8}
                  className="w-[140px] p-2 bg-white border border-border/40 shadow-lg rounded-lg"
                >
                  <div className="flex flex-col gap-1">
                    {["products", "stores", "brands"].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setSelectedFilter(filter);
                          setFilterOpen(false);
                        }}
                        className={cn(
                          "px-3 py-2 text-sm text-left rounded-md transition-colors capitalize",
                          selectedFilter === filter
                            ? "bg-black text-white font-medium"
                            : "text-neutral-700 hover:bg-gray-100"
                        )}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
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
                  <Link
                    to={USER_ROUTES.PROFILE}
                    onClick={() => setProfileOpen(false)}
                    className="block px-2 py-1.5 text-sm hover:bg-gray-100 rounded"
                  >
                    Profile
                  </Link>
                  <Link
                    to={USER_ROUTES.ORDERS}
                    onClick={() => setProfileOpen(false)}
                    className="block px-2 py-1.5 text-sm hover:bg-gray-100 rounded"
                  >
                    Orders
                  </Link>
                  <Link
                    to={USER_ROUTES.CART}
                    onClick={() => setProfileOpen(false)}
                    className="block px-2 py-1.5 text-sm hover:bg-gray-100 rounded"
                  >
                    Cart
                  </Link>
                  <Link
                    to={USER_ROUTES.WISHLIST}
                    onClick={() => setProfileOpen(false)}
                    className="block px-2 py-1.5 text-sm hover:bg-gray-100 rounded"
                  >
                    Wishlist
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
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
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(e);
                }
              }}
              className="flex-1"
              autoFocus
            />
            <Button size="sm" type="button" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
