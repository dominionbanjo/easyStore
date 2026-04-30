import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Export } from "iconsax-react";
import * as htmlToImage from "html-to-image";
import { toast } from "sonner";
import { getBaseDomain, areSubdomainsDisabled } from "@/utils/subdomain";
import { cn } from "@/lib/utils";

interface ProductShareButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number | null;
    image?: string | null;
    vendor: string;
    storeSlug: string;
    slug: string;
  };
  variant?: "ghost" | "outline" | "solid" | "icon";
  label?: string;
  className?: string;
  iconClassName?: string;
}

export function ProductShareButton({ 
  product, 
  variant = "icon", 
  label = "Share Product",
  className,
  iconClassName
}: ProductShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSharing(true);
    
    try {
      const baseDomain = getBaseDomain();
      const isLocal = areSubdomainsDisabled();
      
      // Generate the correct product URL based on context (local vs production)
      const productUrl = isLocal
        ? `${window.location.protocol}//${baseDomain}/stores/${product.storeSlug}/products/${product.slug}`
        : `${window.location.protocol}//${product.storeSlug}.${baseDomain}/products/${product.slug}`;
        
      const shareTitle = `Check out ${product.name} on EazyStore`;
      const shareText = `Visit eazystore to discover this: ${product.name} for ₦${Number(product.price).toLocaleString()} at ${product.vendor}.\n\nView here: ${productUrl}`;

      // Try to generate image if possible
      let file: File | null = null;
      if (cardRef.current) {
        try {
          const dataUrl = await htmlToImage.toPng(cardRef.current, {
            quality: 0.95,
            backgroundColor: "#ffffff",
            cacheBust: true,
          });

          const blob = await (await fetch(dataUrl)).blob();
          file = new File(
            [blob],
            `${product.name.replace(/\s+/g, "-").toLowerCase()}.png`,
            { type: "image/png" },
          );
        } catch (imgErr) {
          console.warn("Image generation failed, falling back to text-only share", imgErr);
        }
      }

      if (navigator.share) {
        const shareData: ShareData = {
          title: shareTitle,
          text: shareText,
          url: productUrl,
        };

        if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
          shareData.files = [file];
        }

        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(productUrl);
        toast.success("Product link copied to clipboard!");
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Sharing failed", err);
        toast.error("Failed to share product. Link copied instead.");
        
        const baseDomain = getBaseDomain();
        const productUrl = areSubdomainsDisabled()
            ? `${window.location.protocol}//${baseDomain}/stores/${product.storeSlug}/products/${product.slug}`
            : `${window.location.protocol}//${product.storeSlug}.${baseDomain}/products/${product.slug}`;
            
        await navigator.clipboard.writeText(productUrl);
      }
    } finally {
      setIsSharing(false);
    }
  };

  const isIconOnly = variant === "icon";

  return (
    <>
      <Button
        variant={variant === "solid" ? "default" : variant === "icon" ? "ghost" : variant}
        size={isIconOnly ? "icon" : "default"}
        onClick={handleShare}
        disabled={isSharing}
        className={cn(
          isIconOnly && "rounded-full w-10 h-10 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors",
          !isIconOnly && "gap-2 font-bold rounded-2xl",
          className
        )}
        title={label}
      >
        {isSharing ? (
          <Loader2 className={cn("animate-spin", isIconOnly ? "w-4 h-4" : "w-4 h-4")} />
        ) : (
          <Export variant="Outline" color="currentColor" className={cn(isIconOnly ? "w-5 h-5" : "w-4 h-4", iconClassName)} />
        )}
        {!isIconOnly && <span>{label}</span>}
      </Button>

      {/* Hidden card to generate image from */}
      <div className="overflow-hidden absolute top-[-9999px] left-[-9999px] w-[500px]">
        <div
          ref={cardRef}
          className="bg-white p-8 font-outfit rounded-xl border border-gray-100 flex flex-col gap-4 w-[500px]"
        >
          <div className="flex items-center justify-between">
            <span className="font-black text-2xl tracking-tighter text-indigo-600 uppercase">
              EazyStore
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
              <span className="text-4xl font-black text-indigo-600">
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

