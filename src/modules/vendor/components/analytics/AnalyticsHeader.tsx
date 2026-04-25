import { Button } from "@/components/ui/button";
import { Download, Calendar } from "lucide-react";

export function AnalyticsHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div></div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <Button
          variant="outline"
          className="rounded-sm h-11 px-5 border-border/60 bg-card/50 backdrop-blur-sm gap-2 flex-1 md:flex-none"
        >
          <Calendar className="w-4 h-4 text-emerald-500" />
          <span>Last 30 Days</span>
        </Button>
        <Button className="rounded-sm h-11 px-5   gap-2 flex-1 md:flex-none">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </Button>
      </div>
    </div>
  );
}
