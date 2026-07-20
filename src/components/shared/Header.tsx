import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SmartLink from "./SmartLink";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import {
  getBaseDomain,
  getSubdomain,
  areSubdomainsDisabled,
} from "@/utils/subdomain";
import { useLogoutMutation } from "@/services/authApi";
import { clearLocalCart } from "@/features/cartSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
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
  MessageSquare,
} from "lucide-react";
import { useTheme } from "./ThemeContext";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { AUTH_ROUTES, ACCOUNT_ROUTES, WEBSITE_ROUTES } from "@/routes";
import { toast } from "sonner";
import FancyHoverText from "./FancyTextHover";
import { CartDrawer } from "@/modules/website/components/cart/CartDrawer";
import { useGetCartQuery, useAddItemToCartMutation } from "@/services/cartApi";
import * as Pages from "@/routes/lazyPages";
import NavigationProgressBar from "./NavigationProgressBar";
import { Messages3 } from "iconsax-react";
import { useGetUserConversationsQuery } from "@/services/messagingApi";
import { setMobileMenuOpen, setCartOpen } from "@/features/uiSlice";
import { Logo } from "./Logo";

export default function Header() {
  const { isMobileMenuOpen, isCartOpen } = useSelector(
    (state: RootState) => state.ui,
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const location = useLocation();
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [query, setQuery] = useState("");
  const { theme, toggleTheme } = useTheme();

  const setMenuOpen = (open: boolean) => dispatch(setMobileMenuOpen(open));
  const setIsCartOpen = (open: boolean) => dispatch(setCartOpen(open));

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated,
  );
  const localCart = useSelector((state: RootState) => state.cart);

  const { data: cartData, refetch: refetchCart } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });
  const cartItemsCount = isAuthenticated
    ? cartData?.data?.cart?.items?.length || 0
    : localCart.localItems.length;

  const dispatch = useDispatch();
  const [addItemToCart] = useAddItemToCartMutation();

  const { data: convData } = useGetUserConversationsQuery(undefined, {
    skip: !isAuthenticated,
  });
  
  const unreadMessagesCount = useMemo(() => 
    convData?.data?.reduce((sum, conv) => sum + (conv.unread_count || 0), 0) || 0
  , [convData]);

  // Sync local cart to backend API when user logs in
  useEffect(() => {
    const syncCart = async () => {
      if (isAuthenticated && localCart.localItems.length > 0) {
        try {
          for (const item of localCart.localItems) {
            await addItemToCart({
              product_id: item.product_id,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
            }).unwrap();
          }
          dispatch(clearLocalCart());
          refetchCart();
          toast.success("Offline cart synchronized with your account.");
        } catch (error) {
          console.error("Failed to sync local cart", error);
        }
      }
    };
    syncCart();
  }, [isAuthenticated, localCart.localItems, addItemToCart, dispatch]);

  const subdomain = getSubdomain();
  const baseDomain = getBaseDomain();
  const isIndividualStoreSubdomain = useMemo(
    () => !!(subdomain && !["www", "vendor", "admin"].includes(subdomain)),
    [subdomain],
  );

  const navItems: {
    name: string;
    path: string;
    icon: React.ElementType;
    component: React.ComponentType;
    isExternal?: boolean;
  }[] = useMemo(
    () => [
      {
        name: "Home",
        path: isIndividualStoreSubdomain
          ? `${window.location.protocol}//${baseDomain}${WEBSITE_ROUTES.HOME}`
          : WEBSITE_ROUTES.HOME,
        icon: Home,
        component: Pages.LandingPage,
        isExternal: isIndividualStoreSubdomain,
      },
      {
        name: "Discover",
        path: isIndividualStoreSubdomain
          ? `${window.location.protocol}//${baseDomain}${WEBSITE_ROUTES.DISCOVERY}`
          : WEBSITE_ROUTES.DISCOVERY,
        icon: Compass,
        component: Pages.DiscoveryPage,
        isExternal: isIndividualStoreSubdomain,
      },
      {
        name: "Stores",
        path: isIndividualStoreSubdomain
          ? `${window.location.protocol}//${baseDomain}${WEBSITE_ROUTES.STORES}`
          : WEBSITE_ROUTES.STORES,
        icon: Store,
        component: Pages.StoresPage,
        isExternal: isIndividualStoreSubdomain,
      },
      {
        name: "Categories",
        path: isIndividualStoreSubdomain
          ? `${window.location.protocol}//${baseDomain}${WEBSITE_ROUTES.CATEGORIES}`
          : WEBSITE_ROUTES.CATEGORIES,
        icon: Layers,
        component: Pages.CategoriesPage,
        isExternal: isIndividualStoreSubdomain,
      },
    ],
    [isIndividualStoreSubdomain, baseDomain],
  );

  const user = useSelector((state: RootState) => state.user.currentUser);

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
      setIsLogoutModalOpen(false);
      // Wait for any redirection or clear state manually if needed
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
          "flex w-full items-center justify-between backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] px-4 sm:px-14 xl:px-16 py-2",
          "fixed top-0 left-0 right-0",
          "will-change-[transform,background-color,border-color,box-shadow]",
          isScrolled
            ? "max-w-full bg-white/95 dark:bg-neutral-950/95 border-b border-border/20 shadow-sm"
            : "max-w-full bg-white/70 dark:bg-neutral-950/70 border-b border-transparent",
        )}
      >
        {/* ---------- LEFT: Logo ---------- */}
        <div className="flex items-center flex-shrink-0">
          <Sheet open={isMobileMenuOpen} onOpenChange={setMenuOpen}>
            <SheetContent
              side="right"
              className="w-72 p-0 bg-white dark:bg-neutral-950 text-foreground border-l border-zinc-200 dark:border-white/10"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>
                  Access stores, categories, and your account settings.
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col h-full">
                {/* Sidebar Header: User Info */}
                {isAuthenticated && user && (
                  <div className="p-6 border-b border-zinc-100 dark:border-white/10 bg-zinc-50/50 dark:bg-neutral-900/50">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-sm overflow-hidden border border-zinc-200 dark:border-white/20">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.first_name || "User"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-primary flex items-center justify-center text-white font-bold text-xl uppercase">
                            {(user.first_name || user.email).charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate leading-tight text-foreground">
                          {user.first_name} {user.last_name}
                        </h3>
                        <p className="text-zinc-400 text-sm truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
                  <nav className="space-y-1">
                    {/* Premium Menu Items */}
                    {isAuthenticated && user && (
                      <>
                        {(user.account_type === "vendor" ||
                          user.account_type === "admin" ||
                          user.account_type === "staff") && (
                          <button
                            onClick={() => {
                              const target =
                                user.account_type === "vendor"
                                  ? "vendor"
                                  : user.account_type === "staff"
                                    ? "staff"
                                    : "admin";
                              if (areSubdomainsDisabled()) {
                                navigate(`/${target}`);
                              } else {
                                window.location.href = `${window.location.protocol}//${target}.${baseDomain}/`;
                              }
                              setMenuOpen(false);
                            }}
                            className="flex items-center gap-4 px-4 py-3 rounded-sm transition-all hover:bg-zinc-100 dark:hover:bg-white/5 group text-foreground font-bold"
                          >
                            <div className="p-2 rounded-sm bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                              <Layers className="h-5 w-5" />
                            </div>
                            <span className="text-base">Go to Dashboard</span>
                          </button>
                        )}

                        <SmartLink
                          to={ACCOUNT_ROUTES.PROFILE}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-4 px-4 py-3 rounded-sm transition-all hover:bg-zinc-100 dark:hover:bg-white/5 group text-foreground"
                        >
                          <div className="p-2 rounded-sm bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                            <UserIcon className="h-5 w-5" />
                          </div>
                          <span className="text-base font-medium">Profile</span>
                        </SmartLink>

                        <SmartLink
                          to={ACCOUNT_ROUTES.ORDERS}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-4 px-4 py-3 rounded-sm transition-all hover:bg-zinc-100 dark:hover:bg-white/5 group text-foreground"
                        >
                          <div className="p-2 rounded-sm bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                            <ShoppingBag className="h-5 w-5" />
                          </div>
                          <span className="text-base font-medium">Orders</span>
                        </SmartLink>

                        <SmartLink
                          to={WEBSITE_ROUTES.CART}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-4 px-4 py-3 rounded-sm transition-all hover:bg-zinc-100 dark:hover:bg-white/5 group text-foreground"
                        >
                          <div className="p-2 rounded-sm bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                            <ShoppingBag className="h-5 w-5" />
                          </div>
                          <span className="text-base font-medium">Cart</span>
                        </SmartLink>

                        <SmartLink
                          to={ACCOUNT_ROUTES.WISHLIST}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-4 px-4 py-3 rounded-sm transition-all hover:bg-zinc-100 dark:hover:bg-white/5 group text-foreground"
                        >
                          <div className="p-2 rounded-sm bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                            <Heart className="h-5 w-5" />
                          </div>
                          <span className="text-base font-medium">
                            Wishlist
                          </span>
                        </SmartLink>

                        <SmartLink
                          to={ACCOUNT_ROUTES.MESSAGES}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-4 px-4 py-3 rounded-sm transition-all hover:bg-zinc-100 dark:hover:bg-white/5 group text-foreground"
                        >
                          <div className="p-2 rounded-sm bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                            <MessageSquare className="h-5 w-5" />
                          </div>
                          <span className="text-base font-medium">Messages</span>
                        </SmartLink>
                      </>
                    )}

                    {!isAuthenticated && (
                      <>
                        <SmartLink
                          to={AUTH_ROUTES.LOGIN}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-4 px-4 py-3 rounded-sm transition-all hover:bg-primary/10 group text-foreground"
                        >
                          <div className="p-2 rounded-sm bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <UserIcon className="h-5 w-5" />
                          </div>
                          <span className="text-base font-bold">Sign In</span>
                        </SmartLink>

                        <SmartLink
                          to={AUTH_ROUTES.SIGNUP}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-4 px-4 py-3 rounded-sm transition-all hover:bg-emerald-500/10 group text-foreground"
                        >
                          <div className="p-2 rounded-sm bg-emerald-500/20 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                            <Store className="h-5 w-5" />
                          </div>
                          <span className="text-base font-bold">
                            Create Account
                          </span>
                        </SmartLink>
                      </>
                    )}
                  </nav>
                </div>

                {/* Sidebar Footer: Theme Toggle & Logout */}
                <div className="p-6 pb-24 sm:pb-6 border-t border-zinc-100 dark:border-white/10 space-y-4">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-sm bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 transition-all text-foreground"
                  >
                    <span className="text-sm font-medium">
                      {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </span>
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </button>

                  {isAuthenticated && (
                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="flex items-center gap-4 px-4 py-3 w-full rounded-sm bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all group"
                    >
                      <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                      <span className="text-base font-bold">Logout</span>
                    </button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          {isIndividualStoreSubdomain ? (
            <a
              href={`${window.location.protocol}//${baseDomain}${WEBSITE_ROUTES.HOME}`}
              className="flex items-center flex-shrink-0"
            >
              <Logo size="lg" />
            </a>
          ) : (
            <SmartLink
              to={WEBSITE_ROUTES.HOME}
              className="flex items-center flex-shrink-0"
            >
              <Logo size="lg" />
            </SmartLink>
          )}
        </div>

        {/* ---------- MIDDLE: Desktop Nav ---------- */}
        <div className="hidden lg:flex flex-1 justify-center px-4">
          <nav className="flex items-center gap-8 text-sm font-medium whitespace-nowrap">
            {navItems.slice(0, 4).map((item) =>
              item.isExternal ? (
                <a
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "transition-colors duration-200 relative inline-block group text-foreground hover:text-primary",
                  )}
                >
                  <FancyHoverText text={item.name} />
                </a>
              ) : (
                <SmartLink
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
                </SmartLink>
              ),
            )}
          </nav>
        </div>


        {/* ---------- MIDDLE: Search ---------- */}
        <div className="hidden md:flex flex-1 justify-center px-4 lg:px-6 max-w-[600px] mx-auto">
          <form
            onSubmit={handleSearch}
            className="flex w-full items-center rounded-sm bg-white dark:bg-neutral-900 border border-border/50 dark:border-white/10  focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-300"
          >
            <div className="pl-5 flex-shrink-0">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>

            <Input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0  bg-transparent py-3 focus-visible:ring-0 text-sm px-4 flex-1 min-w-0 placeholder:text-muted-foreground/70"
            />

            <Button
              type="submit"
              className="rounded-sm mr-1.5 h-8 px-5 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground  transition-all"
            >
              Search
            </Button>
          </form>
        </div>

        {/* ---------- RIGHT: Auth / Cart / Mobile Search ---------- */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-5 flex-shrink-0">
          {/* Mobile Search Trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden p-2 flex-shrink-0"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex relative p-2 flex-shrink-0"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5 text-foreground" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-sm bg-primary text-[10px] font-black text-white ring-2 ring-white dark:ring-neutral-900  tabular-nums transition-transform animate-in zoom-in-50 duration-300">
                  {cartItemsCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="p-2 flex-shrink-0"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-neutral-200" />
              ) : (
                <Moon className="h-5 w-5 text-neutral-800" />
              )}
            </Button>

            {isAuthenticated && (
              <button
                onClick={() => {
                  if (areSubdomainsDisabled()) {
                    navigate(ACCOUNT_ROUTES.MESSAGES);
                  } else {
                    const subdomain = getSubdomain();
                    if (subdomain && subdomain !== "vendor" && subdomain !== "admin") {
                      window.location.href = `${window.location.protocol}//${getBaseDomain()}${ACCOUNT_ROUTES.MESSAGES}`;
                    } else {
                      navigate(ACCOUNT_ROUTES.MESSAGES);
                    }
                  }
                }}
                className="relative group p-0"
              >
                <Button variant="ghost" size="icon" className="p-1.5 sm:p-2 flex-shrink-0 relative group">
                  <Messages3 
                    variant={unreadMessagesCount > 0 ? "Bold" : "Linear"} 
                    color="currentColor" 
                    className={cn(
                      "h-5 w-5 transition-colors group-hover:text-primary",
                      unreadMessagesCount > 0 ? "text-primary" : "text-foreground"
                    )} 
                  />
                  {unreadMessagesCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-sm bg-red-500 text-[10px] font-black text-white ring-2 ring-white dark:ring-neutral-900 tabular-nums animate-in zoom-in-50 duration-300">
                      {unreadMessagesCount > 9 ? "9+" : unreadMessagesCount}
                    </span>
                  )}
                </Button>
              </button>
            )}

            {/* Profile/Login */}
            {isAuthenticated && user ? (
              <Popover open={profileOpen} onOpenChange={setProfileOpen}>
                <PopoverTrigger asChild>
                  <button className="flex items-center justify-center rounded-sm border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all p-0.5 sm:p-1 flex-shrink-0 group mr-1 sm:mr-0">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.first_name || "User"}
                        className="h-8 w-8 sm:h-9 sm:w-9 rounded-sm object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <User className="h-6 w-6 text-neutral-700 dark:text-neutral-400 group-hover:text-emerald-400 transition-colors" />
                    )}
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  align="end"
                  className="w-56 p-3 bg-white dark:bg-neutral-950  rounded-sm border border-border dark:border-white/10 fade-in"
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
                      user.account_type === "admin" ||
                      user.account_type === "staff") && (
                      <button
                        onClick={() => {
                          const target =
                            user.account_type === "vendor"
                              ? "vendor"
                              : user.account_type === "staff"
                                ? "staff"
                                : "admin";
                          if (areSubdomainsDisabled()) {
                            navigate(`/${target}`);
                          } else {
                            window.location.href = `${window.location.protocol}//${target}.${baseDomain}/`;
                          }
                          setProfileOpen(false);
                        }}
                        className="flex items-center gap-3 px-2 py-1.5 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-sm transition-colors"
                      >
                        <Layers className="h-4 w-4" />
                        Go to Dashboard
                      </button>
                    )}

                    <SmartLink
                      to={ACCOUNT_ROUTES.PROFILE}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-sm transition-colors"
                    >
                      <UserIcon className="h-4 w-4" />
                      Profile
                    </SmartLink>

                    <SmartLink
                      to={ACCOUNT_ROUTES.ORDERS}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-sm transition-colors"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Orders
                    </SmartLink>

                    <SmartLink
                      to={WEBSITE_ROUTES.CART}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-sm transition-colors"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Cart
                    </SmartLink>

                    <SmartLink
                      to={ACCOUNT_ROUTES.WISHLIST}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-sm transition-colors"
                    >
                      <Heart className="h-4 w-4" />
                      Wishlist
                    </SmartLink>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        setIsLogoutModalOpen(true);
                      }}
                      className="flex items-center gap-3 w-full text-left px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-sm transition-colors"
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
                  <SmartLink
                    to={`${AUTH_ROUTES.LOGIN}?redirect=${encodeURIComponent(
                      location.pathname + location.search,
                    )}`}
                  >
                    <Button
                      variant="outline"
                      className="rounded-sm px-3 text-xs h-8"
                    >
                      Sign In
                    </Button>
                  </SmartLink>
                  <SmartLink
                    to={`${AUTH_ROUTES.SIGNUP}?redirect=${encodeURIComponent(
                      location.pathname + location.search,
                    )}`}
                  >
                    <Button className="rounded-sm px-3 text-xs h-8 text-white">
                      Sign Up
                    </Button>
                  </SmartLink>
                </div>

                {/* Mobile/Medium Profile Icon (Login Link) */}
                <SmartLink
                  to={`${AUTH_ROUTES.LOGIN}?redirect=${encodeURIComponent(
                    location.pathname + location.search,
                  )}`}
                  className="lg:hidden flex items-center justify-center rounded-sm border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all p-1 flex-shrink-0 group"
                >
                  <User className="h-6 w-6 text-foreground group-hover:text-emerald-400 transition-colors" />
                </SmartLink>
              </>
            )}
          </div>
        </div>
        <NavigationProgressBar />
      </nav>

      {/* Mobile Expand Search */}
      {searchOpen && (
        <div className="fixed top-[64px] left-0 w-full z-40 md:hidden bg-white dark:bg-neutral-900 border-b dark:border-white/10  px-4 py-4 fade-slide-down">
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

      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of your account? You will need to
              sign back in to access your orders and wishlist.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-3 sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline" disabled={isLoggingOut}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleLogout}
              isLoading={isLoggingOut}
              loadingText="Logging out..."
            >
              Yes, Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
