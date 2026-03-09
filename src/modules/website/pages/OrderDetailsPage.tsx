import { useParams } from "react-router-dom";
import SmartLink from "@/components/shared/SmartLink";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ShoppingBag,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Truck,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetOrderByIdQuery } from "@/services/ordersApi";
import { ACCOUNT_ROUTES } from "@/routes";
import { useState } from "react";
import { toast } from "sonner";
import { OrderItemsList } from "../components/orders/OrderItemsList";
import { OrderDeliveryInfo } from "../components/orders/OrderDeliveryInfo";
import { OrderPaymentSummary } from "../components/orders/OrderPaymentSummary";
import { OrderVendorInfo } from "../components/orders/OrderVendorInfo";

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useGetOrderByIdQuery(id || "");
  const [isCopied, setIsCopied] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
      case "completed":
        return {
          color:
            "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30",
          icon: <CheckCircle className="h-4 w-4" />,
          label: "Delivered",
        };
      case "shipped":
        return {
          color:
            "bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/30",
          icon: <Truck className="h-4 w-4" />,
          label: "Shipped",
        };
      case "canceled":
      case "cancelled":
        return {
          color:
            "bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/30",
          icon: <XCircle className="h-4 w-4" />,
          label: "Cancelled",
        };
      case "processing":
        return {
          color:
            "bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/30",
          icon: <Package className="h-4 w-4" />,
          label: "Processing",
        };
      case "paid":
        return {
          color:
            "bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/30",
          icon: <CheckCircle className="h-4 w-4" />,
          label: "Paid",
        };
      default:
        return {
          color:
            "bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/30",
          icon: <Clock className="h-4 w-4" />,
          label: "Pending",
        };
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-emerald-950/20 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-zinc-400 font-medium">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-emerald-950/20 flex items-center justify-center p-4 transition-colors duration-300">
        <Card className="max-w-md w-full p-8 text-center bg-white dark:bg-neutral-900/50 dark:border-white/5">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-black text-foreground mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 dark:text-zinc-400 mb-6">
            We couldn't find the order you're looking for.
          </p>
          <SmartLink to={ACCOUNT_ROUTES.ORDERS}>
            <Button className="rounded-full bg-emerald-600 hover:bg-emerald-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </SmartLink>
        </Card>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const orderDate = new Date(order.created_at);
  const formattedDate = orderDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const reference = order.payment_reference || order.id;
  const displayRef = reference.slice(0, 8).toUpperCase();

  const handleCopy = () => {
    navigator.clipboard.writeText(reference);
    toast.success("Reference copied to clipboard");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-emerald-950/20 py-8 sm:py-12 transition-colors duration-300">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SmartLink to={ACCOUNT_ROUTES.ORDERS}>
              <Button
                variant="ghost"
                className="group flex items-center gap-2 text-gray-700 hover:text-gray-900 -ml-2 dark:text-zinc-300 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Orders
              </Button>
            </SmartLink>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row justify-between sm:items-start gap-4"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-2">
                Order Details
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  <span className="text-sm font-semibold">#{displayRef}</span>
                  <button
                    onClick={handleCopy}
                    className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-600 dark:hover:bg-neutral-800 dark:text-zinc-500 dark:hover:text-zinc-300"
                    title="Copy Full Reference"
                  >
                    {isCopied ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
                <span className="text-gray-300 dark:text-zinc-600">•</span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{formattedDate}</span>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <Badge
              variant="outline"
              className={`capitalize px-4 py-2 text-sm font-bold rounded-full border-2 flex items-center gap-2 ${statusConfig.color}`}
            >
              {statusConfig.icon}
              {statusConfig.label}
            </Badge>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Order Items & Delivery */}
            <div className="lg:col-span-2 space-y-6">
              <OrderItemsList order={order} />
              <OrderDeliveryInfo order={order} />
            </div>

            {/* Right Column - Payment & Vendor */}
            <div className="lg:col-span-1 space-y-6">
              <OrderPaymentSummary
                order={order}
                handleCopy={handleCopy}
                isCopied={isCopied}
              />
              <OrderVendorInfo order={order} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
