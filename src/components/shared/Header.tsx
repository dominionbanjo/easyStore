import { useState } from "react";
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

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Helper to check active route
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full sticky top-0 bg-card/80 backdrop-blur-md z-10 border-b border-border/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-primary flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <ShoppingBag className="h-6 w-6 text-primary" />
          Easy<span className="text-secondary">Store</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-8 text-sm font-medium relative">
          {[
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            { name: "Categories", path: "/categories" },
            { name: "About", path: "/about" },
          ].map((item) => (
            <div key={item.path} className="relative">
              <Link
                to={item.path}
                className={`transition-colors pb-1 ${
                  isActive(item.path)
                    ? "text-primary font-semibold"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {item.name}
              </Link>

              {/* Active underline */}
              {isActive(item.path) && (
                <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-primary rounded-full transition-all duration-300" />
              )}
            </div>
          ))}

          {/* Auth Buttons */}
          <div className="flex items-center gap-3 ml-4">
            <Link to="/login">
              <Button
                variant="outline"
                className="rounded-full px-5 border-border hover:bg-muted/50"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5">
                Sign Up
              </Button>
            </Link>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="sm:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="p-2">
                <Menu className="h-6 w-6 text-foreground" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-64 bg-card text-foreground border-r border-border flex flex-col"
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

              {/* Mobile Nav Links */}
              <nav className="flex flex-col gap-4 mt-6 px-4 font-medium text-base">
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
                    className={`hover:text-primary transition-colors ${
                      isActive(item.path)
                        ? "text-primary font-semibold"
                        : "text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-border/10 mt-6 mb-4" />

              {/* Auth Buttons */}
              <div className="flex flex-col gap-2 px-4 pb-6">
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-border py-1.5 text-sm hover:bg-muted/60"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-primary text-primary-foreground rounded-full py-1.5 text-sm hover:bg-primary/90">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
