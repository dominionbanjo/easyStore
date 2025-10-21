

// import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { ShoppingBag, Menu } from "lucide-react";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetDescription,
//   SheetTrigger,
// } from "@/components/ui/sheet";

// export default function Header() {
//   const [open, setOpen] = useState(false);
//   const location = useLocation();

//   const isActive = (path: string) => location.pathname === path;

//   return (
//     <header className="w-full sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border/10">
//       <div className="flex items-center justify-between px-7 py-4">
//         {/* Logo */}
//         <Link
//           to="/"
//           className="flex items-center gap-2"
//           onClick={() => setOpen(false)}
//         >
//           <img
//             src="/logos/inline-stripe.png"
//             alt="EasyStore logo"
//             className="h-15 w-auto"
//             loading="lazy"
//           />
//           <span className="sr-only">EasyStore</span>
//         </Link>

//         {/* Desktop Navigation */}
//         <nav className="hidden sm:flex items-center gap-8 text-sm font-medium">
//           {[
//             { name: "Home", path: "/" },
//             { name: "Shop", path: "/shop" },
//             { name: "Categories", path: "/categories" },
//             { name: "About", path: "/about" },
//           ].map((item) => (
//             <div key={item.path} className="relative">
//               <Link
//                 to={item.path}
//                 className={`transition-colors pb-1 ${
//                   isActive(item.path)
//                     ? "text-primary font-semibold"
//                     : "text-foreground hover:text-primary"
//                 }`}
//               >
//                 {item.name}
//               </Link>
//               {isActive(item.path) && (
//                 <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-primary rounded-full transition-all duration-300" />
//               )}
//             </div>
//           ))}

//           {/* Auth Buttons */}
//           <div className="flex items-center gap-3 ml-4">
//             <Link to="/login">
//               <Button
//                 variant="outline"
//                 className="rounded-full px-5 border-border hover:bg-muted/50"
//               >
//                 Sign In
//               </Button>
//             </Link>
//             <Link to="/signup">
//               <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5">
//                 Sign Up
//               </Button>
//             </Link>
//           </div>
//         </nav>

//         {/* Mobile Menu */}
//         <div className="sm:hidden">
//           <Sheet open={open} onOpenChange={setOpen}>
//             <SheetTrigger asChild>
//               <Button variant="ghost" size="icon" className="p-2">
//                 <Menu className="h-6 w-6 text-foreground" />
//               </Button>
//             </SheetTrigger>

//             <SheetContent
//               side="left"
//               className="w-64 bg-card text-foreground border-r border-border flex flex-col"
//             >
//               <SheetHeader className="pt-4 pb-2 border-b border-border/10">
//                 <SheetTitle className="flex items-center gap-2 pl-2 text-primary font-bold text-xl">
//                   <ShoppingBag className="h-5 w-5 text-primary" />
//                   Easy<span className="text-secondary">Store</span>
//                 </SheetTitle>
//                 <SheetDescription className="sr-only">
//                   Mobile navigation menu.
//                 </SheetDescription>
//               </SheetHeader>

//               {/* Mobile Nav Links */}
//               <nav className="flex flex-col gap-4 mt-6 px-4 font-medium text-base">
//                 {[
//                   { name: "Home", path: "/" },
//                   { name: "Shop", path: "/shop" },
//                   { name: "Categories", path: "/categories" },
//                   { name: "About", path: "/about" },
//                 ].map((item) => (
//                   <Link
//                     key={item.path}
//                     to={item.path}
//                     onClick={() => setOpen(false)}
//                     className={`hover:text-primary transition-colors ${
//                       isActive(item.path)
//                         ? "text-primary font-semibold"
//                         : "text-foreground"
//                     }`}
//                   >
//                     {item.name}
//                   </Link>
//                 ))}
//               </nav>

//               <div className="border-t border-border/10 mt-6 mb-4" />

//               {/* Auth Buttons */}
//               <div className="flex flex-col gap-2 px-4 pb-6">
//                 <Link to="/login" onClick={() => setOpen(false)}>
//                   <Button
//                     variant="outline"
//                     className="w-full rounded-full border-border py-1.5 text-sm hover:bg-muted/60"
//                   >
//                     Sign In
//                   </Button>
//                 </Link>
//                 <Link to="/signup" onClick={() => setOpen(false)}>
//                   <Button className="w-full bg-primary text-primary-foreground rounded-full py-1.5 text-sm hover:bg-primary/90">
//                     Sign Up
//                   </Button>
//                 </Link>
//               </div>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>
//     </header>
//   );
// }



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

  return (
    <header
      className={cn(
        "fixed top-0 z-20 w-full transition-all duration-300",
        isScrolled ? "backdrop-blur-lg" : "backdrop-blur-md"
      )}
    >
      <nav
        className={cn(
          // Default (no scroll)
          "mt-3 flex items-center justify-between rounded-none border-b border-transparent px-7 py-4 transition-[background-color,border-radius,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] w-full",
          // Scrolled
          isScrolled &&
          "bg-card/70 border border-border/30 shadow-sm rounded-2xl px-8 py-3"
        )}
      >
        {/* ─────────────── Left Section: Logo + Nav Links ─────────────── */}
        <div className="flex items-center gap-10">
          {/* Logo */}
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
            <span className="sr-only">EasyStore</span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden sm:flex items-center gap-7 text-sm font-medium">
            {[
              { name: "Home", path: "/" },
              { name: "Shop", path: "/shop" },
              { name: "Categories", path: "/categories" },
              { name: "About", path: "/about" },
            ].map((item) => (
              <div key={item.path} className="relative">
                <Link
                  to={item.path}
                  className={cn(
                    "transition-colors pb-1",
                    isActive(item.path)
                      ? "text-primary font-semibold"
                      : "text-foreground hover:text-primary"
                  )}
                >
                  {item.name}
                </Link>
                {isActive(item.path) && (
                  <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-primary rounded-full transition-all duration-300" />
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* ─────────────── Right Section: Buttons / Mobile Menu ─────────────── */}
        <div className="flex items-center gap-3">
          {/* Auth Buttons (Desktop) */}
          <div className="hidden sm:flex items-center gap-3">
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
                      className={cn(
                        "hover:text-primary transition-colors",
                        isActive(item.path)
                          ? "text-primary font-semibold"
                          : "text-foreground"
                      )}
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
      </nav>
    </header>
  );
}
