import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  UserCog,
  Plus,
  Trash2,
  Edit,
  Search,
  Filter,
  Settings,
  ShieldAlert,
} from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

const mockRoles = [
  {
    id: 1,
    role: "Super Admin",
    description: "Full access to all features, vendors, and system settings.",
    users: 3,
    permissions: ["read", "write", "delete", "manage"],
    status: "active",
  },
  {
    id: 2,
    role: "Platform Admin",
    description: "Can manage vendors, users, and moderate reports.",
    users: 7,
    permissions: ["read", "write", "manage"],
    status: "active",
  },
  {
    id: 3,
    role: "Vendor Manager",
    description: "Manages vendors’ onboarding and product approvals.",
    users: 10,
    permissions: ["read", "write"],
    status: "active",
  },
  {
    id: 4,
    role: "Support Staff",
    description: "Handles customer support tickets and refund requests.",
    users: 14,
    permissions: ["read"],
    status: "restricted",
  },
];

export default function SuperAdminAccessControlPage() {
  const [search, setSearch] = useState("");

  const filteredRoles = mockRoles.filter(
    (r) =>
      r.role.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()),
  );

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
          <h1 className="text-2xl font-bold tracking-tight">Access Control</h1>
          <p className="text-sm text-muted-foreground">
            Manage roles, permissions, and access levels across the platform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Role
          </Button>
        </div>
      </motion.div>

      {/* ─── Search Bar ─── */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full md:max-w-xs"
      >
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search roles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </motion.div>

      {/* ─── Roles Table ─── */}
      <Card className="border border-border/40 ">
        <CardHeader>
          <CardTitle>Roles & Permissions</CardTitle>
          <CardDescription>
            Overview of user roles and their corresponding permissions.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto rounded-sm border border-border/20">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredRoles.length > 0 ? (
                  filteredRoles.map((role, i) => (
                    <motion.tr
                      key={role.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border/20 hover:bg-muted/50"
                    >
                      <TableCell className="font-semibold">
                        {role.role}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {role.description}
                      </TableCell>
                      <TableCell>{role.users}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.map((p) => (
                            <Badge
                              key={p}
                              variant="secondary"
                              className="capitalize"
                            >
                              {p}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch checked={role.status === "active"} />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" /> Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">
                              <Trash2 className="h-4 w-4 mr-2" /> Delete Role
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-muted-foreground text-sm"
                    >
                      No roles found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ─── Access Overview Summary ─── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
      >
        {[
          { icon: Shield, label: "Total Roles", value: "8" },
          { icon: UserCog, label: "Admins with Elevated Access", value: "12" },
          { icon: Lock, label: "Restricted Accounts", value: "4" },
          { icon: ShieldAlert, label: "Pending Role Reviews", value: "2" },
        ].map((item, i) => (
          <Card
            key={i}
            className="border border-border/30  flex items-center gap-4 p-4 sm:p-5"
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
