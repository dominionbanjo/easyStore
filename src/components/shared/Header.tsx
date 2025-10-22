"use client";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ───────────── Magnetic link ─────────────
  const MagneticLink = ({
    name,
    path,
    active,
  }: {
    name: string;
    path: string;
    active: boolean;
  }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotate = useTransform(x, [-20, 20], [-2, 2]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - rect.width / 2;
      const offsetY = e.clientY - rect.top - rect.height / 2;
      animate(x, offsetX * 0.2, { type: "spring", stiffness: 180, damping: 15 });
      animate(y, offsetY * 0.2, { type: "spring", stiffness: 180, damping: 15 });
    };

    const handleMouseLeave = () => {
      animate(x, 0, { type: "spring", stiffness: 180, damping: 20 });
      animate(y, 0, { type: "spring", stiffness: 180, damping: 20 });
    };

    return (
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x, y, rotate }}
        className="relative group cursor-pointer"
      >
        <Link
          to={path}
          className={cn(
            "relative inline-block px-1 py-0.5 focus:outline-none transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            active
              ? "text-primary font-semibold"
              : "text-neutral-800 dark:text-neutral-200 hover:text-primary focus:text-primary"
          )}
        >
          {name}
          <span
            className={cn(
              "absolute left-0 right-0 -bottom-0.5 h-[2px] bg-primary transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              active
                ? "opacity-100 scale-x-100"
                : "opacity-0 group-hover:opacity-100 group-hover:scale-x-100 scale-x-0"
            )}
          />
        </Link>
      </motion.div>
    );
  };

  // ───────────── Return ─────────────
  return (
    <header className="fixed top-0 z-20 w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
      <nav
        className={cn(
          "w-full fixed top-0 sm:top-3 left-1/2 -translate-x-1/2 flex items-center justify-between backdrop-blur-md border border-transparent  px-7 py-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",

          // Desktop-only scroll effect
          isScrolled
            ? "sm:max-w-[98%] sm:bg-card/20 rounded-2xl sm:border-border/10 sm:shadow-sm sm:py-3 sm:px-6"
            : "sm:max-w-[100%] sm:bg-transparent sm:py-5 sm:px-8"
        )}
      >
        {/* Left Section */}
        <div className="flex items-center gap-10">
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={() => setOpen(false)}
          >
            <img
              src="/logos/inline-stripe-transparent.png"
              alt="EasyStore logo"
              className="h-12 w-auto"
              loading="lazy"
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden sm:flex items-center gap-7 text-sm font-medium">
            {[
              { name: "Home", path: "/" },
              { name: "Shop", path: "/shop" },
              { name: "Categories", path: "/categories" },
              { name: "About", path: "/about" },
            ].map((item) => (
              <MagneticLink
                key={item.path}
                name={item.name}
                path={item.path}
                active={isActive(item.path)}
              />
            ))}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Desktop Auth Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="rounded-full px-5 border-border hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300"
                >
                  Sign In
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
              <Link to="/signup">
                <Button className="rounded-full px-5 bg-primary text-white hover:bg-primary/90 transition-all duration-300">
                  Sign Up
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" className="p-2">
                    <Menu className="h-6 w-6 text-neutral-700 dark:text-neutral-100" />
                  </Button>
                </motion.div>
              </SheetTrigger>

              {/* Mobile Sheet Content */}
              <SheetContent
                side="left"
                className="w-64 bg-card text-neutral-800 dark:text-neutral-100 border-r border-border flex flex-col"
              >
                <SheetHeader className="pt-4 pb-2 border-b border-border/10">
                  <SheetTitle className="flex items-center gap-2 pl-2 text-primary font-bold text-xl">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    Easy<span className="text-secondary">Store</span>
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Mobile navigation menu.
                  </SheetDescription>
                </SheetHeader>

                {/* Mobile Links */}
                <nav className="flex flex-col gap-4 mt-6 px-4 text-base font-medium">
                  {[
                    { name: "Home", path: "/" },
                    { name: "Shop", path: "/shop" },
                    { name: "Categories", path: "/categories" },
                    { name: "About", path: "/about" },
                  ].map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "hover:text-primary transition-colors",
                        location.pathname === item.path
                          ? "text-primary font-semibold"
                          : "text-neutral-800 dark:text-neutral-200"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                {/* Auth Buttons */}
                <div className="mt-8 px-4 flex flex-col gap-3">
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-border hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      Sign In
                    </Button>
                  </Link>

                  <Link to="/signup" onClick={() => setOpen(false)}>
                    <Button className="w-full rounded-full bg-primary text-white hover:bg-primary/90">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
