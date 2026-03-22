import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackLink?: boolean;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  showBackLink = true,
}: AuthLayoutProps) {
  return (
    <div className="h-screen lg:overflow-hidden grid lg:grid-cols-2 relative text-foreground bg-background">
      {/* GLOBAL BACKGROUND with IMAGE - Visible on Mobile, backbone of Left Side */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/easyshop.jpg"
          alt="Shopping Experience"
          className="w-full h-full object-cover"
        />
        {/* Base dark overlay for readability on mobile */}
        <div className="absolute inset-0 bg-black/60 lg:bg-black/20" />
      </div>

      {/* LEFT SIDE: BRANDING (Desktop Only visible elements) */}
      <div className="hidden lg:flex relative z-10 h-full flex-col justify-between p-12 text-white overflow-hidden">
        {/* Specific Overlay for Left Side to ensure text contrast and branding color */}
        <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />

        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 z-0 opacity-60" />

        {/* Logo Area */}
        <div className="relative z-10">
          <Link
            to="/"
            className="flex items-center gap-3 text-2xl font-black tracking-tighter hover:opacity-90 transition-opacity"
          >
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-2xl">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <span className="text-3xl">EasyStore</span>
          </Link>
        </div>

        {/* Middle Content */}
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-5xl font-black tracking-tight mb-8 leading-[1.1] drop-shadow-2xl">
              Launch your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">
                E-commerce
              </span>{" "}
              empire.
            </h2>
            <ul className="space-y-5 text-zinc-100/90 text-lg font-semibold">
              <li className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_15px_rgba(34,197,94,1)]" />
                No setup fees. No hidden costs.
              </li>
              <li className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_15px_rgba(34,197,94,1)]" />
                Integrated payment gateways
              </li>
              <li className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_15px_rgba(34,197,94,1)]" />
                Real-time inventory sync
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-zinc-400 text-xs font-medium tracking-widest uppercase">
          © {new Date().getFullYear()} EasyStore.
        </div>
      </div>

      {/* RIGHT SIDE: FORM */}
      <div className="relative z-10 flex flex-col items-center justify-start py-12 px-6 sm:px-12 lg:bg-background bg-background/95 backdrop-blur-md lg:backdrop-blur-none h-full lg:h-screen overflow-y-auto no-scrollbar">
        <div className="w-full max-w-md">
          {/* Navigation Header */}
          <div className="w-full flex items-center justify-between mb-5 animate-in fade-in slide-in-from-top-4 duration-700">
            <Link
              to="/"
              className="flex items-center gap-3 group transition-transform active:scale-95"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20 transition-colors group-hover:bg-primary/20">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-foreground">
                EasyStore
              </span>
            </Link>

            {showBackLink && (
              <Button
                size="icon"
                className="rounded-xl w-10 h-10 bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/25 transition-all hover:-translate-x-0.5 active:scale-90"
                asChild
              >
                <Link to="/" aria-label="Back to Home">
                  <ArrowLeft className="w-5 h-5 text-white" />
                </Link>
              </Button>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-10"
          >
            <div className="space-y-4 text-left">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
                {title}
              </h1>
              {subtitle && (
                <p className="text-muted-foreground text-base sm:text-xl font-medium leading-relaxed max-w-[90%]">
                  {subtitle}
                </p>
              )}
            </div>

            <div className="pt-2">{children}</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
