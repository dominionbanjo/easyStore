import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  MoreVertical,
  Receipt,
  Wallet,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Mock dataset
const transactions = [
  {
    id: "tx001",
    vendor: "UrbanStayz Ltd",
    user: "John Doe",
    amount: 123.5,
    type: "booking",
    status: "completed",
    date: "2025-01-17",
    reference: "BK-28934",
  },
  {
    id: "tx002",
    vendor: "SafariDreams",
    user: "Angela K.",
    amount: 89.99,
    type: "moment",
    status: "pending",
    date: "2025-01-19",
    reference: "MM-99823",
  },
  {
    id: "tx003",
    vendor: "EcoHaven Apartments",
    user: "Oluwaseun Ade",
    amount: 450.0,
    type: "stay",
    status: "refunded",
    date: "2025-02-10",
    reference: "ST-11021",
  },
  {
    id: "tx004",
    vendor: "LuxeLife Villas",
    user: "Fatima Bello",
    amount: 340.25,
    type: "stay",
    status: "completed",
    date: "2025-02-15",
    reference: "ST-44190",
  },
  {
    id: "tx005",
    vendor: "CoastalChill Resort",
    user: "David Chen",
    amount: 210.75,
    type: "booking",
    status: "failed",
    date: "2025-02-20",
    reference: "BK-55721",
  },
];

const statusColors: Record<string, string> = {
  completed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  refunded: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

export default function SuperAdminTransactionsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "completed" | "pending" | "refunded" | "failed"
  >("all");

  const filteredTx = transactions.filter((tx) => {
    const matchesSearch =
      tx.vendor.toLowerCase().includes(search.toLowerCase()) ||
      tx.user.toLowerCase().includes(search.toLowerCase()) ||
      tx.reference.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || tx.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <section className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Transactions Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor all platform transactions, vendor payouts, and user
            bookings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </motion.div>

      {/* Search + Filters */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-3"
      >
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by vendor, user, or ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex items-center gap-2">
          {(["all", "completed", "pending", "refunded", "failed"] as const).map(
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

      {/* Transactions Table */}
      <Card className="border border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle>Transactions Overview</CardTitle>
          <CardDescription>
            Track all user payments, vendor payouts, and refunds across the
            ecosystem.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto rounded-md border border-border/20">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredTx.length > 0 ? (
                  filteredTx.map((tx, i) => (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border/20 hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        {tx.reference}
                      </TableCell>
                      <TableCell>{tx.vendor}</TableCell>
                      <TableCell>{tx.user}</TableCell>
                      <TableCell className="capitalize">{tx.type}</TableCell>
                      <TableCell className="font-medium">
                        ${tx.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            statusColors[tx.status]
                          )}
                        >
                          {tx.status.charAt(0).toUpperCase() +
                            tx.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {tx.date}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuLabel>
                              Transaction Actions
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2">
                              <Receipt className="h-4 w-4 text-blue-500" />
                              View Receipt
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Wallet className="h-4 w-4 text-emerald-500" />
                              Process Payout
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              Mark Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-yellow-600">
                              <AlertTriangle className="h-4 w-4" />
                              Flag Transaction
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-red-600">
                              <XCircle className="h-4 w-4" />
                              Refund / Cancel
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-10 text-muted-foreground text-sm"
                    >
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
