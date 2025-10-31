import { WEBSITE_ROUTES } from "@/routes/temp";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-card text-foreground border-t border-border/10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <Link to={WEBSITE_ROUTES.HOME} className="flex items-center gap-2">
            <img
              src="/logos/inline-stripe-transparent.png"
              alt="EasyStore logo"
              className="h-12 w-auto"
              loading="lazy"
            />
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium text-muted-foreground">
            <Link to="/shop" className="hover:text-primary transition-colors">
              Shop
            </Link>
            <Link
              to="/categories"
              className="hover:text-primary transition-colors"
            >
              Categories
            </Link>
            <Link to="/about" className="hover:text-primary transition-colors">
              About
            </Link>
            <Link
              to="/contact"
              className="hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground text-center md:text-right">
            © {new Date().getFullYear()} EasyStore
          </p>
        </div>
      </div>
    </footer>
  );
}
