import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils";

import { AUTH_ROUTES, USER_ROUTES, WEBSITE_ROUTES } from "@/routes/temp";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Header() {
  const dispatch = useDispatch();
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const [logout] = useLogoutMutation();
  const [query, setQuery] = useState("");

  console.log(searchOpen);

  const user = useSelector((state: RootState) => state.user.currentUser);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          "flex w-full items-center justify-between gap-3 backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] px-4 sm:px-6 py-3",
          "fixed top-0 left-1/2 -translate-x-1/2",
          isScrolled
            ? "sm:max-w-[95%] bg-white/80 rounded-xl shadow-md sm:top-3 border border-border/20 fade-in"
            : "sm:max-w-[100%] bg-white/30 sm:top-3 border border-transparent"
        )}
      >

        {/* ---------- LEFT: Logo + Desktop Nav ---------- */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Mobile Menu */}
          <div className="flex sm:hidden">
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
                        "transition-all duration-200 hover:scale-[1.04]"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}

                  <div className="border-t my-3" />

                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        handleLogout()
                        setMenuOpen(false)
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
          <Link to={WEBSITE_ROUTES.HOME} className="flex items-center gap-2">
            <img
              src="/logos/inline-stripe-transparent.png"
              alt="EasyStore logo"
              className="h-10 w-auto sm:h-12"
              loading="lazy"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
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
                  location.pathname === item.path
                    ? "text-primary font-semibold"
                    : "text-neutral-800 hover:text-primary"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* ---------- MIDDLE: Search (Desktop & Tablet) ---------- */}
        <div className="hidden md:flex flex-1 justify-center px-2">
          <form
            onSubmit={handleSearch}
            className="flex w-full max-w-[600px] items-center rounded-full bg-white border border-border/40 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-primary/30"
          >
            <div className="pl-3">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>

            <Input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-none bg-transparent focus-visible:ring-0 text-sm px-3 flex-1"
            />

            <div className="h-6 w-px bg-border/40 mx-2" />

            <Select defaultValue="products">
              <SelectTrigger className="border-none bg-transparent text-sm px-3">
                <SelectValue placeholder="Products" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="products">Products</SelectItem>
                <SelectItem value="stores">Stores</SelectItem>
                <SelectItem value="brands">Brands</SelectItem>
              </SelectContent>
            </Select>
          </form>
        </div>

        {/* ---------- RIGHT: Auth / Cart / Mobile Search ---------- */}
        <div className="flex items-center gap-3 flex-shrink-0">

          {/* Mobile Search Trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden p-2"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-6 w-6" />
          </Button>

          {/* Profile/Login */}
          {isAuthenticated && user ? (
            <Popover open={profileOpen} onOpenChange={setProfileOpen}>
              <PopoverTrigger asChild>
                <button className="flex items-center justify-center rounded-full border border-border hover:shadow-sm transition p-1">
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
                {/* user info + menu */}
                …
              </PopoverContent>
            </Popover>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to={AUTH_ROUTES.LOGIN}>
                <Button variant="outline" className="rounded-full px-4">
                  Sign In
                </Button>
              </Link>
              <Link to={AUTH_ROUTES.SIGNUP}>
                <Button className="rounded-full px-4 text-white">Sign Up</Button>
              </Link>
            </div>
          )}

        </div>
      </nav>

      {/* ✅ Mobile Expand Search */}
      {searchOpen && (
        <div className="fixed top-[64px] left-0 w-full z-40 md:hidden bg-white border-b shadow-md px-4 py-3 fade-slide-down">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button size="sm">Search</Button>
          </form>
        </div>
      )}


    </header>
  )


}
