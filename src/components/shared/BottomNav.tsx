import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Home, Discover, ShoppingBag, User, Briefcase } from "iconsax-react";
import { cn } from "@/lib/utils";
import { WEBSITE_ROUTES, AUTH_ROUTES } from "@/routes";
import { motion } from "framer-motion";

import {
  preloadDiscoveryPage,
  preloadUserProfilePage,
  preloadSettingsPage,
  preloadWishlistPage,
} from "@/routes/lazyPages";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setMobileMenuOpen } from "@/features/uiSlice";
import { useGetCartQuery } from "@/services/cartApi";


export function BottomNav() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated,
  );
  const user = useSelector((state: RootState) => state.user.currentUser);
  const localCart = useSelector((state: RootState) => state.cart);

  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  const cartItemsCount = isAuthenticated
    ? cartData?.data?.cart?.items?.length || 0
    : localCart.localItems.length;

  const handleMoreClick = () => {
    if (isAuthenticated) {
      dispatch(setMobileMenuOpen(true));
    } else {
      navigate(AUTH_ROUTES.LOGIN);
    }
  };

  // 🚀 Auto-preload mobile routes on mount
  useEffect(() => {
    const triggerPreloads = async () => {
      try {
        // Preload primary and secondary mobile destinations
        await Promise.allSettled([
          preloadDiscoveryPage(),
          // preloadOrdersPage(), // Replaced by Cart
          preloadUserProfilePage(),
          preloadSettingsPage(),
          preloadWishlistPage(),
        ]);
        console.log("Mobile routes preloaded successfully");
      } catch (err) {
        console.warn("Preloading failed partially", err);
      }
    };

    triggerPreloads();
  }, []);

  const navItems = [
    { name: "Home", path: WEBSITE_ROUTES.HOME, icon: Home },
    { name: "Discover", path: WEBSITE_ROUTES.DISCOVERY, icon: Discover },
    { name: "Cart", path: WEBSITE_ROUTES.CART, icon: ShoppingBag },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-[100] w-full lg:hidden bg-background/80 backdrop-blur-xl border-t border-border/50 pb-safe-offset-2">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all duration-300 relative",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "p-1.5 rounded-sm transition-colors relative",
                  isActive && "bg-primary/10",
                )}
              >
                <Icon
                  variant={isActive ? "Bold" : "Outline"}
                  color="currentColor"
                  size={20}
                />
                {item.name === "Cart" && cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-sm bg-primary text-[10px] font-black text-white ring-2 ring-white dark:ring-neutral-900 tabular-nums transition-transform animate-in zoom-in-50 duration-300">
                    {cartItemsCount}
                  </span>
                )}
              </motion.div>
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {item.name}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 w-6 h-1 bg-primary rounded-t-full"
                />
              )}
            </NavLink>
          );
        })}

        {/* MORE / PROFILE TAB */}
        <button
          onClick={handleMoreClick}
          className="flex flex-col items-center justify-center gap-1 min-w-[64px] text-muted-foreground hover:text-foreground transition-all duration-300"
        >
          <motion.div whileTap={{ scale: 0.9 }} className="p-1.5 rounded-sm">
            {isAuthenticated && user?.avatar ? (
              <div className="h-6 w-6 rounded-sm overflow-hidden border border-border">
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : isAuthenticated &&
              (user?.account_type === "vendor" ||
                user?.account_type === "admin") ? (
              <Briefcase variant="Outline" color="currentColor" size={20} />
            ) : (
              <User variant="Outline" color="currentColor" size={20} />
            )}
          </motion.div>
          <span className="text-[10px] font-bold uppercase tracking-widest">
            More
          </span>
        </button>
      </div>
    </nav>
  );
}
