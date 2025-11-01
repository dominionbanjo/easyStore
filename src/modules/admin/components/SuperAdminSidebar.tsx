import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  DollarSign,
  Shield,
  Settings,
  BarChart3,
  Bell,
  FileWarning,
  ServerCog,
  ClipboardList,
  Store,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { label: "Overview", icon: LayoutDashboard, to: "/admin" },
  { label: "Vendors", icon: Store, to: "/admin/vendors" },
  { label: "Users", icon: Users, to: "/admin/users" },
  { label: "Transactions", icon: DollarSign, to: "/admin/transactions" },
  { label: "Reports", icon: FileWarning, to: "/admin/reports" },
  { label: "System Logs", icon: ClipboardList, to: "/admin/logs" },
  { label: "Notifications", icon: Bell, to: "/admin/notifications" },
  { label: "Platform Analytics", icon: BarChart3, to: "/admin/analytics" },
  { label: "Access Control", icon: Shield, to: "/admin/access-control" },
  { label: "Settings", icon: Settings, to: "/admin/settings" },
  { label: "Server Config", icon: ServerCog, to: "/admin/system" },
];

interface Props {
  open: boolean;
  onToggle: () => void;
}

export default function SuperAdminSidebar({ open, onToggle }: Props) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-border/30 bg-card text-card-foreground",
          "fixed left-0 top-0 h-screen w-[260px] z-30"
        )}
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-border/20">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">Super Admin</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-2 mt-4">
          {menuItems.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={label}
              to={to}
              end
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  isActive && "bg-muted text-foreground font-medium"
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onToggle}
              className="fixed inset-0 bg-black/70 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className={cn(
                "flex flex-col border-r border-border/30 bg-card text-card-foreground",
                "fixed left-0 top-0 h-screen w-[260px] z-50 md:hidden"
              )}
            >
              <div className="flex items-center justify-between px-4 py-5 border-b border-border/20">
                <div className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-primary" />
                  <span className="font-semibold text-lg">Super Admin</span>
                </div>
              </div>

              <nav className="flex flex-col gap-1 px-2 mt-4">
                {menuItems.map(({ label, icon: Icon, to }) => (
                  <NavLink
                    key={label}
                    to={to}
                    end
                    onClick={onToggle}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                        "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "bg-muted text-foreground font-medium"
                      )
                    }
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
