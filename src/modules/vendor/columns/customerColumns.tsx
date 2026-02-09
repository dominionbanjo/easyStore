import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, Mail, MapPin, Copy, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

export interface ICustomer {
  id: string;
  name: string;
  email: string;
  phone_number: string | null;
  location: string | null;
  orders_count: number;
  total_spent: string;
  rating: string;
  last_order_at: string | null;
  created_at: string;
}

export const createCustomerColumns = (
  _onViewDetails: (customer: ICustomer) => void,
): ColumnDef<ICustomer>[] => [
  {
    accessorKey: "name",
    header: "Customer",
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <div className="flex items-center gap-3 max-w-[200px]">
          <Avatar className="h-8 w-8 border border-border/50 shrink-0">
            <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">
              {customer.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-foreground truncate">
            {customer.name}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Mail className="w-3.5 h-3.5" />
          <span className="truncate max-w-[180px]">{email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const location = row.getValue("location") as string | null;
      return (
        <div className="flex items-center gap-2 text-muted-foreground italic">
          <MapPin className="w-3.5 h-3.5" />
          <span>{location || "N/A"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "orders_count",
    header: "Orders",
    cell: ({ row }) => {
      const count = row.getValue("orders_count") as number;
      return (
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="bg-primary/5 text-primary border-primary/10"
          >
            {count} {count === 1 ? "order" : "orders"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "total_spent",
    header: "Total Spent",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total_spent") as string);
      return (
        <div className="font-bold text-foreground">
          ₦{amount.toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "last_order_at",
    header: "Last Order",
    cell: ({ row }) => {
      const date = row.getValue("last_order_at") as string | null;
      if (!date)
        return (
          <span className="text-muted-foreground text-xs italic">
            No orders yet
          </span>
        );
      return (
        <div className="text-sm text-muted-foreground">
          {format(new Date(date), "MMM d, yyyy")}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;

      const handleCopyPhone = () => {
        if (customer.phone_number) {
          navigator.clipboard.writeText(customer.phone_number);
          toast.success("Phone number copied to clipboard");
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-muted translation-all"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 p-1">
            <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Customer Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleCopyPhone}
              disabled={!customer.phone_number}
              className="px-2 py-2 cursor-pointer flex items-center gap-2 text-sm"
            >
              <Copy className="w-4 h-4" />
              Copy Phone Number
              {customer.phone_number && (
                <span className="ml-auto text-[10px] text-muted-foreground font-mono">
                  {customer.phone_number}
                </span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="px-2 py-2 cursor-pointer flex items-center gap-2 text-sm"
              onClick={() =>
                (window.location.href = `mailto:${customer.email}`)
              }
            >
              <Mail className="w-4 h-4" />
              Contact Customer
            </DropdownMenuItem>
            {customer.phone_number && (
              <DropdownMenuItem
                className="px-2 py-2 cursor-pointer flex items-center gap-2 text-sm"
                onClick={() =>
                  (window.location.href = `tel:${customer.phone_number}`)
                }
              >
                <Phone className="w-4 h-4" />
                Call Customer
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
