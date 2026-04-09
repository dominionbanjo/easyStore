import { useState } from "react";
import { motion } from "framer-motion";
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
import { Separator } from "@/components/ui/separator";
import {
  Server,
  Database,
  Cloud,
  RefreshCw,
  Shield,
  Cpu,
  AlertTriangle,
  Download,
} from "lucide-react";

export default function SuperAdminServerConfigPage() {
  const [maintenance, setMaintenance] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [cacheEnabled, setCacheEnabled] = useState(true);
  const [apiMode, setApiMode] = useState("production");

  return (
    <section className="space-y-10">
      {/* ─── Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Server className="h-6 w-6 text-primary" />
            Server Configuration
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage environment variables, caching, performance tuning, and
            backup settings for your backend infrastructure.
          </p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" /> Export Config
        </Button>
      </motion.div>

      {/* ─── Server Overview ─── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { icon: Cloud, label: "Environment", value: apiMode.toUpperCase() },
          { icon: Cpu, label: "Active Nodes", value: "4" },
          { icon: Database, label: "Database Health", value: "Stable" },
          { icon: RefreshCw, label: "Uptime", value: "99.97%" },
        ].map((item, i) => (
          <Card
            key={i}
            className="border border-border/30  flex items-center gap-3 p-4"
          >
            <item.icon className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {item.label}
              </p>
              <p className="text-lg font-semibold">{item.value}</p>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* ─── Configuration Panels ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Environment Settings */}
        <Card className="border border-border/40 ">
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>
              Configure current backend API mode, database connection, and
              caching policy.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>API Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Choose between development, staging, or production.
                </p>
              </div>
              <select
                value={apiMode}
                onChange={(e) => setApiMode(e.target.value)}
                className="border rounded-sm p-2 bg-muted text-sm"
              >
                <option value="development">Development</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </div>

            <Separator />

            <div>
              <Label>Database URL</Label>
              <Input
                placeholder="postgresql://user:pass@host:5432/eazystore_db"
                type="password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Query Caching</Label>
                <p className="text-xs text-muted-foreground">
                  Improve API performance by caching frequent database queries.
                </p>
              </div>
              <Switch
                checked={cacheEnabled}
                onCheckedChange={setCacheEnabled}
              />
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button variant="outline">Save Environment Settings</Button>
          </CardFooter>
        </Card>

        {/* Maintenance + Backup */}
        <Card className="border border-border/40 ">
          <CardHeader>
            <CardTitle>Maintenance & Backup</CardTitle>
            <CardDescription>
              Control downtime, automatic database backups, and restore
              frequency.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Maintenance Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Restrict access while performing server updates or migrations.
                </p>
              </div>
              <Switch checked={maintenance} onCheckedChange={setMaintenance} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Automatic Backups</Label>
                <p className="text-xs text-muted-foreground">
                  Run scheduled nightly backups for database and media storage.
                </p>
              </div>
              <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
            </div>

            <div>
              <Label>Backup Interval (hours)</Label>
              <Input type="number" defaultValue={24} min={1} />
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button>Save Backup Settings</Button>
          </CardFooter>
        </Card>

        {/* Security Controls */}
        <Card className="border border-border/40  lg:col-span-2">
          <CardHeader>
            <CardTitle>Security Configuration</CardTitle>
            <CardDescription>
              Manage server firewalls, access keys, and rate limits.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-6">
            <div>
              <Label>API Rate Limit</Label>
              <Input placeholder="100 requests/min" />
            </div>
            <div>
              <Label>Admin Access Key</Label>
              <Input placeholder="SECRET-KEY..." type="password" />
            </div>
            <div>
              <Label>JWT Secret</Label>
              <Input placeholder="supersecret..." type="password" />
            </div>
            <div className="flex items-center justify-between sm:col-span-2">
              <div>
                <Label>Enable Firewall Protection</Label>
                <p className="text-xs text-muted-foreground">
                  Blocks unauthorized IPs from accessing internal routes.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button variant="outline" className="gap-2">
              <Shield className="h-4 w-4" /> Save Security Rules
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* ─── Danger Zone ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-destructive/40 border  bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" /> Danger Zone
            </CardTitle>
            <CardDescription className="text-destructive/80">
              Proceed with caution — these actions may cause downtime or data
              loss.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-medium text-sm">Reset All Configurations</p>
              <p className="text-xs text-muted-foreground">
                Restore server configuration to default state.
              </p>
            </div>
            <Button variant="destructive" className="gap-2">
              <RefreshCw className="h-4 w-4" /> Reset Server
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
