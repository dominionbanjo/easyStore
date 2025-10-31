"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  ArrowLeft,
  Mail,
  Phone,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

// ✅ Mock Order Details Data
const mockOrderDetails = {
  id: "ORD-98432",
  date: "2025-10-12",
  status: "Delivered",
  paymentStatus: "Paid",
  trackingNumber: "TRK123456NG",
  paymentMethod: "Card (Visa **** 3321)",
  shippingAddress: {
    name: "John Doe",
    phone: "+234 812 345 6789",
    email: "john.doe@example.com",
    address: "12A Lekki Gardens, Phase II, Lagos, Nigeria",
  },
  items: [
    {
      name: "Handcrafted Leather Bag",
      image: "/images/mock-bag.jpg",
      price: 95000,
      quantity: 1,
    },
    {
      name: "Minimal Ceramic Vase",
      image: "/images/mock-vase.jpg",
      price: 18000,
      quantity: 2,
    },
  ],
  subtotal: 131000,
  shippingFee: 2000,
  total: 133000,
};

export default function OrderDetailsPage() {
  const navigate = useNavigate();
  const [order] = useState(mockOrderDetails);

  const handleReorder = () => toast.success("Items added to cart again!");
  const handleTrack = () => toast.info("Tracking link coming soon.");

  return (
    <section className="min-h-screen bg-emerald-50/40 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* 🔙 Back Button */}
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          onClick={() => navigate("/orders")}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Button>

        {/* 🧾 Order Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.id}
            </h1>
            <p className="text-gray-600 flex items-center gap-2 mt-1 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              Ordered on {new Date(order.date).toLocaleDateString()}
            </p>
          </div>

          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium capitalize mt-3 sm:mt-0",
              order.status === "Delivered" &&
                "bg-green-100 text-green-700 border-green-300",
              order.status === "Pending" &&
                "bg-yellow-100 text-yellow-700 border-yellow-300",
              order.status === "Cancelled" &&
                "bg-red-100 text-red-700 border-red-300",
              order.status === "Shipped" &&
                "bg-blue-100 text-blue-700 border-blue-300"
            )}
          >
            {order.status === "Delivered" && (
              <CheckCircle className="h-4 w-4" />
            )}
            {order.status === "Pending" && <Package className="h-4 w-4" />}
            {order.status === "Shipped" && <Truck className="h-4 w-4" />}
            {order.status === "Cancelled" && <XCircle className="h-4 w-4" />}
            {order.status}
          </Badge>
        </div>

        {/* 📦 Order Items */}
        <Card className="bg-white border rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Items in this Order
            </CardTitle>
          </CardHeader>

          <CardContent className="divide-y">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row justify-between gap-4 py-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-gray-600 text-sm">
                      ₦{item.price.toLocaleString()} × {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-gray-900 font-semibold">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 🚚 Shipping Info */}
        <Card className="bg-white border rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Shipping Information
            </CardTitle>
            <CardDescription>
              Tracking number:{" "}
              <span className="font-medium">{order.trackingNumber}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 flex items-center justify-between">
            <div className="flex items-start gap-3 text-gray-700">
              <MapPin className="h-5 w-5 text-gray-500 mt-1" />
              <div>
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p className="text-sm">{order.shippingAddress.address}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {order.shippingAddress.phone}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {order.shippingAddress.email}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 💳 Payment Summary */}
        <Card className="bg-white border rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Payment Summary
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₦{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span>₦{order.shippingFee.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span>₦{order.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>Payment Method</span>
              <span>{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Status</span>
              <Badge
                variant="outline"
                className={cn(
                  "capitalize",
                  order.paymentStatus === "Paid"
                    ? "bg-green-100 text-green-700 border-green-300"
                    : "bg-yellow-100 text-yellow-700 border-yellow-300"
                )}
              >
                {order.paymentStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* ⚙️ Actions */}
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="outline" onClick={handleTrack}>
            Track Package
          </Button>
          <Button
            onClick={handleReorder}
            className="bg-primary text-white hover:bg-primary/90 rounded-full"
          >
            Reorder Items
          </Button>
        </div>
      </div>
    </section>
  );
}
