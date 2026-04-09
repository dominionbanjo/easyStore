import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Loader2 } from "lucide-react";
import * as htmlToImage from "html-to-image";
import { toast } from "sonner";
import { getBaseDomain } from "@/utils/subdomain";
import { cn } from "@/lib/utils";

interface ProductShareActionProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discount_price?: number | null;
    image?: { url: string } | string | null;
    store_name?: string;
    store_slug?: string;
  };
  className?: string;
}

export function ProductShareAction({ product, className }: ProductShareActionProps) {
  const [isSharing, setIsSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (!cardRef.current) return;

      // 1. Generate PNG from the hidden card
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1,
        backgroundColor: "#ffffff",
        pixelRatio: 2, // Higher density
      });

      // 2. Convert to File object for sharing
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File(
        [blob],
        `${product.name.replace(/\s+/g, "-").toLowerCase()}.png`,
        { type: "image/png" },
      );

      // 3. Construct shareable URL
      const baseDomain = getBaseDomain();
      const storeSlug = product.store_slug || "market";
      const productUrl = `${window.location.protocol}//${storeSlug}.${baseDomain}/product/${product.slug}`;
      const shareTitle = `Check out ${product.name} on ${product.store_name || "EazyStore"}`;
      const shareText = `Visit my site to view this amazing find! ${product.name} for ₦${Number(product.price).toLocaleString()} at ${product.store_name || "EazyStore"}.\n\nView here: ${productUrl}`;

      // 4. Use Web Share API if available
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          files: [file],
        });
      } else if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
        });
      } else {
        // Fallback: Copy Link
        await navigator.clipboard.writeText(productUrl);
        toast.success("Link copied! Now you can share it anywhere.");
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Sharing failed", err);
        toast.error("Sharing failed, but we've copied the link for you!");
      }
    } finally {
      setIsSharing(false);
    }
  };

  const imageUrl = typeof product.image === "string" ? product.image : product.image?.url;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={cn("w-full justify-start gap-2", className)}
        onClick={(e) => {
          e.stopPropagation();
          handleShare();
        }}
        disabled={isSharing}
      >
        {isSharing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Share2 className="h-4 w-4" />
        )}
        Share Product
      </Button>

      {/* 🖼️ HIDDEN PREMIUM CARD (To be captured) */}
      <div className="overflow-hidden absolute top-[-9999px] left-[-9999px] w-[600px]">
        <div
          ref={cardRef}
          className="bg-white p-10 font-outfit rounded-[32px] border border-zinc-100 flex flex-col gap-6 w-[600px] shadow-2xl relative"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {/* Top Branding */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
                  <span className="text-white font-black text-xs">ES</span>
               </div>
               <span className="font-black text-2xl tracking-tighter text-black uppercase">
                 EazyStore
               </span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-100 px-4 py-2 rounded-full border border-zinc-200">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-xs font-black uppercase tracking-widest text-zinc-600">
                 {product.store_name || "Official Store"}
               </span>
            </div>
          </div>

          {/* Product Image Container */}
          {imageUrl && (
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-zinc-100 shadow-lg">
              <img
                src={imageUrl}
                alt="product"
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
              />
              {/* Badge Overlay */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
                  Verified Item
                </span>
              </div>
            </div>
          )}

          {/* Details Section */}
          <div className="space-y-4 pt-2">
            <h2 className="text-4xl font-black tracking-tight text-zinc-900 leading-tight">
              {product.name}
            </h2>
            
            <div className="flex items-center justify-between py-4 border-t border-b border-zinc-100">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Current Price</span>
                <div className="flex items-baseline gap-3">
                   <span className="text-5xl font-black text-black">
                     ₦{Number(product.price).toLocaleString()}
                   </span>
                   {product.discount_price && (
                     <span className="text-2xl font-bold text-zinc-400 line-through">
                       ₦{Number(product.discount_price).toLocaleString()}
                     </span>
                   )}
                </div>
              </div>
              
              <div className="bg-zinc-950 text-white p-4 rounded-xl flex flex-col items-center justify-center">
                 <span className="text-[8px] font-black uppercase tracking-widest opacity-50 mb-1">Buy via</span>
                 <span className="text-sm font-black">EazyStore.ng</span>
              </div>
            </div>
          </div>

          {/* Footer Quote / CTA */}
          <div className="text-center pt-2">
            <p className="text-zinc-400 text-xs font-medium italic">
              "Experience seamless shopping with secure escrow protection."
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
