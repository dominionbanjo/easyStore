import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import SmartLink from "@/components/shared/SmartLink";
import { WEBSITE_ROUTES } from "@/routes";

export function OrdersEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-sm bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/10 flex items-center justify-center">
          <ShoppingBag className="h-12 w-12 text-emerald-600 dark:text-emerald-500" />
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 bg-emerald-500 rounded-sm flex items-center justify-center">
          <span className="text-white text-xs font-black">0</span>
        </div>
      </div>

      <h3 className="text-2xl font-black text-foreground mb-2">
        No Orders Yet
      </h3>
      <p className="text-muted-foreground max-w-md mb-6 leading-relaxed">
        Start your shopping journey! Browse our collection and place your first
        order to see it here.
      </p>

      <SmartLink to={WEBSITE_ROUTES.DISCOVERY}>
        <Button
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-700 text-white  -emerald-600/20 rounded-sm h-12 px-8 font-bold flex items-center gap-2"
        >
          Start Shopping
          <ArrowRight className="h-4 w-4" />
        </Button>
      </SmartLink>
    </div>
  );
}
