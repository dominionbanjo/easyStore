import React, { useState, useRef } from "react";
import { Send, Plus, X, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { IProduct } from "@/types/product/productTypes";

interface MessageInputProps {
  onSend: (content: string, product?: IProduct | null) => void;
  onTyping: () => void;
  onStopTyping: () => void;
  onOpenProductPicker: () => void;
  attachedProduct: IProduct | null;
  onClearProduct: () => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onTyping,
  onStopTyping,
  onOpenProductPicker,
  attachedProduct,
  onClearProduct,
  disabled,
}) => {
  const [content, setContent] = useState("");
  const typingTimerRef = useRef<any>(null);

  const handleSend = () => {
    if ((!content.trim() && !attachedProduct) || disabled) return;
    onSend(content.trim(), attachedProduct);
    setContent("");
    onClearProduct();
    onStopTyping();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
    onTyping();

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      onStopTyping();
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="p-4 bg-white dark:bg-neutral-950 border-t border-border">
      {/* Attached Product Preview */}
      {attachedProduct && (
        <div className="mb-3 p-3 bg-primary/5 border border-primary/20 rounded-sm flex items-center gap-3 fade-in relative">
          <div className="h-10 w-10 rounded-sm overflow-hidden border border-primary/10">
            {attachedProduct.image ? (
              <img 
                src={typeof attachedProduct.image === "string" ? attachedProduct.image : attachedProduct.image.url} 
                alt="" 
                className="h-full w-full object-cover" 
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center">
                <Package className="h-4 w-4" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">Product Attached</p>
            <p className="text-sm font-bold truncate">{attachedProduct.name}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-destructive"
            onClick={onClearProduct}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-muted-foreground rounded-sm hover:bg-muted"
          onClick={onOpenProductPicker}
          disabled={disabled}
        >
          <Plus className={cn("h-5 w-5 transition-transform", attachedProduct && "rotate-45")} />
        </Button>

        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={(!content.trim() && !attachedProduct) || disabled}
          className="rounded-sm px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
