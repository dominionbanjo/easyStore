import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Receipt,
  User,
  Store,
  Calendar,
  CreditCard,
  Hash,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import type { IAdminTransaction } from "@/services/adminApi";
import { cn } from "@/lib/utils";

interface AdminTransactionDetailModalProps {
  transaction: IAdminTransaction | null;
  open: boolean;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  success:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  reversed: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
};

const InfoRow = ({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex items-start gap-3 py-3", className)}>
    <div className="mt-0.5 p-1.5 rounded-sm bg-muted/60 flex-shrink-0">
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
        {label}
      </p>
      <div className="text-sm text-foreground font-medium mt-0.5">
        {value ?? (
          <span className="text-muted-foreground text-xs italic">N/A</span>
        )}
      </div>
    </div>
  </div>
);

export function AdminTransactionDetailModal({
  transaction,
  open,
  onClose,
}: AdminTransactionDetailModalProps) {
  if (!transaction) return null;

  const amount = transaction.amount / 100;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-sm bg-primary/10">
              <Receipt className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                Transaction Details
              </DialogTitle>
              <DialogDescription className="text-xs">
                Ref: {transaction.id.substring(0, 8).toUpperCase()}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Amount and Status Card */}
          <div className="p-6 rounded-sm bg-muted/30 border border-border/40 text-center space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
              Total Amount
            </p>
            <h2 className="text-3xl font-black tracking-tight">
              {transaction.currency}{" "}
              {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
            <Badge
              className={cn(
                "mt-2 px-3 py-1 rounded-sm text-xs font-bold border-none capitalize",
                statusColors[transaction.status],
              )}
            >
              {transaction.status}
            </Badge>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 gap-1">
            <InfoRow
              icon={Hash}
              label="Transaction ID"
              value={
                <code className="text-[11px] bg-muted px-1.5 py-0.5 rounded-sm uppercase">
                  {transaction.id}
                </code>
              }
            />
            <Separator className="opacity-40" />
            <InfoRow
              icon={Calendar}
              label="Date & Time"
              value={format(new Date(transaction.created_at), "PPP 'at' p")}
            />
            <Separator className="opacity-40" />
            <InfoRow
              icon={CreditCard}
              label="Type"
              value={
                <span className="capitalize">
                  {transaction.type.replace(/_/g, " ")}
                </span>
              }
            />
            <Separator className="opacity-40" />
            <InfoRow
              icon={AlertCircle}
              label="Description"
              value={transaction.description}
              className="items-start"
            />
          </div>

          {/* Parties Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Parties Involved
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {/* Customer */}
              <div className="flex items-center gap-3 p-3 rounded-sm border border-border/40 bg-background">
                <div className="h-9 w-9 rounded-sm bg-blue-100 flex items-center justify-center text-blue-600">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">
                    Customer
                  </p>
                  <p className="text-sm font-bold truncate">
                    {transaction.user
                      ? `${transaction.user.first_name} ${transaction.user.last_name}`
                      : "Guest"}
                  </p>
                  {transaction.user?.email && (
                    <p className="text-xs text-muted-foreground truncate">
                      {transaction.user.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Vendor */}
              <div className="flex items-center gap-3 p-3 rounded-sm border border-border/40 bg-background">
                <div className="h-9 w-9 rounded-sm bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Store className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">
                    Vendor / Store
                  </p>
                  <p className="text-sm font-bold truncate">
                    {transaction.vendor?.store?.store_name ?? "Platform"}
                  </p>
                  {transaction.vendor?.store?.category && (
                    <p className="text-xs text-muted-foreground truncate">
                      {transaction.vendor.store.category}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button
            className="flex-1 gap-2"
            variant="default"
            onClick={() => window.print()}
          >
            <Receipt className="h-4 w-4" /> Print Receipt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
