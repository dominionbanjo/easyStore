import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
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
  Mail,
  MapPin,
  Phone,
  Loader2,
  Copy,
  Check,
  MessageSquare,
  Eye,
  EyeOff,
} from "lucide-react";
import type { IOrder } from "@/services/ordersApi";
import { useUpdateDeliveryStatusMutation } from "@/services/ordersApi";
import { useConfirmDeliveryMutation } from "@/services/deliveryApi";
import { useStartConversationMutation } from "@/services/messagingApi";
import { useNavigate } from "react-router-dom";
import { areSubdomainsDisabled } from "@/utils/subdomain";
import { toast } from "sonner";

interface OrderDetailsModalProps {
  order: IOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const deliveryStatuses = [
  { value: "pending", label: "Pending", icon: Clock, rank: 0 },
  { value: "assigned", label: "Assigned", icon: User, rank: 1 },
  { value: "in_transit", label: "In Transit", icon: Truck, rank: 2 },
  { value: "delivered", label: "Delivered", icon: Package, rank: 3 },
  { value: "confirmed", label: "Confirmed", icon: CheckCircle2, rank: 4 },
  { value: "failed", label: "Failed", icon: XCircle, rank: 3 },
  { value: "returned", label: "Returned", icon: XCircle, rank: 3 },
] as const;

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending:
      "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    processing:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    shipped:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    delivered:
      "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    completed:
      "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    canceled: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    failed: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    assigned:
      "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    in_transit:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    returned:
      "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  };
  return (
    colors[status] ||
    "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20"
  );
};

