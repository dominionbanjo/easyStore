import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { WEBSITE_ROUTES } from "@/routes";

export function OrdersEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
          <ShoppingBag className="h-12 w-12 text-emerald-600" />
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-black">0</span>
        </div>
      </div>

      <h3 className="text-2xl font-black text-gray-900 mb-2">No Orders Yet</h3>
      <p className="text-gray-500 max-w-md mb-6 leading-relaxed">
        Start your shopping journey! Browse our collection and place your first
        order to see it here.
      </p>

      <Button
        asChild
        size="lg"
        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 rounded-2xl h-12 px-8 font-bold"
      >
        <Link to={WEBSITE_ROUTES.HOME} className="flex items-center gap-2">
          Start Shopping
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
