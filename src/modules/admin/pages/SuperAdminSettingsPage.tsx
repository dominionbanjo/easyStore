import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Settings, Palette, Cloud } from "lucide-react";

export default function SuperAdminSettingsPage() {
  const [theme, setTheme] = useState("system");
  const [autoUpdates, setAutoUpdates] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [twoFA, setTwoFA] = useState(false);

  return (
    <section className="space-y-8">
      {/* ─── Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Platform Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure global platform behavior, themes, integrations, and
            security policies.
          </p>
        </div>
        <Button className="gap-2">
          <Cloud className="h-4 w-4" /> Save All Changes
        </Button>
      </motion.div>

      {/* ─── Settings Tabs ─── */}
      <Tabs defaultValue="general" className="w-full space-y-6">
        <TabsList className="flex flex-wrap justify-start gap-2 bg-transparent border-b border-border/30 pb-2">
          <TabsTrigger
            value="general"
            className="data-[state=active]:text-primary"
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="data-[state=active]:text-primary"
          >
            Appearance
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="data-[state=active]:text-primary"
          >
            Integrations
          </TabsTrigger>
          <TabsTrigger
            value="system"
            className="data-[state=active]:text-primary"
          >
            System
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:text-primary"
          >
            Security
          </TabsTrigger>
        </TabsList>

        {/* ─── General Settings ─── */}
        <TabsContent value="general">
          <Card className="border border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle>General Preferences</CardTitle>
              <CardDescription>
                Control your platform name, description, and contact info.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-6">
              <div>
                <Label>Platform Name</Label>
                <Input placeholder="StayAfrika HQ" />
              </div>
              <div>
                <Label>Support Email</Label>
                <Input type="email" placeholder="support@stayafrika.com" />
              </div>
              <div className="sm:col-span-2">
                <Label>Platform Description</Label>
                <Textarea placeholder="Your all-in-one homestay and vendor management platform for Africa." />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button>Save General Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ─── Appearance Settings ─── */}
        <TabsContent value="appearance">
          <Card className="border border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle>Appearance & Theme</CardTitle>
              <CardDescription>
                Manage light/dark modes, accent color, and brand visuals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Theme Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    Choose between light, dark, or system default.
                  </p>
                </div>
                <select
                  className="bg-muted border rounded-md p-2 text-sm"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Custom Branding</Label>
                  <p className="text-xs text-muted-foreground">
                    Upload your logo, favicon, or custom brand colors.
                  </p>
                </div>
                <Button variant="outline" className="gap-2">
                  <Palette className="h-4 w-4" /> Manage Branding
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Integrations ─── */}
        <TabsContent value="integrations">
          <Card className="border border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
              <CardDescription>
                Manage API keys and third-party connections.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-6">
              <div>
                <Label>Google API Key</Label>
                <Input placeholder="AIza..." type="password" />
              </div>
              <div>
                <Label>Cloudinary API Key</Label>
                <Input placeholder="CLOUD1234..." type="password" />
              </div>
              <div>
                <Label>Mailgun API Key</Label>
                <Input placeholder="MAILGUN-KEY..." type="password" />
              </div>
              <div>
                <Label>Stripe Public Key</Label>
                <Input placeholder="pk_live_..." type="password" />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="outline">Save Integrations</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ─── System Settings ─── */}
        <TabsContent value="system">
          <Card className="border border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle>System Operations</CardTitle>
              <CardDescription>
                Manage performance settings, maintenance mode, and update
                frequency.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Automatic Updates</Label>
                  <p className="text-xs text-muted-foreground">
                    Keep your system up-to-date with the latest patches.
                  </p>
                </div>
                <Switch
                  checked={autoUpdates}
                  onCheckedChange={setAutoUpdates}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Maintenance Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    Temporarily restrict user access during updates.
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button>Save System Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ─── Security Settings ─── */}
        <TabsContent value="security">
          <Card className="border border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle>Security & Access</CardTitle>
              <CardDescription>
                Control access rules, two-factor authentication, and
                notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-xs text-muted-foreground">
                    Require admins to log in with a second verification step.
                  </p>
                </div>
                <Switch checked={twoFA} onCheckedChange={setTwoFA} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Notify administrators about critical activities.
                  </p>
                </div>
                <Switch
                  checked={emailAlerts}
                  onCheckedChange={setEmailAlerts}
                />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="outline">Save Security Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
