"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast } from "sonner";

export default function Settings() {
  const [plan, setPlan] = useState("Basic");

  const handleUpgrade = (next: string) => {
    setPlan(next);
    toast.success(`Plan upgraded to ${next}`);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Account Settings</h2>

      {/* SUBSCRIPTION PLAN */}
      <Card className="shadow-sm rounded-xl">
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Your current plan: <span className="font-semibold">{plan}</span>
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            {["Basic", "Pro", "Enterprise"].map((tier) => (
              <Card
                key={tier}
                className={`p-4 border ${
                  plan === tier
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
              >
                <CardTitle className="text-lg font-semibold mb-2">
                  {tier}
                </CardTitle>
                <p className="text-sm text-muted-foreground mb-4">
                  {tier === "Basic" && "Free tier with limited features."}
                  {tier === "Pro" && "Perfect for growing sellers."}
                  {tier === "Enterprise" && "Advanced analytics and features."}
                </p>
                <Button
                  variant={plan === tier ? "default" : "outline"}
                  onClick={() => handleUpgrade(tier)}
                  className="w-full rounded-full"
                >
                  {plan === tier ? "Active" : "Choose Plan"}
                </Button>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PAYOUT SETTINGS */}
      <Card className="shadow-sm rounded-xl">
        <CardHeader>
          <CardTitle>Payout Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <Label>Bank Name</Label>
              <Input placeholder="Access Bank" />
            </div>
            <div>
              <Label>Account Number</Label>
              <Input placeholder="0123456789" />
            </div>
          </div>
          <div>
            <Label>Account Holder Name</Label>
            <Input placeholder="John Doe" />
          </div>

          <Button className="rounded-full bg-primary text-white mt-3">
            Save Payout Details
          </Button>
        </CardContent>
      </Card>

      {/* NOTIFICATIONS */}
      <Card className="shadow-sm rounded-xl">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Order Updates</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex justify-between items-center">
            <Label>Product Reviews</Label>
            <Switch />
          </div>
          <div className="flex justify-between items-center">
            <Label>Monthly Analytics Report</Label>
            <Switch defaultChecked />
          </div>
          <Separator className="my-4" />
          <Button className="rounded-full bg-primary text-white">
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
