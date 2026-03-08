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
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div className="relative w-full lg:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide -mx-2 px-2 lg:mx-0 lg:px-0">
          {(["all", "system", "vendor", "security", "admin"] as const).map(
            (key) => (
              <Button
                key={key}
                variant={filter === key ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-8 sm:h-9 px-4 rounded-full text-xs sm:text-[13px] font-bold shrink-0 transition-all",
                  filter === key && "shadow-md shadow-primary/10",
                )}
                onClick={() => setFilter(key)}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Button>
            ),
          )}
        </div>
      </motion.div>

      {/* ─── Logs Table ─── */}
      <Card className="border border-border/40 shadow-xl shadow-black/5 rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 px-4 sm:px-6">
          <CardTitle className="text-lg font-black">Activity Log</CardTitle>
          <CardDescription className="text-xs">
            Full history of platform operations.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/20">
                  <TableHead className="text-[11px] font-black uppercase tracking-wider px-4 sm:px-6">
                    Timestamp
                  </TableHead>
                  <TableHead className="text-[11px] font-black uppercase tracking-wider px-4 sm:px-6">
                    Actor
                  </TableHead>
                  <TableHead className="text-[11px] font-black uppercase tracking-wider px-4 sm:px-6">
                    Action
                  </TableHead>
                  <TableHead className="text-[11px] font-black uppercase tracking-wider px-4 sm:px-6">
                    Category
                  </TableHead>
                  <TableHead className="text-[11px] font-black uppercase tracking-wider px-4 sm:px-6">
                    Status
                  </TableHead>
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
                        className="border-b border-border/20 hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="text-[11px] sm:text-xs text-muted-foreground whitespace-nowrap px-4 sm:px-6">
                          {log.timestamp}
                        </TableCell>
                        <TableCell className="font-bold text-xs sm:text-sm whitespace-nowrap px-4 sm:px-6">
                          {log.actor}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm min-w-[200px] px-4 sm:px-6">
                          {log.action}
                        </TableCell>
                        <TableCell className="capitalize px-4 sm:px-6">
                          <div className="flex items-center gap-2">
                            <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="text-xs font-bold">
                              {log.type}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 sm:px-6">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight",
                              statusColors[log.status],
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
                      className="text-center py-12 text-muted-foreground text-xs font-medium"
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
      >
        {[
          { icon: CheckCircle2, label: "Successful Operations", value: "92%" },
          { icon: AlertCircle, label: "Warnings Logged", value: "5%" },
          { icon: XCircle, label: "Critical Events", value: "3%" },
          { icon: Database, label: "Last Backup", value: "2h ago" },
        ].map((item, i) => (
          <Card
            key={i}
            className="border border-border/30 shadow-sm flex items-center gap-4 p-4 sm:p-5"
          >
            <item.icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider truncate">
                {item.label}
              </p>
              <p className="text-lg sm:text-xl font-black">{item.value}</p>
            </div>
          </Card>
        ))}
      </motion.div>
    </section>
  );
}
