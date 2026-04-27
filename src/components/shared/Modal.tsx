import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModalProps extends React.ComponentProps<typeof Dialog> {
  title?: string;
  description?: string;
  className?: string;
  contentClassName?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  onClose?: () => void;
}

export function Modal({
  title,
  description,
  className,
  contentClassName,
  footer,
  children,
  onClose,
  ...props
}: ModalProps) {
  return (
    <Dialog {...props}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "z-[200] sm:max-w-[425px] overflow-hidden p-0 gap-0 flex flex-col",
          "max-h-[calc(100dvh-40px)] sm:max-h-[calc(100dvh-80px)]",
          // Mobile: Position above BottomNav with gaps
          "max-sm:fixed max-sm:bottom-[90px] max-sm:top-auto max-sm:left-[4vw] max-sm:translate-x-0 max-sm:translate-y-0 max-sm:w-[92vw] max-sm:max-h-[calc(100dvh-180px)] max-sm:rounded-sm",
          className
        )}
      >
        <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0 sticky top-0 bg-background z-10">
          <div className="flex flex-col gap-1">
            <DialogTitle className={cn("text-lg font-semibold", !title && "sr-only")}>
              {title || "Modal Dialog"}
            </DialogTitle>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {/* Default Close Button in Header */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-sm shrink-0 text-muted-foreground hover:bg-muted flex"
            onClick={() => {
              if (onClose) {
                onClose();
              } else {
                props.onOpenChange?.(false);
              }
            }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>


        <div className={cn("flex-1 overflow-y-auto custom-scrollbar min-h-0", contentClassName)}>
          <div className="flex flex-col min-h-full">
            {children}
          </div>
        </div>

        {/* Sticky footer — always visible, never scrolls */}
        {footer && (
          <div className="shrink-0 border-t bg-background">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
