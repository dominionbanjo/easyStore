"use client";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { clearUser } from "@/features/userSlice";
import { useLogoutMutation } from "@/services/authApi";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Menu,
  LogOut,
  User,
  Heart,
  Settings,
  ShoppingCart,
  Package,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AUTH_ROUTES, USER_ROUTES, WEBSITE_ROUTES } from "@/routes/temp";
import { toast } from "sonner";

export default function Header() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const [logout] = useLogoutMutation();

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
            ? "sm:max-w-[98%] sm:bg-white/50 rounded-2xl sm:border-border/10 sm:shadow-sm sm:py-3 sm:px-6"
            : "sm:max-w-[100%] sm:bg-white/10 sm:py-5 sm:px-8"
        )}
      >
        {/* Left */}
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

        {/* Right */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <Popover>
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
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50"
                  >
                    <Package className="h-4 w-4 text-gray-600" /> My Orders
                  </Link>

                  <Link
                    to="/cart" // ❗ add USER_ROUTES.CART later
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50"
                  >
                    <ShoppingCart className="h-4 w-4 text-gray-600" /> My Cart
                  </Link>

                  <Link
                    to={USER_ROUTES.WISHLIST}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50"
                  >
                    <Heart className="h-4 w-4 text-gray-600" /> Wishlist
                  </Link>

                  <Link
                    to={WEBSITE_ROUTES.SETTINGS}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50"
                  >
                    <Settings className="h-4 w-4 text-gray-600" /> Settings
                  </Link>

                  <button
                    onClick={handleLogout}
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

          {/* Mobile Menu */}
          <div className="sm:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="p-2">
                  <Menu className="h-6 w-6 text-neutral-700" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-card flex flex-col">
                <SheetHeader className="pt-4 pb-2 border-b border-border/10">
                  <SheetTitle className="flex items-center gap-2 text-primary font-bold text-xl">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    Easy<span className="text-secondary">Store</span>
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-4 mt-6 px-4 text-base font-medium">
                  {[
                    { name: "Home", path: WEBSITE_ROUTES.HOME },
                    { name: "Shop", path: WEBSITE_ROUTES.SHOP },
                    { name: "Categories", path: WEBSITE_ROUTES.CATEGORIES },
                    { name: "About", path: WEBSITE_ROUTES.ABOUT },
                  ].map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setOpen(false)}
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

                <div className="mt-8 px-4 flex flex-col gap-3">
                  {isAuthenticated ? (
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="rounded-full"
                    >
                      Logout
                    </Button>
                  ) : (
                    <>
                      <Link
                        to={AUTH_ROUTES.LOGIN}
                        onClick={() => setOpen(false)}
                      >
                        <Button
                          variant="outline"
                          className="w-full rounded-full border-border hover:bg-neutral-100"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link
                        to={AUTH_ROUTES.SIGNUP}
                        onClick={() => setOpen(false)}
                      >
                        <Button className="w-full rounded-full bg-primary text-white hover:bg-primary/90">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
