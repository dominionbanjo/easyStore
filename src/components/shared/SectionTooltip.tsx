import { InfoCircle } from "iconsax-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SectionTooltipProps {
  content: string;
}

export function SectionTooltip({ content }: SectionTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="rounded-full flex items-center justify-center text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <InfoCircle className="h-4 w-4" variant="Bulk" color="currentColor" />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        align="start"
        className="max-w-[250px] p-3 text-xs leading-relaxed bg-neutral-900 border-white/10 text-white dark:bg-neutral-800 dark:border-white/10 dark:text-neutral-100 shadow-xl"
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
