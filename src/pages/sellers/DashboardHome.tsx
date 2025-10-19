"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ShoppingBag, DollarSign, Star } from "lucide-react";

export default function DashboardHome() {
  const metrics = [
    {
      title: "Total Revenue",
      value: "$12,450",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Products Sold",
      value: "238",
      icon: ShoppingBag,
      color: "text-blue-600",
    },
    {
      title: "Store Rating",
      value: "4.8 / 5",
      icon: Star,
      color: "text-yellow-500",
    },
    {
      title: "Growth",
      value: "+12.3%",
      icon: TrendingUp,
      color: "text-emerald-600",
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card
            key={metric.title}
            className="bg-white shadow-sm hover:shadow-md transition-all rounded-xl"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
