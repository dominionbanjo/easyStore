import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ShoppingBag,
  Loader2,
  AlertCircle,
  MapPin,
  User,
  Mail,
  Phone,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useGetOrderByIdQuery } from "@/services/ordersApi";
import { ACCOUNT_ROUTES } from "@/routes";
import { useState } from "react";
import { toast } from "sonner";

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useGetOrderByIdQuery(id || "");
  const [isCopied, setIsCopied] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
      case "completed":
        return {
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle className="h-4 w-4" />,
          label: "Delivered",
        };
      case "shipped":
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Truck className="h-4 w-4" />,
          label: "Shipped",
        };
      case "canceled":
      case "cancelled":
        return {
          color: "bg-red-50 text-red-700 border-red-200",
          icon: <XCircle className="h-4 w-4" />,
          label: "Cancelled",
        };
      case "processing":
        return {
          color: "bg-purple-50 text-purple-700 border-purple-200",
          icon: <Package className="h-4 w-4" />,
          label: "Processing",
        };
      case "paid":
        return {
          color: "bg-green-50 text-green-700 border-green-200",
          icon: <CheckCircle className="h-4 w-4" />,
          label: "Paid",
        };
      default:
        return {
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Clock className="h-4 w-4" />,
          label: "Pending",
        };
    }
  };

  const getDeliveryStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
      case "confirmed":
        return {
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle className="h-5 w-5 text-emerald-600" />,
          label: "Delivered",
        };
      case "in_transit":
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Truck className="h-5 w-5 text-blue-600" />,
          label: "In Transit",
        };
      case "assigned":
        return {
          color: "bg-purple-50 text-purple-700 border-purple-200",
          icon: <User className="h-5 w-5 text-purple-600" />,
          label: "Assigned",
        };
      case "failed":
      case "returned":
        return {
          color: "bg-red-50 text-red-700 border-red-200",
          icon: <XCircle className="h-5 w-5 text-red-600" />,
          label: status === "failed" ? "Failed" : "Returned",
        };
      case "pending":
      default:
        return {
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Clock className="h-5 w-5 text-amber-600" />,
          label: "Pending",
        };
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the order you're looking for.
          </p>
          <Button
            onClick={() => navigate(ACCOUNT_ROUTES.ORDERS)}
            className="rounded-full bg-emerald-600 hover:bg-emerald-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </Card>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const deliveryConfig = order.delivery
    ? getDeliveryStatusConfig(order.delivery.delivery_status)
    : getDeliveryStatusConfig("pending");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate(ACCOUNT_ROUTES.ORDERS)}
              className="group flex items-center gap-2 text-gray-700 hover:text-gray-900 -ml-2"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Orders
            </Button>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row justify-between sm:items-start gap-4"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
                Order Details
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-gray-600">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  <span className="text-sm font-semibold">#{displayRef}</span>
                  <button
                    onClick={handleCopy}
                    className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-600"
                    title="Copy Full Reference"
                  >
                    {isCopied ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
                <span className="text-gray-300">•</span>
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
              {/* Order Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Card className="overflow-hidden rounded-2xl border-2 border-gray-100">
                  <div className="bg-gradient-to-r from-emerald-50 to-white px-6 py-4 border-b-2 border-gray-100">
                    <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      <Package className="h-5 w-5 text-emerald-600" />
                      Order Items
                      <span className="ml-auto text-sm font-semibold text-emerald-600">
                        {order.order_items?.length || 0}{" "}
                        {order.order_items?.length === 1 ? "Item" : "Items"}
                      </span>
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    {order.order_items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                      >
                        {/* Product Image */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border-2 border-gray-100 flex-shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-300">
                              <Package className="h-8 w-8" />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-base mb-1">
                            {item.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                            <span>Qty: {item.quantity}</span>
                            {item.size && <span>Size: {item.size}</span>}
                            {item.color && <span>Color: {item.color}</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-emerald-600">
                              ₦
                              {(
                                ((Number(item.discount_price) ||
                                  Number(item.price)) /
                                  100) *
                                item.quantity
                              ).toLocaleString()}
                            </span>
                            {item.discount_price &&
                              item.discount_price < item.price && (
                                <span className="text-sm text-gray-400 line-through">
                                  ₦
                                  {(
                                    (item.price / 100) *
                                    item.quantity
                                  ).toLocaleString()}
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Shipping/Delivery Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <Card className="overflow-hidden rounded-2xl border-2 border-gray-100">
                  <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-4 border-b-2 border-gray-100">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                        <Truck className="h-5 w-5 text-blue-600" />
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
                        {/* Tracking Number */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Package className="h-4 w-4 flex-shrink-0" />
                            <span className="font-medium">Tracking Number</span>
                          </div>
                          <span className="font-mono text-sm font-bold text-gray-900">
                            {order.delivery.tracking_number ||
                              "Not assigned yet"}
                          </span>
                        </div>

                        {/* Estimated Delivery */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <span className="font-medium">
                              Estimated Delivery
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900">
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

                        {/* Delivered Date */}
                        {order.delivery.delivered_at && (
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <CheckCircle className="h-4 w-4 flex-shrink-0" />
                              <span className="font-medium">Delivered On</span>
                            </div>
                            <span className="font-semibold text-emerald-600">
                              {new Date(
                                order.delivery.delivered_at,
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        )}

                        {/* Delivery Address */}
                        <Separator />
                        <div>
                          <div className="flex items-center gap-2 text-gray-600 mb-3">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <h3 className="font-bold">Delivery Address</h3>
                          </div>
                          <div className="ml-6 text-sm text-gray-700 space-y-1">
                            {order.delivery.address ? (
                              <>
                                <p className="font-medium">
                                  {order.delivery.address}
                                </p>
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
                              <p className="text-gray-500 italic">
                                No delivery address provided
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Truck className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-600 font-medium mb-1">
                          No delivery information yet
                        </p>
                        <p className="text-sm text-gray-500">
                          Delivery details will be added once the order is
                          processed
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Payment & Vendor */}
            <div className="lg:col-span-1 space-y-6">
              {/* Payment Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Card className="overflow-hidden rounded-2xl border-2 border-gray-100">
                  <div className="bg-gradient-to-r from-emerald-50 to-white px-6 py-4 border-b-2 border-gray-100">
                    <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-emerald-600" />
                      Payment Summary
                    </h2>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        ₦{(Number(order.subtotal) / 100).toLocaleString()}
                      </span>
                    </div>

                    {order.shipping_fee != null &&
                      Number(order.shipping_fee) > 0 && (
                        <div className="flex justify-between text-gray-700">
                          <span>Shipping Fee</span>
                          <span className="font-semibold">
                            ₦
                            {(
                              Number(order.shipping_fee) / 100
                            ).toLocaleString()}
                          </span>
                        </div>
                      )}

                    {order.platform_fee != null &&
                      Number(order.platform_fee) > 0 && (
                        <div className="flex justify-between text-gray-700">
                          <span>Platform Fee (2%)</span>
                          <span className="font-semibold">
                            ₦
                            {(
                              Number(order.platform_fee) / 100
                            ).toLocaleString()}
                          </span>
                        </div>
                      )}

                    {order.tax != null && Number(order.tax) > 0 && (
                      <div className="flex justify-between text-gray-700">
                        <span>Tax</span>
                        <span className="font-semibold">
                          ₦{(Number(order.tax) / 100).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-gray-900 text-lg">
                      <span className="font-black">Total</span>
                      <span className="font-black text-emerald-600">
                        ₦{(Number(order.total) / 100).toLocaleString()}
                      </span>
                    </div>
                    <Separator />
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method</span>
                        <span className="font-semibold text-gray-900 capitalize">
                          {order.payment_method}
                        </span>
                      </div>
                      {order.payment_reference && (
                        <div className="flex justify-between items-center group/ref">
                          <span className="text-gray-600">Reference</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-gray-900 line-clamp-1 max-w-[150px]">
                              {order.payment_reference}
                            </span>
                            <button
                              onClick={handleCopy}
                              className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-600"
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
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Vendor Information */}
              {order.vendor && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                >
                  <Card className="overflow-hidden rounded-2xl border-2 border-gray-100">
                    <div className="bg-gradient-to-r from-purple-50 to-white px-6 py-4 border-b-2 border-gray-100">
                      <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-purple-600" />
                        Seller Information
                      </h2>
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Store Details */}
                      {order.vendor.store ? (
                        <div className="flex items-center gap-4 p-3 rounded-xl bg-purple-50/50 border border-purple-100">
                          <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                            {order.vendor.store.logo ? (
                              <img
                                src={order.vendor.store.logo}
                                alt={order.vendor.store.store_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-purple-100 flex items-center justify-center text-purple-600">
                                <ShoppingBag className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 leading-tight">
                              {order.vendor.store.store_name}
                            </h3>
                            <button
                              onClick={() =>
                                navigate(`/stores/${order.vendor?.store?.slug}`)
                              }
                              className="text-xs font-bold text-purple-600 hover:text-purple-700 uppercase tracking-wider"
                            >
                              View Store Profile
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3">
                          <User className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">
                              Vendor Name
                            </p>
                            <p className="font-semibold text-gray-900">
                              {order.vendor.first_name} {order.vendor.last_name}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Mail className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">
                              Support Email
                            </p>
                            <a
                              href={`mailto:${order.vendor.email}`}
                              className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors break-all"
                            >
                              {order.vendor.email}
                            </a>
                          </div>
                        </div>

                        {(order.vendor.phone_number ||
                          order.vendor.store?.phone_number) && (
                          <div className="flex items-start gap-3">
                            <Phone className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 mb-1">
                                Phone Number
                              </p>
                              <a
                                href={`tel:${order.vendor.store?.phone_number || order.vendor.phone_number}`}
                                className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                              >
                                {order.vendor.store?.phone_number ||
                                  order.vendor.phone_number}
                              </a>
                            </div>
                          </div>
                        )}

                        {order.vendor.store?.address_street && (
                          <div className="flex items-start gap-3 border-t border-gray-100 pt-4">
                            <MapPin className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 mb-1">
                                Store Address
                              </p>
                              <p className="font-medium text-gray-900 text-sm">
                                {order.vendor.store.address_street}
                                {order.vendor.store.address_city &&
                                  `, ${order.vendor.store.address_city}`}
                                {order.vendor.store.address_state &&
                                  ` (${order.vendor.store.address_state})`}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Additional Notes */}
              {order.notes &&
                (() => {
                  try {
                    const parsedNotes = JSON.parse(order.notes);
                    // Only show notes if it's not just the platform fee metadata
                    if (
                      typeof parsedNotes === "object" &&
                      !parsedNotes.platform_fee
                    ) {
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 }}
                        >
                          <Card className="overflow-hidden rounded-2xl border-2 border-gray-100">
                            <div className="p-6">
                              <h3 className="text-sm font-bold text-gray-600 mb-2">
                                Order Notes
                              </h3>
                              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                                {JSON.stringify(parsedNotes, null, 2)}
                              </pre>
                            </div>
                          </Card>
                        </motion.div>
                      );
                    }
                    return null;
                  } catch {
                    // If notes is not JSON, display as plain text
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                      >
                        <Card className="overflow-hidden rounded-2xl border-2 border-gray-100">
                          <div className="p-6">
                            <h3 className="text-sm font-bold text-gray-600 mb-2">
                              Order Notes
                            </h3>
                            <p className="text-sm text-gray-700">
                              {order.notes}
                            </p>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  }
                })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