export function OrderDetailsModal({
  order,
  open,
  onOpenChange,
}: OrderDetailsModalProps) {
  const navigate = useNavigate();
  const [updateDeliveryStatus, { isLoading: isUpdating }] =
    useUpdateDeliveryStatusMutation();
  const [confirmDelivery, { isLoading: isConfirming }] =
    useConfirmDeliveryMutation();
  const [startConversation, { isLoading: isStartingConversation }] =
    useStartConversationMutation();
  const [optimisticStatus, setOptimisticStatus] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [otp, setOtp] = useState("");
  const [showCode, setShowCode] = useState(false);

  // Reset optimistic status when order changes
  useEffect(() => {
    setOptimisticStatus(null);
    setUpdatingStatus(null);
    setIsCopied(false);
    setShowCode(false);
  }, [order?.id]);

  if (!order) return null;

  const reference = order.payment_reference || order.id;
  const displayRef = reference.slice(0, 8).toUpperCase();

  const handleCopy = () => {
    navigator.clipboard.writeText(reference);
    toast.success("Reference copied to clipboard");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleMessageBuyer = async () => {
    if (!order?.buyer?.id) {
      toast.error("Buyer information not available");
      return;
    }

    try {
      const result = await startConversation({
        recipient_id: order.buyer.id,
      }).unwrap();
      
      const convId = result.data.id;
      const basePath = areSubdomainsDisabled() ? "/vendor/messages" : "/messages";
      
      onOpenChange(false);
      navigate(`${basePath}/${convId}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to start conversation");
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order.delivery?.id) {
      toast.error("No delivery information found");
      return;
    }

    // Set side-effect status for loading and UI
    setUpdatingStatus(newStatus);
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

      toast.error(error.message || "Failed to update delivery status");
    } finally {
      setUpdatingStatus(null);
    }
  };
  const handleConfirmDelivery = async () => {
    if (!otp || otp.length < 6) {
      toast.error("Please enter a valid 6-digit confirmation code");
      return;
    }

    try {
      await confirmDelivery({
        order_id: order.id,
        code: otp,
      }).unwrap();

      toast.success("Delivery confirmed and escrow funds released!");
      setOtp("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Invalid confirmation code");
    }
  };

  const currentDeliveryStatus =
    order.confirmed ? "confirmed" : (optimisticStatus || order.delivery?.delivery_status || "pending");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <Package className="h-6 w-6 text-primary" />
            Order Details
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            Reference: #{displayRef}
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-accent rounded-sm transition-colors text-muted-foreground"
              title="Copy Full Reference"
            >
              {isCopied ? (
                <Check className="h-3 w-3 text-emerald-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Order Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Payment Status */}
            <div className="group relative overflow-hidden rounded-sm border bg-card/40 dark:bg-muted/10 p-3 transition-all hover: hover:border-primary/30">
              <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-sm bg-primary/15 text-primary">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                      Payment
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      getStatusColor(order.payment_status),
                      "px-2 py-0 h-6 border",
                    )}
                  >
                    {order.payment_status}
                  </Badge>
                </div>
              </div>
              <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-sm bg-primary/5 blur-3xl transition-all group-hover:bg-primary/10" />
            </div>

            {/* Order Status */}
            <div className="group relative overflow-hidden rounded-sm border bg-card/40 dark:bg-muted/10 p-5 transition-all hover: hover:border-blue-500/30">
              <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-sm bg-blue-500/15 text-blue-500">
                      <Package className="h-4 w-4" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                      Order
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      getStatusColor(order.confirmed ? "delivered" : order.status),
                      "px-2 py-0 h-6 border",
                    )}
                  >
                    {order.confirmed ? "confirmed" : order.status}
                  </Badge>
                </div>
              </div>
              <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-sm bg-blue-500/5 blur-3xl transition-all group-hover:bg-blue-500/10" />
            </div>

            {/* Delivery Status */}
            <div className="group relative overflow-hidden rounded-sm border bg-card/40 dark:bg-muted/10 p-5 transition-all hover: hover:border-purple-500/30">
              <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-sm bg-purple-500/15 text-purple-500">
                      <Truck className="h-4 w-4" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                      Delivery
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      getStatusColor(currentDeliveryStatus),
                      "px-2 py-0 h-6 border",
                    )}
                  >
                    {currentDeliveryStatus.replace("_", " ")}
                  </Badge>
                </div>
              </div>
              <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-sm bg-purple-500/5 blur-3xl transition-all group-hover:bg-purple-500/10" />
            </div>
          </div>

          {/* Buyer Information Section */}
          {order.buyer && (
            <div className="rounded-sm border bg-card p-4">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-sm overflow-hidden border bg-muted flex-shrink-0">
                    {order.buyer.avatar ? (
                      <img
                        src={order.buyer.avatar}
                        alt={order.buyer.first_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <User className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">
                      {order.buyer.first_name} {order.buyer.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                      Customer Profile
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${order.buyer.email}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {order.buyer.email}
                    </a>
                  </div>
                  {order.buyer.phone_number && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`tel:${order.buyer.phone_number}`}
                        className="text-foreground font-medium"
                      >
                        {order.buyer.phone_number}
                      </a>
                    </div>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-2 gap-2 h-9 border-primary/20 hover:bg-primary/5 text-primary font-bold uppercase tracking-widest text-[10px] rounded-sm"
                    onClick={handleMessageBuyer}
                    disabled={isStartingConversation}
                  >
                    {isStartingConversation ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <MessageSquare className="h-3 w-3" />
                    )}
                    Message Buyer
                  </Button>
                </div>
              </div>
            </div>
          )}

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
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-sm border bg-card hover:bg-accent/50 transition-colors"
                >
                  {/* Product Image */}
                  <img
                    src={item.image || "/placeholder-product.png"}
                    alt={item.name}
                    className="w-20 h-20 sm:w-16 sm:h-16 rounded-sm object-cover border shrink-0"
                  />

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 w-full sm:w-auto">
                    <p className="font-medium text-sm sm:text-base mb-1 line-clamp-2">
                      {item.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-muted-foreground">
                      {item.variant_options ? (
                        Object.entries(item.variant_options).map(
                          ([key, value]) => (
                            <span key={key} className="flex items-center gap-1">
                              <span className="font-medium">{key}:</span>{" "}
                              {value}
                            </span>
                          ),
                        )
                      ) : (
                        <>
                          {item.size != null && (
                            <span className="flex items-center gap-1">
                              <span className="font-medium">Size:</span>{" "}
                              {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="flex items-center gap-1">
                              <span className="font-medium">Color:</span>
                              <span
                                className="w-4 h-4 rounded-sm border inline-block"
                                style={{ backgroundColor: item.color }}
                              />
                            </span>
                          )}
                        </>
                      )}
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Qty:</span>{" "}
                        {item.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="w-full sm:w-auto sm:text-right ml-auto">
                    {item.discount_price ? (
                      <>
                        <p className="font-semibold text-base sm:text-lg">
                          ₦{(Number(item.discount_price) / 100).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground line-through">
                          ₦{(Number(item.price) / 100).toLocaleString()}
                        </p>
                      </>
                    ) : (
                      <p className="font-semibold text-base sm:text-lg">
                        ₦{(Number(item.price) / 100).toLocaleString()}
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

              {order.tax && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>₦{(Number(order.tax) / 100).toLocaleString()}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>
                  ₦{(Number(order.total) / 100).toLocaleString()}
                </span>
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

              {/* Delivery Address Section */}
              <div className="mt-4 p-3 rounded-sm bg-blue-500/5 border border-blue-500/15">
                <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400 mb-3">
                  <MapPin className="h-4 w-4" />
                  <h4 className="font-bold text-xs uppercase tracking-widest">
                    Shipping Address
                  </h4>
                </div>
                {order.delivery_address || (order.delivery && order.delivery.address) ? (
                  <div className="ml-4 space-y-1">
                    {order.delivery_address ? (
                      <>
                        <p className="text-sm font-semibold text-foreground leading-relaxed">
                          {order.delivery_address.street}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {[
                            order.delivery_address.city,
                            order.delivery_address.state,
                            order.delivery_address.postal_code,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        <p className="text-sm text-muted-foreground/80 font-medium">
                          {order.delivery_address.country === "NG"
                            ? "Nigeria"
                            : order.delivery_address.country}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-foreground leading-relaxed">
                          {order.delivery?.address}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {[
                            order.delivery?.city,
                            order.delivery?.state,
                            order.delivery?.postal_code,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        {order.delivery?.country && (
                          <p className="text-sm text-muted-foreground/80 font-medium">
                            {order.delivery.country}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <p className="ml-6 text-sm text-muted-foreground italic">
                    No shipping address provided for this order.
                  </p>
                )}
              </div>

              {/* Delivery Status Controls */}
              <div className="mt-6">
                <h4 className="font-medium text-sm mb-3">
                  Update Delivery Status
                </h4>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    {deliveryStatuses.map((status) => {
                      const Icon = status.icon;
                      const isCurrent = currentDeliveryStatus === status.value;
                      const isUpdatingThis =
                        updatingStatus === status.value && isUpdating;

                      const currentRank =
                        deliveryStatuses.find(
                          (s) => s.value === currentDeliveryStatus,
                        )?.rank ?? 0;
                      const targetRank = status.rank;

                      // Restrictions:
                      // 1. Cannot go backward (except failed/returned but those have specific logic)
                      // 2. Cannot mark as failed if already delivered/confirmed
                      // 3. Cannot change if order is confirmed
                      const isConfirmedState = order.confirmed || currentDeliveryStatus === "confirmed";
                      const isFailedStatus = status.value === "failed";
                      const isAlreadyDelivered = currentDeliveryStatus === "delivered" || isConfirmedState;

                      const isDisabled =
                        isUpdating ||
                        isCurrent ||
                        isConfirmedState ||
                        (targetRank < currentRank && !isFailedStatus) ||
                        (isFailedStatus && isAlreadyDelivered) ||
                        (status.value === "confirmed"); // Confirmed has its own UI button/OTP

                      return (
                        <button
                          key={status.value}
                          disabled={isDisabled}
                          onClick={() => handleStatusUpdate(status.value)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-sm border transition-all duration-200 text-xs font-bold uppercase tracking-wider relative overflow-hidden group",
                            isCurrent
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-background hover:bg-accent/50 border-input text-muted-foreground hover:text-foreground",
                            isDisabled && !isCurrent && "opacity-50 grayscale-[0.5] cursor-not-allowed",
                            isUpdatingThis && "ring-2 ring-primary ring-offset-2"
                          )}
                        >
                          {isUpdatingThis ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Icon className={cn("h-3.5 w-3.5", isCurrent ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                          )}
                          {status.label}
                          {isCurrent && !isUpdatingThis && (
                            <CheckCircle2 className="h-3 w-3 ml-1" />
                          )}
                          
                          {/* Loading overlay for the specific button */}
                          {isUpdatingThis && (
                            <motion.div
                              className="absolute inset-0 bg-primary/20"
                              initial={{ x: "-100%" }}
                              animate={{ x: "100%" }}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Release Escrow (OTP) or Direct Confirmation */}
                {currentDeliveryStatus === "delivered" && !order.confirmed && (
                  <div className="mt-6 p-4 rounded-sm border-2 border-dashed border-primary/30 bg-primary/5">
                    <div className="flex items-center gap-2 text-primary mb-3">
                      <CheckCircle2 className="h-5 w-5" />
                      <h4 className="font-bold text-sm uppercase tracking-wider">
                        {order.payment_method === "online" && order.escrow ? "Release Escrow Funds" : "Confirm Delivery"}
                      </h4>
                    </div>
                    
                    {order.payment_method === "online" && order.escrow ? (
                      <>
                        <p className="text-xs text-muted-foreground mb-4">
                          The customer has received their Secure Release Code (OTP).
                          {order.delivery?.confirmation_code && (
                            <span className="block mt-2 font-bold text-primary flex items-center gap-2">
                              Buyer's Code: {showCode ? order.delivery.confirmation_code : "••••••"}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => setShowCode(!showCode)}
                              >
                                {showCode ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                              </Button>
                            </span>
                          )}
                          Enter it below to confirm delivery and release your funds.
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            className="flex-1 h-10 px-3 rounded-sm border bg-background font-mono text-center tracking-[0.5em] text-lg outline-none"
                          />
                          <Button
                            disabled={otp.length < 6 || isConfirming}
                            onClick={handleConfirmDelivery}
                            size="sm"
                          >
                            {isConfirming ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm"}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <p className="text-xs text-muted-foreground">
                          Confirm that the customer has received their order. This will mark the order as completed.
                        </p>
                        <Button
                          disabled={isConfirming}
                          onClick={() => handleConfirmDelivery()}
                          className="w-full gap-2"
                        >
                          {isConfirming ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                          Confirm Delivery & Complete Order
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {order.confirmed && (
                  <div className="mt-6 p-4 rounded-sm border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Delivery Confirmed</p>
                      <p className="text-xs text-emerald-600/80">
                        {order.payment_method === "online" && order.escrow 
                          ? "Funds have been released from escrow." 
                          : "Order has been marked as completed."}
                      </p>
                    </div>
                  </div>
                )}
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
                <div className="flex justify-between items-center group/ref">
                  <span className="text-muted-foreground">Reference</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs">
                      {order.payment_reference}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="p-1 hover:bg-accent rounded-sm transition-colors text-muted-foreground"
                      title="Copy Full Reference"
                    >
                      {isCopied ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
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
