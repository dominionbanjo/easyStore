import { motion } from "framer-motion";
import {
  Truck,
  Calendar,
  CheckCircle,
  MapPin,
  User,
  XCircle,
  Clock,
  Package,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { IOrder } from "@/services/ordersApi";

export function OrderDeliveryInfo({ order }: { order: IOrder }) {
  const getDeliveryStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
      case "confirmed":
        return {
          color:
            "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30",
          icon: (
            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
          ),
          label: "Delivered",
        };
      case "in_transit":
        return {
          color:
            "bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/30",
          icon: <Truck className="h-5 w-5 text-blue-600 dark:text-blue-500" />,
          label: "In Transit",
        };
      case "assigned":
        return {
          color:
            "bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/30",
          icon: (
            <User className="h-5 w-5 text-purple-600 dark:text-purple-500" />
          ),
          label: "Assigned",
        };
      case "failed":
      case "returned":
        return {
          color:
            "bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/30",
          icon: <XCircle className="h-5 w-5 text-red-600 dark:text-red-500" />,
          label: status === "failed" ? "Failed" : "Returned",
        };
      case "pending":
      default:
        return {
          color:
            "bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/30",
          icon: (
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-500" />
          ),
          label: "Pending",
        };
    }
  };

  const deliveryConfig = order.delivery
    ? getDeliveryStatusConfig(order.delivery.delivery_status)
    : getDeliveryStatusConfig("pending");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <Card className="overflow-hidden rounded-2xl border-2 border-gray-100 dark:border-white/5 bg-white dark:bg-neutral-900/50">
        <div className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-500/10 dark:to-transparent px-6 py-4 border-b-2 border-gray-100 dark:border-white/5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-foreground flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Delivery Information
            </h2>
            <Badge
              variant="outline"
              className={`capitalize px-3 py-1.5 text-sm font-bold rounded-full border-2 flex items-center gap-2 ${deliveryConfig.color}`}
            >
              {deliveryConfig.icon}
              {deliveryConfig.label}
            </Badge>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {order.delivery ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">Tracking Number</span>
                </div>
                <span className="font-mono text-sm font-bold text-foreground">
                  {order.delivery.tracking_number || "Not assigned yet"}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">Estimated Delivery</span>
                </div>
                <span className="font-semibold text-foreground">
                  {order.delivery.estimated_delivery
                    ? new Date(
                        order.delivery.estimated_delivery,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "To be determined"}
                </span>
              </div>

              {order.delivery.delivered_at && (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">Delivered On</span>
                  </div>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {new Date(order.delivery.delivered_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </span>
                </div>
              )}

              <Separator className="dark:bg-white/5" />
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <h3 className="font-bold">Delivery Address</h3>
                </div>
                <div className="ml-6 text-sm text-foreground space-y-1">
                  {order.delivery.address ? (
                    <>
                      <p className="font-medium">{order.delivery.address}</p>
                      {(order.delivery.city ||
                        order.delivery.state ||
                        order.delivery.postal_code) && (
                        <p>
                          {[
                            order.delivery.city,
                            order.delivery.state,
                            order.delivery.postal_code,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                      {order.delivery.country && (
                        <p>{order.delivery.country}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No delivery address provided
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-gray-400 dark:text-neutral-500" />
              </div>
              <p className="text-foreground font-medium mb-1">
                No delivery information yet
              </p>
              <p className="text-sm text-muted-foreground">
                Delivery details will be added once the order is processed
              </p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
