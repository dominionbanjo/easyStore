import { useState } from "react";
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
  const [open, setOpen] = useState(false);

  return (
    <Tooltip open={open} onOpenChange={setOpen} delayDuration={0}>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="rounded-full flex items-center justify-center text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
          // Toggle on click/tap
          onClick={(e) => {
            e.stopPropagation();
            setOpen((prev) => !prev);
          }}
          // Hover support - only for actual mouse pointers
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") setOpen(true);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") setOpen(false);
          }}
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
