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
  LogOut,
  User,
  Heart,
  Settings,
  ShoppingCart,
  Package,
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
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AUTH_ROUTES, USER_ROUTES, WEBSITE_ROUTES } from "@/routes/temp";
import { toast } from "sonner";

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
        "fixed top-0 z-20 w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      )}
    >
      <nav
        className={cn(
          "w-full fixed top-0 sm:top-3 left-1/2 -translate-x-1/2 flex items-center justify-between backdrop-blur-md border border-transparent px-7 py-4 transition-all duration-500",
          isScrolled
            ? "sm:max-w-[98%] sm:bg-white/60 rounded-2xl sm:border-border/10 sm:shadow-sm sm:py-3 sm:px-6"
            : "sm:max-w-[100%] sm:bg-white/20 sm:py-5 sm:px-8"
        )}
      >
        {/* Left: Logo & Nav */}
        <div className="flex items-center gap-10">
          <Link to={WEBSITE_ROUTES.HOME} className="flex items-center gap-2">
            <img
              src="/logos/inline-stripe-transparent.png"
              alt="EasyStore logo"
              className="h-12 w-auto"
              loading="lazy"
            />
          </Link>

          <nav className="hidden sm:flex items-center gap-7 text-sm font-medium">
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

        {/* Middle: Search Bar (desktop only) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-white border border-border/30 rounded-full overflow-hidden w-[370px] lg:w-[460px] shadow-sm transition-all focus-within:ring-1 focus-within:ring-primary/20"
        >
          <div className="pl-4 flex items-center justify-center">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>

          <Input
            type="text"
            placeholder="Search for products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-none bg-transparent focus-visible:ring-0 text-sm placeholder:text-muted-foreground px-3 flex-1"
          />

          <div className="h-6 w-px bg-border/50 mx-2" />

          <Select defaultValue="products">
            <SelectTrigger className="border-none bg-transparent text-sm font-medium focus:ring-0 focus:outline-none text-foreground px-3 rounded-r-full hover:bg-muted/40 transition-colors">
              <SelectValue placeholder="Products" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="products">Products</SelectItem>
              <SelectItem value="stores">Stores</SelectItem>
              <SelectItem value="brands">Brands</SelectItem>
            </SelectContent>
          </Select>
        </form>

        {/* Right: Auth/Profile + Mobile Search */}
        <div className="flex items-center gap-3">
          {/* Auth/Profile */}
          {isAuthenticated && user ? (
            <Popover open={profileOpen} onOpenChange={setProfileOpen}>
              <PopoverTrigger asChild>
                <button className="flex items-center justify-center rounded-full border border-border hover:shadow-sm transition-all p-0.5">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.first_name || "User"}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-neutral-700" />
                  )}
                </button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-56 p-3 mt-2 bg-white shadow-md rounded-lg border border-border"
              >
                <div className="flex items-center gap-3 border-b border-border/20 pb-3 mb-2">
                  <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center bg-neutral-100">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.first_name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-neutral-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {user.first_name ?? "User"}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>

                <nav className="space-y-1 text-sm">
                  <Link
                    to={USER_ROUTES.ORDERS}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50"
                  >
                    <Package className="h-4 w-4 text-gray-600" /> My Orders
                  </Link>

                  <Link
                    to="/cart"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50"
                  >
                    <ShoppingCart className="h-4 w-4 text-gray-600" /> My Cart
                  </Link>

                  <Link
                    to={USER_ROUTES.WISHLIST}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50"
                  >
                    <Heart className="h-4 w-4 text-gray-600" /> Wishlist
                  </Link>

                  <Link
                    to={WEBSITE_ROUTES.SETTINGS}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50"
                  >
                    <Settings className="h-4 w-4 text-gray-600" /> Settings
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-red-50 text-red-600 mt-2"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </nav>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link to={AUTH_ROUTES.LOGIN}>
                  <Button variant="outline" className="rounded-full px-5">
                    Sign In
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to={AUTH_ROUTES.SIGNUP}>
                  <Button className="rounded-full px-5 bg-primary text-white hover:bg-primary/90">
                    Sign Up
                  </Button>
                </Link>
              </motion.div>
            </div>
          )}

          {/* Mobile Menu (Popover Style) */}
          <div className="sm:hidden">
            <Popover open={menuOpen} onOpenChange={setMenuOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="p-2">
                  <Menu className="h-6 w-6 text-neutral-700" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-56 mt-2 p-3 bg-white shadow-md rounded-lg border border-border"
              >
                <nav className="space-y-2 text-sm">
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
                        "block px-3 py-2 rounded-md hover:bg-muted/30"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}

                  <div className="border-t border-border/20 my-2"></div>

                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-50 text-red-600"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  ) : (
                    <>
                      <Link
                        to={AUTH_ROUTES.LOGIN}
                        onClick={() => setMenuOpen(false)}
                        className="block px-3 py-2 rounded-md hover:bg-muted/30 text-neutral-800"
                      >
                        Sign In
                      </Link>
                      <Link
                        to={AUTH_ROUTES.SIGNUP}
                        onClick={() => setMenuOpen(false)}
                        className="block px-3 py-2 rounded-md hover:bg-muted/30 text-primary font-medium"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </nav>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </nav>
    </header>
  );
}
