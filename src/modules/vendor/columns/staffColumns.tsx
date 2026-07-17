import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { StaffMember } from "@/services/staffApi";

export const staffColumns: ColumnDef<StaffMember>[] = [
  {
    id: "name",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar ?? undefined} />
            <AvatarFallback className="text-xs">
              {user.first_name?.[0]}{user.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{user.first_name} {user.last_name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variant = status === "active" ? "success" : status === "suspended" ? "destructive" : "warning";
      return <Badge variant={variant as any}>{status}</Badge>;
    },
  },
  {
    accessorKey: "last_login_at",
    header: "Last Login",
    cell: ({ row }) => {
      const date = row.original.last_login_at;
      if (!date) return <span className="text-muted-foreground text-sm">Never</span>;
      return <span className="text-sm">{new Date(date).toLocaleDateString()}</span>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Added",
    cell: ({ row }) => <span className="text-sm">{new Date(row.original.created_at).toLocaleDateString()}</span>,
  },
];
