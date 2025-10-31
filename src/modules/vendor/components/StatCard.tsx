"use client";

import { Card } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

export function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="p-5 flex items-center gap-4 border border-border/30 hover:shadow-md transition-all">
      <div className="p-3 rounded-full bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-xl font-semibold text-foreground">{value}</p>
      </div>
    </Card>
  );
}
