import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  Server,
  Activity,
  AlertCircle,
  Shield,
  User,
  Terminal,
  Database,
  CheckCircle2,
  XCircle,
  Info,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

const logs = [
  {
    id: 1,
    timestamp: "2025-10-28 09:45:12",
    actor: "System",
    action: "Database backup completed",
    type: "system",
    status: "success",
  },
  {
    id: 2,
    timestamp: "2025-10-28 09:21:55",
    actor: "Vendor: UrbanStayz",
    action: "Product update — ID #498",
    type: "vendor",
    status: "success",
  },
  {
    id: 3,
    timestamp: "2025-10-28 08:54:39",
    actor: "User: john@example.com",
    action: "Attempted login with invalid credentials",
    type: "security",
    status: "warning",
  },
  {
    id: 4,
    timestamp: "2025-10-28 08:45:02",
    actor: "System",
    action: "Cache purge triggered",
    type: "system",
    status: "info",
  },
  {
    id: 5,
    timestamp: "2025-10-27 22:33:11",
    actor: "Admin: SuperAdmin",
    action: "Manually restricted vendor account",
    type: "admin",
    status: "critical",
  },
  {
    id: 6,
    timestamp: "2025-10-27 21:11:48",
    actor: "Vendor: EcoStay",
    action: "Payout request initiated",
    type: "vendor",
    status: "info",
  },
];

const typeIcons: Record<string, any> = {
  system: Server,
  vendor: Activity,
  user: User,
  security: Shield,
  admin: Terminal,
};

const statusColors: Record<string, string> = {
  success:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  warning:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  critical: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
};

export default function SuperAdminLogsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "system" | "vendor" | "security" | "admin"
  >("all");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || log.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <section className="space-y-8">
      {/* ─── Page Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Logs</h1>
          <p className="text-sm text-muted-foreground">
            Review all system activities, admin actions, vendor updates, and
            security events in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" /> Export Logs
          </Button>
        </div>
      </motion.div>

      {/* ─── Filters + Search ─── */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-3"
      >
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex items-center gap-2">
          {(["all", "system", "vendor", "security", "admin"] as const).map(
            (key) => (
              <Button
                key={key}
                variant={filter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(key)}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Button>
            )
          )}
        </div>
      </motion.div>

      {/* ─── Logs Table ─── */}
      <Card className="border border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            View the full history of operations and activities across the
            platform.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto rounded-md border border-border/20">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log, i) => {
                    const Icon = typeIcons[log.type] || Info;
                    return (
                      <motion.tr
                        key={log.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-border/20 hover:bg-muted/50"
                      >
                        <TableCell className="text-sm text-muted-foreground">
                          {log.timestamp}
                        </TableCell>
                        <TableCell className="font-medium">
                          {log.actor}
                        </TableCell>
                        <TableCell className="text-sm">{log.action}</TableCell>
                        <TableCell className="capitalize flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" />
                          {log.type}
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium capitalize",
                              statusColors[log.status]
                            )}
                          >
                            {log.status}
                          </span>
                        </TableCell>
                      </motion.tr>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-10 text-muted-foreground text-sm"
                    >
                      No logs found for the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ─── System Overview Summary ─── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { icon: CheckCircle2, label: "Successful Operations", value: "92%" },
          { icon: AlertCircle, label: "Warnings Logged", value: "5%" },
          { icon: XCircle, label: "Critical Events", value: "3%" },
          { icon: Database, label: "Last Backup", value: "2 hours ago" },
        ].map((item, i) => (
          <Card
            key={i}
            className="border border-border/30 shadow-sm flex items-center gap-3 p-4"
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
    </section>
  );
}
