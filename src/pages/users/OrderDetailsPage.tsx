"use client";

import HomepageLayout from "@/components/layout/homepage/HomePageLayout";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const mockOrders = [
  {
    id: 1,
    name: "Leather Handbag",
    price: "$120",
    quantity: 1,
    image: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=800",
    status: "Delivered",
    date: "Oct 12, 2025",
    address: "42 Lekki Phase 1, Lagos, Nigeria",
    paymentMethod: "Credit Card (**** 2345)",
    trackingNumber: "ESY-348921",
  },
  {
    id: 2,
    name: "Wireless Headphones",
    price: "$99.99",
    quantity: 2,
    image: "https://images.unsplash.com/photo-1585386959984-a41552231693?w=800",
    status: "Shipped",
    date: "Oct 15, 2025",
    address: "12 Gwarimpa Avenue, Abuja, Nigeria",
    paymentMethod: "Paystack",
    trackingNumber: "ESY-553841",
  },
];

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const order = mockOrders.find((o) => o.id === Number(id));

  if (!order) {
    return (
      <HomepageLayout>
        <main className="min-h-screen flex items-center justify-center bg-emerald-50">
          <p className="text-muted-foreground text-lg">
            Order not found or may have been deleted.
          </p>
        </main>
      </HomepageLayout>
    );
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "Shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <HomepageLayout>
      <main className="min-h-screen bg-emerald-50 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="flex items-center gap-3 mb-10">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => navigate(-1)} // 👈 go one step back
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <h1 className="text-3xl font-bold text-primary">Order Details</h1>
          </div>

          {/* Order Card */}
          <Card className="rounded-2xl shadow-sm bg-white overflow-hidden">
            <img
              src={order.image}
              alt={order.name}
              className="w-full h-64 object-cover"
            />

            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                {order.name}
              </CardTitle>
              <Badge className={`${statusColor(order.status)} mt-2`}>
                {order.status}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Order Date:</span>
                <span className="font-medium">{order.date}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-medium">{order.price}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Quantity:</span>
                <span className="font-medium">{order.quantity}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tracking Number:</span>
                <span className="font-medium">{order.trackingNumber}</span>
              </div>

              <Separator />

              <div className="flex flex-col space-y-2">
                <span className="text-muted-foreground">Shipping Address:</span>
                <p className="font-medium text-sm leading-relaxed">
                  {order.address}
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                <span className="text-muted-foreground">Payment Method:</span>
                <p className="font-medium text-sm">{order.paymentMethod}</p>
              </div>

              <div className="pt-6 flex justify-end">
                <Button
                  onClick={() => navigate(`/product/${order.id}`)}
                  className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  View Product
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </HomepageLayout>
  );
}
