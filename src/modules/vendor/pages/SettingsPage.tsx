"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Upload, Save, Palette, Globe, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SettingsPage() {
  return (
    <section className="space-y-10">
      {/* ─── Header ─── */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Store Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage store preferences, customization, and account settings.
        </p>
      </div>

      {/* ─── Settings Tabs ─── */}
      <Tabs defaultValue="customization" className="w-full">
        <TabsList className="flex flex-wrap justify-start gap-2 sm:gap-6 bg-transparent py-3 px-1 border-b border-border/20">
          {[
            { value: "customization", label: "Store Customization" },
            { value: "account", label: "Account Settings" },
            { value: "preferences", label: "Preferences" },
            { value: "payouts", label: "Payments & Payouts" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "px-4 py-2.5 text-sm font-medium rounded-full transition-all duration-200",
                "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                "data-[state=active]:bg-primary/30 data-[state=active]:text-foreground"
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ─────────────────────────────────────────────── */}
        {/* STORE CUSTOMIZATION TAB */}
        {/* ─────────────────────────────────────────────── */}
        <TabsContent value="customization" className="pt-8">
          <Card className="border border-border/30 shadow-sm">
            <CardHeader>
              <CardTitle>Store Customization</CardTitle>
              <CardDescription>
                Update your store’s appearance and identity.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Banner Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Store Banner</Label>
                <div className="border border-dashed border-border/40 rounded-md p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Upload header or banner image (recommended 1200x400px)
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="h-4 w-4" /> Upload
                  </Button>
                </div>
              </div>

              {/* Store Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Store Name</Label>
                  <Input placeholder="Enter your store name" />
                </div>
                <div className="space-y-2">
                  <Label>Username (handle)</Label>
                  <Input placeholder="@yourstorename" />
                </div>
              </div>

              {/* Store Description */}
              <div className="space-y-2">
                <Label>Store Description</Label>
                <Input placeholder="A short description about your store" />
              </div>

              <Button
                className="bg-primary text-white rounded-full mt-4"
                onClick={() => toast.success("Store customization saved!")}
              >
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─────────────────────────────────────────────── */}
        {/* ACCOUNT SETTINGS TAB */}
        {/* ─────────────────────────────────────────────── */}
        <TabsContent value="account" className="pt-8">
          <Card className="border border-border/30 shadow-sm">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Update your account information and contact details.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input placeholder="+234 801 234 5678" />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" placeholder="********" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input type="password" placeholder="********" />
                </div>
              </div>

              <Button
                className="bg-primary text-white rounded-full mt-4"
                onClick={() => toast.success("Account info updated!")}
              >
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─────────────────────────────────────────────── */}
        {/* PREFERENCES TAB */}
        {/* ─────────────────────────────────────────────── */}
        <TabsContent value="preferences" className="pt-8">
          <Card className="border border-border/30 shadow-sm">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Set your theme, language, and currency preferences.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Theme */}
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select defaultValue="light">
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <Palette className="h-4 w-4 inline mr-2" /> Light
                      </SelectItem>
                      <SelectItem value="dark">
                        <Palette className="h-4 w-4 inline mr-2" /> Dark
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Language */}
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">
                        <Globe className="h-4 w-4 inline mr-2" /> English
                      </SelectItem>
                      <SelectItem value="fr">
                        <Globe className="h-4 w-4 inline mr-2" /> French
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Currency */}
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select defaultValue="NGN">
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">₦ - Naira</SelectItem>
                      <SelectItem value="USD">$ - US Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Notifications */}
                <div className="flex items-center justify-between border rounded-md p-3 mt-3">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive important updates via email
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Button
                className="bg-primary text-white rounded-full mt-4"
                onClick={() => toast.success("Preferences updated!")}
              >
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─────────────────────────────────────────────── */}
        {/* PAYOUTS TAB */}
        {/* ─────────────────────────────────────────────── */}
        <TabsContent value="payouts" className="pt-8">
          <Card className="border border-border/30 shadow-sm">
            <CardHeader>
              <CardTitle>Payments & Payouts</CardTitle>
              <CardDescription>
                Configure your bank and payout preferences.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <Input placeholder="e.g. GTBank" />
                </div>
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input placeholder="1234567890" />
                </div>
                <div className="space-y-2">
                  <Label>Account Holder Name</Label>
                  <Input placeholder="John Vendor" />
                </div>
                <div className="space-y-2">
                  <Label>Payout Frequency</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger>
                      <SelectValue placeholder="Select payout frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                className="bg-primary text-white rounded-full mt-4"
                onClick={() => toast.success("Payout settings saved!")}
              >
                <CreditCard className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
