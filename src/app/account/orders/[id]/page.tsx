import { useParams } from "react-router-dom";
import SmartLink from "@/components/shared/SmartLink";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
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
import { OrderVendorInfo } from "@/modules/website/components/orders/OrderVendorInfo";
import { ReceiptDownloadButton } from "@/modules/website/components/orders/ReceiptDownloadButton";
import { OrderPaymentSummary } from "@/modules/website/components/orders/OrderPaymentSummary";
import { OrderItemsList } from "@/modules/website/components/orders/OrderItemsList";
import { OrderDeliveryInfo } from "@/modules/website/components/orders/OrderDeliveryInfo";
import { OrderDetailsSkeleton } from "@/modules/website/components/orders/OrderDetailsSkeleton";
import { InstallmentPlanCard } from "@/modules/website/components/orders/InstallmentPlanCard";

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
    return <OrderDetailsSkeleton />;
  }

  // Error State
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-emerald-950/20 flex items-center justify-center p-4 transition-colors duration-300">
        <Card className="max-w-md w-full p-8 text-center bg-white dark:bg-neutral-900/50 dark:border-white/5">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-sm flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-black text-foreground mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 dark:text-zinc-400 mb-6">
            We couldn't find the order you're looking for.
          </p>
          <SmartLink to={ACCOUNT_ROUTES.ORDERS}>
            <Button className="rounded-sm bg-emerald-600 hover:bg-emerald-700">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-emerald-950/20 py-6 sm:py-10 transition-colors duration-300">
      <div className="w-full mx-auto px-2 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Back Button & Breadcrumb */}
          <div
            className="flex items-center justify-between"
          >
            <SmartLink to={ACCOUNT_ROUTES.ORDERS}>
              <Button
                variant="ghost"
                size="sm"
                className="group flex gap-2 items-center text-muted-foreground hover:text-primary transition-all duration-300 font-bold uppercase tracking-widest text-[10px]"
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                Back to Orders
              </Button>
            </SmartLink>

            {(order.payment_status === "success" ||
              order.status === "paid" ||
              order.status === "delivered" ||
              order.status === "completed") && (
              <ReceiptDownloadButton
                orderId={order.id}
                showText={true}
                className="h-9 px-4 text-[10px] font-black uppercase tracking-widest shadow-sm border-2"
              />
            )}
          </div>

          {/* Header Section */}
          <div
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-8 px-1"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={`capitalize px-3 py-1 text-[10px] font-black rounded-sm border-2 flex items-center gap-2 tracking-widest ${statusConfig.color}`}
                >
                  {statusConfig.icon}
                  {statusConfig.label}
                </Badge>
                <div className="h-4 w-px bg-border/40 hidden sm:block" />
                <div className="flex items-center gap-2 px-2 py-1 rounded-sm bg-muted/30 border border-border/40">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Ref
                  </span>
                  <span className="text-xs font-black text-foreground font-outfit">
                    #{displayRef}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="ml-1 p-0.5 hover:bg-muted rounded-sm"
                  >
                    {isCopied ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tighter uppercase font-outfit">
                Order Details
              </h1>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  {formattedDate}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mb-1">
                  Items Summary
                </p>
                <p className="text-2xl font-black text-foreground font-outfit">
                  {order.order_items?.length || 0} Products
                </p>
              </div>
            </div>
          </div>

          {/* New Unified Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Main Content (8 columns) */}
            <div className="lg:col-span-8 space-y-6">
              <OrderItemsList order={order} />
              <OrderDeliveryInfo order={order} />
            </div>

            {/* Right: Sidebar (4 columns) */}
            <div className="lg:col-span-4 space-y-6">
              {order.payment_plan_id && (
                <InstallmentPlanCard planId={order.payment_plan_id} />
              )}
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
