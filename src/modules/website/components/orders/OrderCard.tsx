import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { type IOrder } from "@/services/ordersApi";
import { buildRoute } from "@/routes";
import { motion } from "framer-motion";

interface OrderCardProps {
  order: IOrder;
  index?: number;
}

export function OrderCard({ order, index = 0 }: OrderCardProps) {
  const navigate = useNavigate();
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card
        className="group relative bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer rounded-2xl"
        onClick={() => navigate(buildRoute.orderDetails(order.id))}
      >
        <div className="p-5 sm:p-6">
          {/* Header: Order ID & Payment Status Pill */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              {/* Order Reference */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100">
                  <ShoppingBag className="h-4 w-4 text-gray-600 flex-shrink-0" />
                  <span className="text-sm font-semibold text-gray-700">
                    Order #
                    {order.payment_reference?.slice(0, 8).toUpperCase() ||
                      order.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-medium">{formattedDate}</span>
              </div>
            </div>

            {/* Payment Status Pill - Top Right */}
            <div
              className={`px-4 py-2 rounded-full ${paymentConfig.bgColor} ${paymentConfig.textColor} text-sm font-bold capitalize flex-shrink-0`}
            >
              {paymentConfig.label}
            </div>
          </div>

          {/* Product Section */}
          <div className="flex gap-4 mb-5 pb-5 border-b border-gray-200">
            {/* Product Image */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative">
              {firstItem?.image ? (
                <img
                  src={firstItem.image}
                  alt={firstItem.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-300 bg-white">
                  <Package className="h-10 w-10" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              {/* Product Name */}
              <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2 line-clamp-2">
                {firstItem?.name || "Order Items"}
                {itemCount > 1 && (
                  <span className="text-gray-500 font-normal ml-1">
                    +{itemCount - 1} more
                  </span>
                )}
              </h3>

              {/* Item Count & Delivery Status */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600">
                  <Package className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    {itemCount} {itemCount === 1 ? "Item" : "Items"}
                  </span>
                </div>

                {/* Delivery Status */}
                {order.delivery && (
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 flex-shrink-0 text-gray-500" />
                    <span className="text-xs font-semibold text-gray-600 capitalize">
                      {order.delivery.delivery_status.replace("_", " ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer: Payment Status Icon + Total + Arrow */}
          <div className="flex items-center justify-between">
            {/* Payment Status with Icon */}
            <div className="flex items-center gap-2">
              {paymentConfig.icon}
              <span className={`text-base font-bold ${paymentConfig.iconText}`}>
                {paymentConfig.label}
              </span>
            </div>

            {/* Total & Arrow */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-0.5">
                  TOTAL
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-600">
                  ₦{Number(order.total).toLocaleString()}
                </div>
              </div>

              {/* Arrow Button */}
              <div className="h-12 w-12 rounded-full border-2 border-emerald-600 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all flex-shrink-0">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
