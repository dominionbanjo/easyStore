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
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-8 px-1">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 flex items-center justify-center border border-emerald-500/20">
            <Package className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex flex-col -space-y-1">
            <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tighter uppercase font-outfit">
              My Orders
            </h1>
            {!isLoading && (
              <div className="flex items-center gap-2 pt-1 opacity-70">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Order Volume</span>
                <span className="text-[10px] font-black uppercase py-0.5 px-2 bg-muted/50 rounded-sm border border-border/40 text-foreground">
                  {totalOrders} {totalOrders === 1 ? "REC" : "RECS"}
                </span>
              </div>
            )}
          </div>
        </div>
        <p className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest max-w-2xl leading-relaxed opacity-60">
          Track purchases, manage deliveries, and view history from your unified dashboard.
        </p>
      </div>

      <SmartLink to={WEBSITE_ROUTES.HOME}>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/20 rounded-sm h-11 px-6 font-black uppercase tracking-widest text-[10px] shrink-0 flex items-center gap-2 group transition-all active:scale-[0.98]"
        >
          <ShoppingBag className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
          Continue Shopping
        </Button>
      </SmartLink>
    </div>

  );
}
