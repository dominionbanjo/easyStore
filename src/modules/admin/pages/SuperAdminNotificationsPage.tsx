import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Send,
  Mail,
  Megaphone,
  Database,
  Server,
  Download,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// ─────────────────────────────
// Mock notification dataset
// ─────────────────────────────
const notifications = [
  {
    id: 1,
    title: "System Maintenance Scheduled",
    message:
      "The platform will undergo scheduled maintenance on November 1st between 2 AM and 4 AM UTC.",
    type: "system",
    date: "2025-10-27 08:30",
    status: "active",
    icon: Server,
  },
  {
    id: 2,
    title: "Vendor Verification Completed",
    message: "UrbanStayz has successfully completed KYC verification.",
    type: "vendor",
    date: "2025-10-26 15:12",
    status: "read",
    icon: CheckCircle2,
  },
  {
    id: 3,
    title: "High Refund Activity Detected",
    message:
      "Increased refund requests from 'SafariDreams' detected in the last 24 hours.",
    type: "alert",
    date: "2025-10-26 09:48",
    status: "unread",
    icon: AlertTriangle,
  },
  {
    id: 4,
    title: "User Feedback Received",
    message: "A new feedback has been submitted by user: linda@example.com.",
    type: "user",
    date: "2025-10-25 12:40",
    status: "active",
    icon: Mail,
  },
  {
    id: 5,
    title: "Database Optimization Complete",
    message: "The system database cleanup process completed successfully.",
    type: "system",
    date: "2025-10-24 03:18",
    status: "read",
    icon: Database,
  },
  {
    id: 6,
    title: "New Announcement Published",
    message:
      "‘easystore October Updates’ announcement is now live on the dashboard.",
    type: "announcement",
    date: "2025-10-23 18:10",
    status: "unread",
    icon: Megaphone,
  },
];

const typeColors: Record<string, string> = {
  system: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  vendor:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  user: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  alert:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  announcement:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};

export default function SuperAdminNotificationsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "system" | "vendor" | "user" | "alert" | "announcement"
  >("all");

  const filtered = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || n.type === filter;
    return matchesSearch && matchesFilter;
  });

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
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Monitor platform-wide alerts, announcements, and vendor/user system
            messages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button className="gap-2">
            <Send className="h-4 w-4" /> Send Notification
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export
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
            placeholder="Search alerts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide -mx-2 px-2 lg:mx-0 lg:px-0">
          {(
            [
              "all",
              "system",
              "vendor",
              "user",
              "alert",
              "announcement",
            ] as const
          ).map((key) => (
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
          ))}
        </div>
      </motion.div>

      {/* ─── Notifications List ─── */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {filtered.length > 0 ? (
          filtered.map((n, i) => {
            const Icon = n.icon;
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border border-border/30 shadow-sm hover:shadow-md transition-all duration-300">
                  <CardHeader className="flex items-start justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "p-2 rounded-full bg-muted",
                          n.status === "unread" && "ring-2 ring-primary",
                        )}
                      >
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold">
                          {n.title}
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">
                          {n.date}
                        </CardDescription>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Bell className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Mark as Read</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-sm leading-relaxed">{n.message}</p>
                    <div className="flex items-center justify-between mt-3">
                      <Badge
                        className={cn(
                          "text-xs font-medium capitalize",
                          typeColors[n.type],
                        )}
                      >
                        {n.type}
                      </Badge>

                      <span
                        className={cn(
                          "text-xs font-medium",
                          n.status === "unread"
                            ? "text-primary"
                            : "text-muted-foreground",
                        )}
                      >
                        {n.status === "unread" ? "Unread" : "Read"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full text-center text-muted-foreground py-12">
            No notifications found.
          </div>
        )}
      </motion.div>
    </section>
  );
}
