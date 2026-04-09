import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Home, Compass, ShoppingBag, User, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { WEBSITE_ROUTES, ACCOUNT_ROUTES as USER_ROUTES, AUTH_ROUTES } from "@/routes";
import { motion } from "framer-motion";

import { setMobileMenuOpen } from "@/features/uiSlice";
import { useDispatch } from "react-redux";

export function BottomNav() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated,
  );
  const user = useSelector((state: RootState) => state.user.currentUser);

  const handleMoreClick = () => {
    if (isAuthenticated) {
      dispatch(setMobileMenuOpen(true));
    } else {
      navigate(AUTH_ROUTES.LOGIN);
    }
  };

  const navItems = [
    { name: "Home", path: WEBSITE_ROUTES.HOME, icon: Home },
    { name: "Discover", path: WEBSITE_ROUTES.DISCOVERY, icon: Compass },
    { name: "Orders", path: USER_ROUTES.ORDERS, icon: ShoppingBag },
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
                  "p-1.5 rounded-sm transition-colors",
                  isActive && "bg-primary/10",
                )}
              >
                <Icon className="h-5 w-5" />
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
              <Briefcase className="h-5 w-5" />
            ) : (
              <User className="h-5 w-5" />
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
