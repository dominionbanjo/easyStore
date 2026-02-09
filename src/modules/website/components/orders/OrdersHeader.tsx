import { Package, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import SmartLink from "@/components/shared/SmartLink";
import { WEBSITE_ROUTES } from "@/routes";

interface OrdersHeaderProps {
  totalOrders?: number;
  isLoading?: boolean;
}

export function OrdersHeader({
  totalOrders = 0,
  isLoading,
}: OrdersHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">
              My Orders
            </h1>
            {!isLoading && (
              <p className="text-sm text-muted-foreground font-medium">
                {totalOrders} {totalOrders === 1 ? "order" : "orders"} in total
              </p>
            )}
          </div>
        </div>
        <p className="text-muted-foreground text-sm mt-2 max-w-2xl leading-relaxed">
          Track your purchases, manage deliveries, and view order history all in
          one place
        </p>
      </div>

      <SmartLink to={WEBSITE_ROUTES.HOME}>
        <Button
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 rounded-2xl h-12 px-6 font-bold shrink-0 flex items-center gap-2"
        >
          <ShoppingBag className="h-4 w-4" />
          Continue Shopping
        </Button>
      </SmartLink>
    </div>
  );
}
