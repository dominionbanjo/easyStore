"use client";

import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  User,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "My Store", icon: Package, path: "/dashboard/store" },
  { label: "Orders", icon: ShoppingBag, path: "/dashboard/orders" },
  { label: "Profile", icon: User, path: "/dashboard/profile" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white shadow-md border-r border-border flex flex-col">
      <div className="px-6 py-6 text-2xl font-bold text-primary">
        Easy<span className="text-secondary">Store</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-3">
        {links.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50 text-xs text-center text-muted-foreground">
        © 2025 EasyStore
      </div>
    </aside>
  );
}
