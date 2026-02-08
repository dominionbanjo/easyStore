import { WEBSITE_ROUTES } from "@/routes/temp";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
  Mail,
  MapPin,
} from "lucide-react";
import { useTheme } from "./ThemeContext";

export default function Footer() {
  const { theme } = useTheme();
  return (
    <footer className="bg-card text-card-foreground relative overflow-hidden border-t border-border/50 rounded-t-[3rem] mt-12 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to={WEBSITE_ROUTES.HOME} className="block">
              <img
                src={
                  theme === "dark"
                    ? "/logos/EasyStore logo with tagline.png"
                    : "/logos/inline-stripe-transparent.png"
                }
                alt="EasyStore logo"
                className={
                  theme === "dark"
                    ? "h-14 w-auto scale-110 origin-left"
                    : "h-10 w-auto"
                }
                loading="lazy"
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              The premium marketplace for verified creators and authentic
              brands. Redefining what it means to shop online with trust and
              transparency.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-foreground">
              Discovery
            </h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <Link
                  to={WEBSITE_ROUTES.STORES}
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                  Featured Stores
                </Link>
              </li>
              <li>
                <Link
                  to={WEBSITE_ROUTES.CATEGORIES}
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                  Trending Products
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-foreground">Company</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <Link
                  to={WEBSITE_ROUTES.ABOUT}
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-6">
            <h4 className="font-bold text-lg text-foreground">Stay Updated</h4>
            <p className="text-sm text-muted-foreground">
              Subscribe for exclusive offers and daily updates directly to your
              inbox.
            </p>
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <Input
                placeholder="Enter your email"
                className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground rounded-full pr-12 h-12 focus-visible:ring-primary/20"
              />
              <Button
                size="icon"
                className="absolute right-1 top-1 h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </Button>
            </form>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span>hello@easystore.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} EasyStore Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground font-medium">
            <Link to="#" className="hover:text-primary transition-colors">
              Sitemap
            </Link>
            <Link to="#" className="hover:text-primary transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
