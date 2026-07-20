import SmartLink from "@/components/shared/SmartLink";
import { Card } from "@/components/ui/card";
import {
  Package,
  ChevronRight,
  Calendar,
  ShoppingBag,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  Copy,
  Check,
} from "lucide-react";
import { type IOrder } from "@/services/ordersApi";
import { buildRoute } from "@/routes";
import { toast } from "sonner";
import { useState } from "react";
import { ReceiptDownloadButton } from "./ReceiptDownloadButton";

interface OrderCardProps {
  order: IOrder;
  index?: number;
}

export function OrderCard({ order }: OrderCardProps) {
  const firstItem = order.order_items?.[0];
  const itemCount = order.order_items?.length || 0;

  const getPaymentStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "success":
        return {
          bgColor: "bg-emerald-600",
          textColor: "text-white",
          label: "Paid",
          icon: <CheckCircle className="h-4 w-4 text-emerald-600" />,
          iconText: "text-emerald-600",
        };
      case "pending":
        return {
          bgColor: "bg-amber-500",
          textColor: "text-white",
          label: "Pending",
          icon: <Clock className="h-4 w-4 text-amber-600" />,
          iconText: "text-amber-600",
        };
      case "failed":
        return {
          bgColor: "bg-red-500",
          textColor: "text-white",
          label: "Failed",
          icon: <XCircle className="h-4 w-4 text-red-600" />,
          iconText: "text-red-600",
        };
      default:
        return {
          bgColor: "bg-gray-500",
          textColor: "text-white",
          label: status,
          icon: <Clock className="h-4 w-4 text-gray-600" />,
          iconText: "text-gray-600",
        };
    }
  };

  const paymentConfig = getPaymentStatusConfig(order.payment_status);
  const orderDate = new Date(order.created_at);
  const formattedDate = orderDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const [isCopied, setIsCopied] = useState(false);

  const reference = order.payment_reference || order.id;
  const displayRef = reference.slice(0, 8).toUpperCase();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(reference);
    toast.success("Reference copied to clipboard");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div>
      <SmartLink
        to={buildRoute.orderDetails(order.id)}
        className="block no-underline"
      >
        <Card className="group relative bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/5 hover:border-emerald-600/30 transition-all duration-300 overflow-hidden cursor-pointer rounded-sm shadow-sm hover:shadow-md">
          <div className="p-4 sm:p-6 pt-5">
            {/* Top Section: Header & Payment Status */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-5 pb-5 border-b border-gray-100 dark:border-white/5 gap-5">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm bg-gray-100 dark:bg-neutral-800 border border-border/40 w-fit shadow-inner">
                  <ShoppingBag className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-black uppercase tracking-widest text-foreground font-outfit">
                    Order #{displayRef}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-sm transition-colors"
                  >
                    {isCopied ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3 text-muted-foreground" />
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground pl-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest leading-none">{formattedDate}</span>
                </div>
              </div>

              {/* Top Status: Payment Status */}
              <div className="flex flex-col items-start sm:items-end shrink-0">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60 mb-2 leading-none">Payment Status</span>
                <div
                  className={`inline-flex items-center px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${paymentConfig.bgColor} ${paymentConfig.textColor}`}
                >
                  {paymentConfig.label}
                </div>
              </div>
            </div>



            {/* Middle Section: Items Preview */}
            <div className="flex gap-4 mb-6">
              <div className="w-20 h-20 bg-muted/30 rounded-sm overflow-hidden flex-shrink-0 border border-border/10">
                {firstItem?.image ? (
                  <img
                    src={firstItem.image}
                    alt={firstItem.name}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground/30">
                    <Package className="h-8 w-8" />
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-center min-w-0">
                <div className="flex flex-col gap-0.5 mb-2">
                  {order.vendor?.store && (
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">
                      {order.vendor.store.store_name}
                    </span>
                  )}
                  <h3 className="font-black text-foreground text-sm sm:text-base uppercase font-outfit truncate">
                    {firstItem?.name || "Order Items"}
                    {itemCount > 1 && (
                      <span className="text-muted-foreground font-black lowercase ml-1">
                        +{itemCount - 1} more
                      </span>
                    )}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/20 px-2 py-1 rounded-sm w-fit">
                  <Package className="h-3 w-3" />
                  {itemCount} {itemCount === 1 ? "Item" : "Items"}
                </div>
              </div>
            </div>

            {/* Bottom Status: Delivery Row */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-sm">
                    <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex flex-col -space-y-0.5">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">Delivery Status</span>
                    <span className="text-xs font-black uppercase tracking-widest text-foreground">
                      {order.delivery?.delivery_status.replace("_", " ") || "Processing"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Price & Action */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex flex-col -space-y-1">
                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60 mb-0.5">
                    TOTAL PRICE
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-foreground font-outfit tracking-tighter">
                    ₦{(Number(order.total) / 100).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {(order.payment_status === "success" || order.status === "paid" || order.status === "delivered" || order.status === "completed") && (
                    <ReceiptDownloadButton orderId={order.id} />
                  )}
                  <div className="h-11 w-11 rounded-sm border-[1.5px] border-emerald-600/50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-emerald-600/20 transition-all duration-300">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </SmartLink>
    </div>


  );
}
