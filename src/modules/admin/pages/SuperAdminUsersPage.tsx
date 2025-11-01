import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
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
  UserPlus,
  ShieldCheck,
  AlertTriangle,
  Ban,
  UserCheck,
  Mail,
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

// Mock user dataset
const users = [
  {
    id: "u101",
    name: "John Doe",
    email: "john@example.com",
    country: "Nigeria",
    status: "active",
    verified: true,
    joined: "2024-10-01",
    type: "guest",
  },
  {
    id: "u102",
    name: "Mary Okafor",
    email: "mary.okafor@stayafrika.com",
    country: "Ghana",
    status: "restricted",
    verified: false,
    joined: "2024-08-12",
    type: "vendor",
  },
  {
    id: "u103",
    name: "David Chen",
    email: "david@explora.ng",
    country: "Kenya",
    status: "banned",
    verified: false,
    joined: "2023-12-30",
    type: "guest",
  },
  {
    id: "u104",
    name: "Sophia Bello",
    email: "sophia@urbanstayz.com",
    country: "Nigeria",
    status: "active",
    verified: true,
    joined: "2025-01-11",
    type: "vendor",
  },
  {
    id: "u105",
    name: "Liam Jones",
    email: "liam@stayafrika.africa",
    country: "South Africa",
    status: "pending",
    verified: false,
    joined: "2024-11-14",
    type: "guest",
  },
];

const statusColors: Record<string, string> = {
  active:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  restricted:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  banned: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  pending: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
};

export default function SuperAdminUsersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "active" | "restricted" | "banned" | "pending"
  >("all");

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || u.status === filter;
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
          <h1 className="text-2xl font-bold tracking-tight">
            Users Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor all registered users, review their activity, and manage
            account access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" /> Add User
          </Button>
        </div>
      </motion.div>

      {/* ─── Search + Filters ─── */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-3"
      >
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex items-center gap-2">
          {(["all", "active", "restricted", "banned", "pending"] as const).map(
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

      {/* ─── Users Table ─── */}
      <Card className="border border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle>Users Overview</CardTitle>
          <CardDescription>
            Manage account lifecycle, verify identities, and control platform
            access.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto rounded-md border border-border/20">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Account Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, i) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border/20 hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.country}</TableCell>
                      <TableCell className="capitalize">{user.type}</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            statusColors[user.status]
                          )}
                        >
                          {user.status.charAt(0).toUpperCase() +
                            user.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {user.verified ? (
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                            <ShieldCheck className="h-4 w-4" /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-muted-foreground text-xs">
                            <AlertTriangle className="h-4 w-4" /> Not Verified
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.joined}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2">
                              <UserCheck className="h-4 w-4 text-blue-500" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <ShieldCheck className="h-4 w-4 text-emerald-500" />
                              Verify User
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Mail className="h-4 w-4 text-gray-500" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-yellow-600">
                              <AlertTriangle className="h-4 w-4" />
                              Restrict Account
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-red-600">
                              <Ban className="h-4 w-4" />
                              Ban User
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
                      No users match your criteria.
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
