import { Button } from "@/components/ui/button";
import { Download, Calendar } from "lucide-react";

interface AnalyticsHeaderProps {
  storeName?: string;
}

export function AnalyticsHeader({ storeName }: AnalyticsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Analytics Overview
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-muted-foreground text-sm">
            Performance insights for{" "}
            <span className="text-emerald-500 font-bold">
              {storeName || "your store"}
            </span>
          </p>
          <div className="w-1 h-1 rounded-full bg-border" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            Refreshed just now
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <Button
          variant="outline"
          className="rounded-xl h-11 px-5 border-border/60 bg-card/50 backdrop-blur-sm gap-2 flex-1 md:flex-none"
        >
          <Calendar className="w-4 h-4 text-emerald-500" />
          <span>Last 30 Days</span>
        </Button>
        <Button className="rounded-xl h-11 px-5 shadow-lg shadow-primary/20 gap-2 flex-1 md:flex-none">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </Button>
      </div>
    </div>
  );
}
