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
  BadgeCheck,
  Ban,
  MoreVertical,
  Search,
  Store,
  Filter,
  UserCheck,
  AlertTriangle,
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

// Mock vendor data
const vendors = [
  {
    id: "v1",
    name: "UrbanStayz Ltd",
    owner: "James Doe",
    email: "admin@urbanstayz.com",
    status: "active",
    sales: "$24,350",
    joined: "2024-03-12",
  },
  {
    id: "v2",
    name: "SafariDreams",
    owner: "Angela K.",
    email: "angela@safaridreams.africa",
    status: "suspended",
    sales: "$7,820",
    joined: "2023-12-01",
  },
  {
    id: "v3",
    name: "EcoHaven Apartments",
    owner: "Oluwaseun Ade",
    email: "eco@haven.ng",
    status: "pending",
    sales: "$0",
    joined: "2025-02-08",
  },
  {
    id: "v4",
    name: "LuxeLife Villas",
    owner: "Fatima Bello",
    email: "fatima@luxelife.com",
    status: "active",
    sales: "$15,120",
    joined: "2024-09-17",
  },
];

const statusColors: Record<string, string> = {
  active:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  suspended: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

export default function SuperAdminVendorsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "active" | "pending" | "suspended"
  >("all");

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(search.toLowerCase()) ||
      vendor.owner.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || vendor.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <section className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Vendors Management
          </h1>
          <p className="text-sm text-muted-foreground">
            View and manage all vendor accounts across the StayAfrika platform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
          <Button className="gap-2">
            <Store className="h-4 w-4" /> Add Vendor
          </Button>
        </div>
      </motion.div>

      {/* Search + Filter Controls */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-3"
      >
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex items-center gap-2">
          {(["all", "active", "pending", "suspended"] as const).map((key) => (
            <Button
              key={key}
              variant={filter === key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(key)}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Vendors Table */}
      <Card className="border border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle>Vendors Overview</CardTitle>
          <CardDescription>
            Manage vendor lifecycle, verify identities, and enforce
            restrictions.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto rounded-md border border-border/20">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Vendor</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredVendors.length > 0 ? (
                  filteredVendors.map((vendor, i) => (
                    <motion.tr
                      key={vendor.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border/20 hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        {vendor.name}
                      </TableCell>
                      <TableCell>{vendor.owner}</TableCell>
                      <TableCell>{vendor.email}</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            statusColors[vendor.status]
                          )}
                        >
                          {vendor.status.charAt(0).toUpperCase() +
                            vendor.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>{vendor.sales}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {vendor.joined}
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
                              Vendor Actions
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2">
                              <BadgeCheck className="h-4 w-4 text-emerald-500" />
                              Verify Vendor
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <UserCheck className="h-4 w-4 text-blue-500" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              Flag for Review
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-red-600">
                              <Ban className="h-4 w-4" />
                              Suspend Vendor
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-10 text-muted-foreground text-sm"
                    >
                      No vendors match your criteria.
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
