import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  User,
} from "lucide-react";
import type { IOrder } from "@/services/ordersApi";
import { useUpdateDeliveryStatusMutation } from "@/services/ordersApi";
import { toast } from "sonner";
import { extractErrorMessage } from "@/utils/errorHandler";

interface OrderDetailsModalProps {
  order: IOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const deliveryStatuses = [
  { value: "pending", label: "Pending", icon: Clock },
  { value: "assigned", label: "Assigned", icon: User },
  { value: "in_transit", label: "In Transit", icon: Truck },
  { value: "delivered", label: "Delivered", icon: Package },
  { value: "failed", label: "Failed", icon: XCircle },
  { value: "returned", label: "Returned", icon: XCircle },
] as const;

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
    paid: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    processing: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    shipped: "bg-purple-500/10 text-purple-700 border-purple-500/20",
    delivered: "bg-green-500/10 text-green-700 border-green-500/20",
    completed: "bg-slate-500/10 text-slate-700 border-slate-500/20",
    canceled: "bg-red-500/10 text-red-700 border-red-500/20",
    failed: "bg-red-500/10 text-red-700 border-red-500/20",
    assigned: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
    in_transit: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    returned: "bg-orange-500/10 text-orange-700 border-orange-500/20",
  };
  return colors[status] || "bg-gray-500/10 text-gray-700 border-gray-500/20";
};

export function OrderDetailsModal({
  order,
  open,
  onOpenChange,
}: OrderDetailsModalProps) {
  const [updateDeliveryStatus, { isLoading: isUpdating }] =
    useUpdateDeliveryStatusMutation();
  const [optimisticStatus, setOptimisticStatus] = useState<string | null>(null);

  // Reset optimistic status when order changes
  useEffect(() => {
    setOptimisticStatus(null);
  }, [order?.id]);

  if (!order) return null;

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order.delivery?.id) {
      toast.error("No delivery information found");
      return;
    }

    // Optimistic update
    setOptimisticStatus(newStatus);

    try {
      await updateDeliveryStatus({
        deliveryId: order.delivery.id,
        status: newStatus,
      }).unwrap();

      toast.success(`Delivery status updated to ${newStatus}`);
    } catch (error: any) {
      // Revert optimistic update on failure
      setOptimisticStatus(null);

      const errorMessage = extractErrorMessage(
        error,
        "Failed to update delivery status",
      );
      toast.error(errorMessage);
    }
  };

  const currentDeliveryStatus =
    optimisticStatus || order.delivery?.delivery_status || "pending";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <Package className="h-6 w-6 text-primary" />
            Order Details
          </DialogTitle>
          <DialogDescription>
            Order ID: #{order.id.slice(0, 8)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Order Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Payment Status */}
            <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-card to-card/50 p-5 transition-all hover:shadow-lg hover:border-primary/20">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Payment
                    </p>
                  </div>
                  <Badge
                    className={`${getStatusColor(order.payment_status)} font-medium`}
                  >
                    {order.payment_status}
                  </Badge>
                </div>
              </div>
              <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
            </div>

            {/* Order Status */}
            <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-card to-card/50 p-5 transition-all hover:shadow-lg hover:border-primary/20">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                      <Package className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Order
                    </p>
                  </div>
                  <Badge
                    className={`${getStatusColor(order.status)} font-medium`}
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
              <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-blue-500/5 blur-2xl transition-all group-hover:bg-blue-500/10" />
            </div>

            {/* Delivery Status */}
            <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-card to-card/50 p-5 transition-all hover:shadow-lg hover:border-primary/20">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
                      <Truck className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Delivery
                    </p>
                  </div>
                  <Badge
                    className={`${getStatusColor(currentDeliveryStatus)} font-medium`}
                  >
                    {currentDeliveryStatus.replace("_", " ")}
                  </Badge>
                </div>
              </div>
              <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-purple-500/5 blur-2xl transition-all group-hover:bg-purple-500/10" />
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Items
            </h3>
            <div className="space-y-3">
              {order.order_items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors"
                >
                  {/* Product Image */}
                  <img
                    src={item.image || "/placeholder-product.png"}
                    alt={item.name}
                    className="w-20 h-20 sm:w-16 sm:h-16 rounded-lg object-cover border shrink-0"
                  />

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 w-full sm:w-auto">
                    <p className="font-medium text-sm sm:text-base mb-1 line-clamp-2">
                      {item.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-muted-foreground">
                      {item.size != null && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Size:</span> {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Color:</span>
                          <span
                            className="w-4 h-4 rounded-full border inline-block"
                            style={{ backgroundColor: item.color }}
                          />
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Qty:</span>{" "}
                        {item.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="w-full sm:w-auto sm:text-right ml-auto">
                    <p className="font-semibold text-base sm:text-lg">
                      ₦{(Number(item.price) / 100).toLocaleString()}
                    </p>
                    {item.discount_price && (
                      <p className="text-xs text-muted-foreground line-through">
                        ₦{(Number(item.discount_price) / 100).toLocaleString()}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₦{(Number(order.subtotal) / 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping Fee</span>
                <span>
                  ₦{(Number(order.shipping_fee) / 100).toLocaleString()}
                </span>
              </div>
              {order.platform_fee != null && order.platform_fee > 0 && (
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Platform Fee</span>
                    <Badge
                      variant="outline"
                      className="text-[10px] py-0 h-4 bg-primary/5 text-primary border-primary/10"
                    >
                      2%
                    </Badge>
                  </div>
                  <span>
                    ₦{(Number(order.platform_fee) / 100).toLocaleString()}
                  </span>
                </div>
              )}
              {order.tax && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>₦{(Number(order.tax) / 100).toLocaleString()}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₦{(Number(order.total) / 100).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Delivery Information */}
          {order.delivery && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery Information
              </h3>
              <div className="space-y-3">
                {order.delivery.tracking_number && (
                  <div className="flex items-start gap-2">
                    <Package className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Tracking Number</p>
                      <p className="text-sm text-muted-foreground">
                        {order.delivery.tracking_number}
                      </p>
                    </div>
                  </div>
                )}

                {order.delivery.estimated_delivery && (
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Estimated Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          order.delivery.estimated_delivery,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {order.delivery.delivered_at && (
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Delivered At</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.delivery.delivered_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Status Controls */}
              <div className="mt-6">
                <h4 className="font-medium text-sm mb-3">
                  Update Delivery Status
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {deliveryStatuses.map((status) => {
                    const Icon = status.icon;
                    const isCurrent = currentDeliveryStatus === status.value;
                    const isDisabled = isUpdating;

                    return (
                      <Button
                        key={status.value}
                        variant={isCurrent ? "default" : "outline"}
                        size="sm"
                        disabled={isDisabled}
                        onClick={() => handleStatusUpdate(status.value)}
                        className="justify-start gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {status.label}
                        {isCurrent && (
                          <CheckCircle2 className="h-3 w-3 ml-auto" />
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Payment Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="capitalize">{order.payment_method}</span>
              </div>
              {order.payment_reference && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference</span>
                  <span className="font-mono text-xs">
                    {order.payment_reference}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date</span>
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
