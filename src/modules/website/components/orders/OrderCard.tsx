import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import { type IOrder } from "@/services/ordersApi";

interface OrderCardProps {
  order: IOrder;
}

export function OrderCard({ order }: OrderCardProps) {
  const navigate = useNavigate();
  const firstItem = order.order_items?.[0];
  const itemCount = order.order_items?.length || 0;

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
      case "completed":
        return {
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle className="h-3.5 w-3.5 mr-1.5" />,
        };
      case "shipped":
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Truck className="h-3.5 w-3.5 mr-1.5" />,
        };
      case "canceled":
        return {
          color: "bg-red-50 text-red-700 border-red-200",
          icon: <XCircle className="h-3.5 w-3.5 mr-1.5" />,
        };
      default:
        return {
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Clock className="h-3.5 w-3.5 mr-1.5" />,
        };
    }
  };

  const statusConfig = getStatusConfig(order.status);

  return (
    <Card
      className="group relative bg-white border border-slate-200 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={() => navigate(`/orders/${order.id}`)}
    >
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row items-stretch">
          {/* Thumbnail Section - Rounded & Bordered */}
          <div className="w-full sm:w-28 h-28 sm:h-auto bg-white relative flex-shrink-0 p-3 flex items-center justify-center">
            <div className="w-full aspect-square relative rounded-lg overflow-hidden border border-slate-200 shadow-sm group-hover:border-emerald-200 transition-colors">
              {firstItem?.image ? (
                <img
                  src={firstItem.image}
                  alt={firstItem.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-300 bg-slate-50">
                  <Package className="h-6 w-6" />
                </div>
              )}
              {itemCount > 1 && (
                <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-[1px] text-white text-[9px] py-0.5 text-center font-medium">
                  +{itemCount - 1} more
                </div>
              )}
            </div>
          </div>

          {/* Info Section - Clean & Spaced */}
          <div className="flex-1 p-4 flex flex-col sm:flex-row justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Batch #
                  {order.payment_reference?.slice(0, 8) || order.id.slice(0, 8)}
                </span>
                <span className="text-[10px] text-slate-300">•</span>
                <span className="text-[10px] font-medium text-slate-500">
                  {new Date(order.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 line-clamp-1 text-sm sm:text-base group-hover:text-emerald-600 transition-colors">
                {order.order_items?.map((item) => item.name).join(", ") ||
                  "Order Items"}
              </h3>

              <div className="flex items-center gap-3">
                <div className="flex items-center text-[11px] text-slate-500">
                  <CreditCard className="h-3 w-3 mr-1 text-slate-400" />
                  <span className="capitalize">{order.payment_status}</span>
                </div>
                <div className="flex items-center text-[11px] text-slate-500">
                  <Package className="h-3 w-3 mr-1 text-slate-400" />
                  <span>
                    {itemCount} {itemCount === 1 ? "Item" : "Items"}
                  </span>
                </div>
              </div>
            </div>

            {/* Price & Status - Clear & Premium */}
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3">
              <div className="flex flex-col items-start sm:items-end">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  Total Amount
                </span>
                <span className="text-lg font-black text-slate-900">
                  ₦{Number(order.total).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={`capitalize px-2.5 py-0.5 text-[10px] font-bold rounded-full ${statusConfig.color}`}
                >
                  {statusConfig.icon}
                  {order.status}
                </Badge>
                <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all border border-slate-100 group-hover:border-emerald-100">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
