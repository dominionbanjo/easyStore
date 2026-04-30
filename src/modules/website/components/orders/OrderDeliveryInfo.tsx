import { useState } from "react";
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
  Key,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { IOrder } from "@/services/ordersApi";
import { toast } from "sonner";

export function OrderDeliveryInfo({ order }: { order: IOrder }) {
  const [isCodeVisible, setIsCodeVisible] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Delivery code copied to clipboard!");
  };

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

  const confirmationCode = order.delivery?.confirmation_code || order.escrow?.release_code;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <Card className="overflow-hidden rounded-sm border border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="bg-muted/30 px-4 py-3 border-b border-border/40">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-foreground flex items-center gap-2 uppercase tracking-widest font-outfit">
              <Truck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Delivery
            </h2>
            <Badge
              variant="outline"
              className={`capitalize px-3 py-1 text-[10px] font-black rounded-sm border flex items-center gap-1.5 uppercase tracking-widest ${deliveryConfig.color}`}
            >
              {deliveryConfig.label}
            </Badge>
          </div>
        </div>
        <div className="p-3 sm:p-5 space-y-3">
          {order.delivery ? (
            <>
              {/* Security Code - Highlighted for Buyer */}
              {confirmationCode && (
                <div className="mb-6 p-4 rounded-sm bg-emerald-500/5 border border-emerald-500/20 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-100 transition-opacity">
                    <Key className="h-12 w-12 text-emerald-500 -mr-4 -mt-4 rotate-12" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                      <Key className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Delivery Confirmation Code</span>
                    </div>
                    
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-2xl font-black font-mono tracking-[0.3em] text-emerald-600 dark:text-emerald-400">
                        {isCodeVisible ? confirmationCode : "••••••"}
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setIsCodeVisible(!isCodeVisible)}
                          className="p-2 rounded-sm bg-muted/50 text-muted-foreground hover:bg-muted transition-colors active:scale-95 border border-border/40"
                          title={isCodeVisible ? "Hide Code" : "Show Code"}
                        >
                          {isCodeVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button 
                          onClick={() => handleCopyCode(confirmationCode)}
                          className="p-2 rounded-sm bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 active:scale-95"
                          title="Copy Code"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="mt-2 text-[9px] font-medium text-emerald-600/60 uppercase tracking-wider leading-relaxed">
                      Give this code to the vendor only when you have received your order to confirm delivery.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Tracking Number</span>
                </div>
                <span className="font-mono text-xs font-black text-foreground">
                  {order.delivery.tracking_number || "NOT ASSIGNED"}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Est. Delivery</span>
                </div>
                <span className="text-xs font-black text-foreground uppercase tracking-tight">
                  {order.delivery.estimated_delivery
                    ? new Date(
                        order.delivery.estimated_delivery,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "TBD"}
                </span>
              </div>

              {order.delivery.delivered_at && (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Delivered On</span>
                  </div>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">
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

              <Separator className="bg-border/40" />
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest">Delivery Address</h3>
                </div>
                <div className="ml-5 text-sm font-medium text-foreground space-y-1">
                  {order.delivery.address ? (
                    <>
                      <p>{order.delivery.address}</p>
                      {(order.delivery.city ||
                        order.delivery.state ||
                        order.delivery.postal_code) && (
                        <p className="opacity-70 text-xs">
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
                        <p className="opacity-70 text-xs">{order.delivery.country}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-muted-foreground italic text-xs">
                      No delivery address provided
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                No delivery info yet
              </p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>

  );
}
