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
  children: React.ReactNode;
  onClose?: () => void;
}

export function Modal({
  title,
  description,
  className,
  contentClassName,
  children,
  onClose,
  ...props
}: ModalProps) {
  return (
    <Dialog {...props}>
      <DialogContent
        showCloseButton={false}
        className={cn("sm:max-w-[425px] overflow-hidden p-0 gap-0", className)}
      >
        <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0 sticky top-0 bg-background z-10">
          <div className="flex flex-col gap-1">
            {title && (
              <DialogTitle className="text-lg font-semibold">
                {title}
              </DialogTitle>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full shrink-0 text-muted-foreground hover:bg-muted"
            onClick={() => {
              if (onClose) {
                onClose();
              } else {
                // The Dialog primitive handles internal state if controlled,
                // but if we are just using the props.onOpenChange we rely on that.
                // However, we want to ensure clicking this triggers closure.
                props.onOpenChange?.(false);
              }
            }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <div className={cn("p-6", contentClassName)}>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
