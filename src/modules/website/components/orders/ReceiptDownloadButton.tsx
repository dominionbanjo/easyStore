import { FileText, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetOrderReceiptMutation } from "@/services/ordersApi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { extractErrorMessage } from "@/utils/errorHandler";

interface ReceiptDownloadButtonProps {
  orderId: string;
  className?: string;
  variant?: "outline" | "ghost" | "default" | "secondary";
  showText?: boolean;
}

export function ReceiptDownloadButton({
  orderId,
  className,
  variant = "outline",
  showText = false,
}: ReceiptDownloadButtonProps) {
  const [getOrderReceipt, { isLoading }] = useGetOrderReceiptMutation();

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await getOrderReceipt(orderId).unwrap();

      const receiptData = response.data;
      if (response.status === "success" && receiptData?.data) {
        // Convert base64 to Blob
        let base64String = receiptData.data;

        // Handle potential data URI prefix
        if (base64String.includes(",")) {
          base64String = base64String.split(",")[1];
        }

        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });

        // Trigger Download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const fileName =
          receiptData.filename ||
          `receipt-${orderId.split("-")[0].toUpperCase()}.pdf`;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();

        // Cleanup
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("Receipt downloaded successfully");
      } else {
        toast.error(response.message || "Failed to generate receipt");
      }
    } catch (error: unknown) {
      console.error("Receipt Download Error:", error);
      toast.error(
        extractErrorMessage(
          error,
          "An error occurred while downloading the receipt",
        ),
      );
    }
  };

  return (
    <Button
      variant={variant}
      size={showText ? "sm" : "icon"}
      className={cn(
        "rounded-sm border-emerald-600/30 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-300",
        className,
      )}
      onClick={handleDownload}
      disabled={isLoading}
      title="Download Receipt"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : showText ? (
        <>
          <FileText className="h-4 w-4 mr-2" />
          Download Receipt
        </>
      ) : (
        <Download className="h-4 w-4" />
      )}
    </Button>
  );
}
