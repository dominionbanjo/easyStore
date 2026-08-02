import { WEBSITE_ROUTES } from "@/routes/temp";
import { Logo } from "./Logo";
import SmartLink from "./SmartLink";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
  Mail,
  MapPin,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Footer() {
  const [subEmail, setSubEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail) return;
    setSubscribing(true);
    try {
      const res = await fetch(`${API_URL}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subEmail, location: "Lagos, Nigeria" }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          (body as { message?: string } | null)?.message || "Failed",
        );
      }
      toast.success("Subscribed successfully!");
      setSubEmail("");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Subscription failed",
      );
    }
    setSubscribing(false);
  };

  return (
    <footer className="bg-card text-card-foreground relative overflow-hidden border-t border-border/50 rounded-t-sm mt-12 -[0_-10px_40px_-15px_rgba(0,0,0,0.05)] transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-sm blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="w-full mx-auto px-4 sm:px-6 md:px-14 xl:px-16 pt-20 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <SmartLink to={WEBSITE_ROUTES.HOME} className="block">
              <Logo size="lg" />
            </SmartLink>
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
                  className="w-10 h-10 rounded-sm bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300"
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
                <SmartLink
                  to={WEBSITE_ROUTES.STORES}
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-sm bg-primary/0 group-hover:bg-primary transition-colors" />
                  Marketplace
                </SmartLink>
              </li>
              <li>
                <SmartLink
                  to={WEBSITE_ROUTES.DISCOVERY}
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-sm bg-primary/0 group-hover:bg-primary transition-colors" />
                  Discovery
                </SmartLink>
              </li>
              <li>
                <SmartLink
                  to={WEBSITE_ROUTES.FEATURED}
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-sm bg-primary/0 group-hover:bg-primary transition-colors" />
                  Featured Stores
                </SmartLink>
              </li>
              <li>
                <SmartLink
                  to={WEBSITE_ROUTES.CATEGORIES}
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-sm bg-primary/0 group-hover:bg-primary transition-colors" />
                  Categories
                </SmartLink>
              </li>
              <li>
                <SmartLink
                  to={WEBSITE_ROUTES.TRENDING}
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-sm bg-primary/0 group-hover:bg-primary transition-colors" />
                  Trending Products
                </SmartLink>
              </li>
              <li>
                <SmartLink
                  to={WEBSITE_ROUTES.NEW_ARRIVALS}
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-sm bg-primary/0 group-hover:bg-primary transition-colors" />
                  New Arrivals
                </SmartLink>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-foreground">Company</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <SmartLink
                  to={WEBSITE_ROUTES.ABOUT}
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-sm bg-primary/0 group-hover:bg-primary transition-colors" />
                  About Us
                </SmartLink>
              </li>
              <li>
                <SmartLink
                  to={WEBSITE_ROUTES.CAREERS}
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-sm bg-primary/0 group-hover:bg-primary transition-colors" />
                  Careers
                </SmartLink>
              </li>
              <li>
                <SmartLink
                  to="/privacy-policy"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-sm bg-primary/0 group-hover:bg-primary transition-colors" />
                  Privacy Policy
                </SmartLink>
              </li>
              <li>
                <SmartLink
                  to="/terms-of-service"
                  className="hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-sm bg-primary/0 group-hover:bg-primary transition-colors" />
                  Terms of Service
                </SmartLink>
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
            <form className="relative" onSubmit={handleSubscribe}>
              <Input
                type="email"
                placeholder="Enter your email"
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                disabled={subscribing}
                required
                className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground rounded-sm pr-12 h-12 focus-visible:ring-primary/20 disabled:opacity-60"
              />
              <Button
                type="submit"
                size="icon"
                isLoading={subscribing}
                disabled={subscribing}
                className="absolute right-1 top-1 h-10 w-10 rounded-sm bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </Button>
            </form>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Lagos, Nigeria</span>
              </div>
              <a
                href="mailto:support@eazystore.com.ng"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4 text-primary" />
                <span>support@eazystore.com.ng</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} EazyStore Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground font-medium">
            <SmartLink to="#" className="hover:text-primary transition-colors">
              Sitemap
            </SmartLink>
            <SmartLink to="#" className="hover:text-primary transition-colors">
              Cookies
            </SmartLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
