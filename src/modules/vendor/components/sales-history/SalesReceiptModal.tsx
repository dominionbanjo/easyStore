import { useRef } from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useGetReceiptDataQuery } from "@/services/salesHistoryApi";
import type { ReceiptItem } from "@/services/salesHistoryApi";

interface Props {
  orderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusLabel: Record<string, string> = {
  completed: "Completed",
  pending: "Pending",
  processing: "Processing",
  paid: "Paid",
  canceled: "Canceled",
};

const paymentStatusLabel: Record<string, string> = {
  unpaid: "Unpaid",
  success: "Paid",
  pending: "Pending",
  failed: "Failed",
};

const methodLabel: Record<string, string> = {
  offline: "In-Store",
  online: "Online",
  cash: "Cash",
  panda: "Escrow",
};

function formatPrice(kobo: number) {
  return `₦${(kobo / 100).toLocaleString()}`;
}

function V({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export function SalesReceiptModal({ orderId, open, onOpenChange }: Props) {
  const printRef = useRef<HTMLDivElement>(null);
  const { data: receipt, isLoading } = useGetReceiptDataQuery(orderId!, { skip: !orderId });

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !receipt) return;

    const itemsHtml = (receipt.items ?? []).map(
      (item: ReceiptItem) =>
        `<tr>
          <td style="padding:3px 0">${item.name}${item.variant_options ? ` (${Object.values(item.variant_options).join(", ")})` : ""} x${item.quantity}</td>
          <td style="text-align:right;padding:3px 0">${formatPrice(item.unit_price * item.quantity)}</td>
        </tr>`
    ).join("");

    printWindow.document.write(`
      <html><head>
        <title>Receipt - ${receipt.store_name}</title>
        <style>
          @page { width: 80mm; margin: 0; }
          body { font-family: 'Courier New', monospace; font-size: 11px; width: 72mm; margin: 0 auto; padding: 8px; }
          .header { text-align: center; margin-bottom: 10px; }
          .header h2 { margin: 0; font-size: 15px; }
          .header p { margin: 1px 0; font-size: 10px; color: #555; }
          .meta { font-size: 10px; margin-bottom: 6px; }
          .meta span { display: block; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 3px 0; text-align: left; }
          th { border-bottom: 1px dashed #999; font-size: 10px; }
          .total-row { font-weight: bold; font-size: 13px; }
          .footer { text-align: center; margin-top: 10px; font-size: 9px; color: #888; }
          hr { border: none; border-top: 1px dashed #999; margin: 6px 0; }
        </style>
      </head><body>
        <div class="header">
          <h2>${receipt.store_name}</h2>
          <p>${new Date(receipt.created_at).toLocaleString()}</p>
          <p style="font-size:10px">${receipt.order_reference}</p>
        </div>
        <div class="meta">
          <span>Payment: ${methodLabel[receipt.payment_method] || receipt.payment_method} — ${paymentStatusLabel[receipt.payment_status] || receipt.payment_status}</span>
          ${receipt.staff_name ? `<span>Staff: ${receipt.staff_name}</span>` : ""}
        </div>
        <hr/>
        <table>
          <tr><th>Item</th><th style="text-align:right">Amount</th></tr>
          ${itemsHtml}
        </table>
        <hr/>
        <div style="text-align:right;font-size:10px">
          <div>Subtotal: ${formatPrice(receipt.subtotal)}</div>
          ${receipt.tax ? `<div>Tax: ${formatPrice(receipt.tax)}</div>` : ""}
        </div>
        <div class="total-row" style="text-align:right">Total: ${formatPrice(receipt.total)}</div>
        ${receipt.notes ? `<p style="margin-top:6px;font-size:10px">${receipt.notes}</p>` : ""}
        <hr/>
        <div class="footer">Thank you for your patronage!</div>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  if (isLoading || !receipt) {
    return (
      <Modal open={open} onOpenChange={onOpenChange} disableOutsideClick title="Receipt">
        <div className="py-8 text-center text-muted-foreground">Loading receipt...</div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} disableOutsideClick title={`Receipt ${receipt.order_reference}`} description={receipt.store_name}>
      <div ref={printRef} className="space-y-3 font-mono text-sm p-4">
        {/* Header */}
        <div className="text-center border-b pb-3">
          <h3 className="font-bold text-lg">{receipt.store_name}</h3>
          <p className="text-muted-foreground text-xs">{receipt.order_reference}</p>
          <p className="text-muted-foreground text-xs">{new Date(receipt.created_at).toLocaleString()}</p>
        </div>

        {/* Meta info */}
        <div className="grid grid-cols-2 gap-1 text-xs border-b pb-2">
          <V label="Payment" value={methodLabel[receipt.payment_method] || receipt.payment_method} />
          <V label="Status" value={paymentStatusLabel[receipt.payment_status] || receipt.payment_status} />
          {receipt.staff_name && <V label="Staff" value={receipt.staff_name} />}
          <V label="Order Status" value={statusLabel[receipt.status] || receipt.status} />
        </div>

        {/* Items */}
        <div className="space-y-1">
          {(receipt.items ?? []).map((item: ReceiptItem, idx: number) => {
            const variantLabel = item.variant_options
              ? Object.values(item.variant_options).join(", ")
              : null;
            return (
              <div key={idx} className="flex justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{item.name}</p>
                  {variantLabel && (
                    <p className="text-xs text-muted-foreground truncate">{variantLabel}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(item.unit_price)} x {item.quantity}
                  </p>
                </div>
                <span className="font-medium whitespace-nowrap">
                  {formatPrice(item.unit_price * item.quantity)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Totals */}
        <div className="border-t pt-2 space-y-1 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatPrice(receipt.subtotal)}</span>
          </div>
          {receipt.tax > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Tax</span>
              <span>{formatPrice(receipt.tax)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base border-t pt-1">
            <span>Total</span>
            <span>{formatPrice(receipt.total)}</span>
          </div>
        </div>

        {receipt.notes && (
          <p className="text-xs text-muted-foreground border-t pt-2 italic">{receipt.notes}</p>
        )}

        <div className="text-center text-xs text-muted-foreground pt-1">
          Thank you for your patronage!
        </div>
      </div>

      <div className="flex gap-3 justify-end items-center px-6 py-4 border-t">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print Receipt
        </Button>
      </div>
    </Modal>
  );
}
