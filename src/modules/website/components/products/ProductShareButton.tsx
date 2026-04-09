import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Loader2 } from "lucide-react";
import * as htmlToImage from "html-to-image";
import { toast } from "sonner";
import { getBaseDomain } from "@/utils/subdomain";

interface ProductShareButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number | null;
    image?: string | null;
    vendor: string;
    storeSlug: string;
  };
}

export function ProductShareButton({ product }: ProductShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (!cardRef.current) return;

      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 0.95,
        backgroundColor: "#ffffff",
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File(
        [blob],
        `${product.name.replace(/\s+/g, "-").toLowerCase()}.png`,
        { type: "image/png" },
      );

      const baseDomain = getBaseDomain();
      const storeUrl = `${window.location.protocol}//${product.storeSlug}.${baseDomain}/products/${product.id}`;

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Check out ${product.name} on ${product.vendor}`,
          text: `I found this amazing product: ${product.name} for ₦${Number(product.price).toLocaleString()} at ${product.vendor}.`,
          url: storeUrl,
          files: [file],
        });
      } else if (navigator.share) {
        // Fallback to URL only if file sharing is not supported
        await navigator.share({
          title: `Check out ${product.name} on ${product.vendor}`,
          text: `I found this amazing product: ${product.name} for ₦${Number(product.price).toLocaleString()} at ${product.vendor}.`,
          url: storeUrl,
        });
      } else {
        // Ultimate fallback to generic clipboard copy
        await navigator.clipboard.writeText(storeUrl);
        toast.success("Product link copied to clipboard!");
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Sharing failed", err);
        // Fallback to clipboard
        const baseDomain = getBaseDomain();
        const storeUrl = `${window.location.protocol}//${product.storeSlug}.${baseDomain}/products/${product.id}`;

        await navigator.clipboard.writeText(storeUrl);
        toast.success("Product link copied to clipboard!");
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleShare}
        disabled={isSharing}
        className="rounded-full w-10 h-10 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
        title="Share Product"
      >
        {isSharing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Share2 className="w-5 h-5" />
        )}
      </Button>

      {/* Hidden card to generate image from */}
      <div className="overflow-hidden absolute top-[-9999px] left-[-9999px] w-[500px]">
        <div
          ref={cardRef}
          className="bg-white p-8 font-outfit rounded-xl border border-gray-100 flex flex-col gap-4 w-[500px]"
        >
          <div className="flex items-center justify-between">
            <span className="font-black text-2xl tracking-tighter text-emerald-600 uppercase">
              EasyStore
            </span>
            <span className="text-sm font-bold bg-neutral-100 px-3 py-1 rounded-sm text-neutral-600">
              {product.vendor}
            </span>
          </div>

          {product.image && (
            <div className="w-full flex justify-center py-4">
              <img
                src={product.image}
                alt="product"
                crossOrigin="anonymous"
                className="w-[350px] h-[350px] object-cover rounded-md border border-neutral-100 shadow-sm"
              />
            </div>
          )}

          <div className="space-y-2 text-center mt-2">
            <h2 className="text-3xl font-black tracking-tight text-neutral-900">
              {product.name}
            </h2>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl font-black text-emerald-600">
                ₦{Number(product.price).toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xl font-medium text-neutral-400 line-through">
                  ₦{Number(product.originalPrice).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
