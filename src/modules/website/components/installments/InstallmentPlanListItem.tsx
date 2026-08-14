import { Link } from "react-router-dom";
import { ChevronRight, CalendarClock, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { planStatusConfig } from "@/modules/admin/columns/installmentColumns";
import { cn } from "@/lib/utils";
import type { InstallmentPlanView } from "@/types/installment/installmentTypes";
import { ACCOUNT_ROUTES } from "@/routes";

interface InstallmentPlanListItemProps {
  plan: InstallmentPlanView;
}

export function InstallmentPlanListItem({ plan }: InstallmentPlanListItemProps) {
  const config = planStatusConfig[plan.status] ?? planStatusConfig.active;
  const percent = Math.min(
    Math.round((plan.paid_kobo / Math.max(plan.total_kobo, 1)) * 100),
    100,
  );
  const nextDue = plan.next_due_date
    ? new Date(plan.next_due_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Link to={`${ACCOUNT_ROUTES.INSTALLMENTS}/${plan.id}`} className="block group">
      <Card className="p-4 sm:p-5 rounded-sm border-border/40 hover:border-primary/30 transition-all hover:shadow-sm group-hover:bg-muted/10 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-black text-foreground truncate">
              Plan #{plan.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">
              Order #{plan.order_id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge
              variant="outline"
              className={cn(
                "px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm border",
                config.className,
              )}
            >
              {config.label}
            </Badge>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between mb-1.5">
            <p className="text-lg font-black text-foreground">
              ₦{(plan.paid_kobo / 100).toLocaleString()}
              <span className="text-xs text-muted-foreground font-semibold">
                {" "}
                / ₦{(plan.total_kobo / 100).toLocaleString()}
              </span>
            </p>
            <span className="text-base font-black text-primary">{percent}%</span>
          </div>
          <div className="h-1.5 w-full rounded-sm bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <CreditCard className="h-3.5 w-3.5" />
            {plan.installments_paid}/{plan.installments_total} paid
            <span className="text-border">|</span>
            {plan.mode === "auto" ? "Auto-Pay" : "Manual"}
          </div>
          {plan.status === "active" && nextDue && (
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary">
              <CalendarClock className="h-3.5 w-3.5" />
              Due {nextDue}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
