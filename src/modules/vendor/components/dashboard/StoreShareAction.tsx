import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Loader2, Store, ShoppingBag } from "lucide-react";
import * as htmlToImage from "html-to-image";
import { toast } from "sonner";
import { getBaseDomain } from "@/utils/subdomain";
import { cn } from "@/lib/utils";
import { useGetStoreProductsQuery } from "@/services/storeApi";

interface StoreShareActionProps {
  store?: any;
  className?: string;
}

export function StoreShareAction({ store, className }: StoreShareActionProps) {
  const [isSharing, setIsSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Fetch a few products to showcase on the flyer
  const { data: productsData } = useGetStoreProductsQuery(
    { slug: store?.slug, limit: 3 },
    { skip: !store?.slug },
  );

  const products = productsData?.data?.items || [];

  const handleShare = async () => {
    if (!store) {
      toast.error("Store details not loaded yet.");
      return;
    }

    const baseDomain = getBaseDomain();
    const slug = store.slug;
    const storeUrl = slug
      ? `${window.location.protocol}//${slug}.${baseDomain}`
      : `${window.location.protocol}//${baseDomain}/stores/${store.id}`;

    setIsSharing(true);
    try {
      if (!cardRef.current) return;

      // 1. Generate PNG from the hidden card
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1,
        backgroundColor: "#ffffff",
        pixelRatio: 2, // Higher density
        skipFonts: false,
      });

      // 2. Convert to File object for sharing
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File(
        [blob],
        `${store.store_name?.replace(/\s+/g, "-").toLowerCase()}-store.png`,
        { type: "image/png" },
      );

      // 3. Construct share text
      const shareTitle = `Visit ${store.store_name} on EazyStore`;
      const shareText = `Check out our amazing products at ${store.store_name}! 🚀\n\nShop here: ${storeUrl}`;

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
        await navigator.clipboard.writeText(storeUrl);
        toast.success("Link copied! Now you can share your store anywhere.");
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Sharing failed", err);
        // Fallback: Copy Link
        await navigator.clipboard.writeText(storeUrl);
        toast.success("Link copied to clipboard!");
      }
    } finally {
      setIsSharing(false);
    }
  };

  const storeLogo =
    typeof store?.logo === "string" ? store.logo : store?.logo?.url;
  const storeBanner =
    typeof store?.banner === "string" ? store.banner : store?.banner?.url;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={cn("flex gap-2 border-border/60", className)}
        onClick={handleShare}
        disabled={isSharing || !store}
      >
        {isSharing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Share2 className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">
          {isSharing ? "Preparing..." : "Share Store"}
        </span>
      </Button>

      {/* 🖼️ HIDDEN PREMIUM CARD (To be captured) */}
      <div className="overflow-hidden absolute top-[-9999px] left-[-9999px] w-[800px]">
        <div
          ref={cardRef}
          className="bg-zinc-50 font-outfit flex flex-col w-[800px] h-auto shadow-2xl relative"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {/* Top Banner Section */}
          <div className="h-64 w-full relative bg-zinc-200 overflow-hidden">
            {storeBanner ? (
              <img
                src={storeBanner}
                crossOrigin="anonymous"
                alt="Store Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-700" />
            )}

            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-xl mb-4">
                {storeLogo ? (
                  <img
                    src={storeLogo}
                    crossOrigin="anonymous"
                    alt="Store Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store className="h-10 w-10 text-zinc-300" />
                )}
              </div>
              <h1 className="text-5xl font-black text-white tracking-tight drop-shadow-md">
                {store?.store_name}
              </h1>
              {store?.description && (
                <p className="text-white/90 text-lg mt-2 font-medium max-w-[600px] line-clamp-2 drop-shadow-sm">
                  {store.description}
                </p>
              )}
            </div>
          </div>

          {/* Products Showcase Section */}
          {products.length > 0 && (
            <div className="p-8 bg-white border-t border-zinc-200">
              <div className="flex items-center justify-center gap-2 mb-6">
                <ShoppingBag className="text-emerald-600 h-5 w-5" />
                <h2 className="text-xl font-bold text-zinc-800 uppercase tracking-widest">
                  Featured Products
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {products.map((product: any) => {
                  const pImage =
                    typeof product.image === "string"
                      ? product.image
                      : product.image?.url;
                  const isSale = product.on_sale && product.discount_price > 0;

                  return (
                    <div
                      key={product.id}
                      className="flex flex-col gap-3 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100 p-2 shadow-sm"
                    >
                      <div className="aspect-square w-full relative rounded-lg overflow-hidden bg-zinc-200">
                        {pImage && (
                          <img
                            src={pImage}
                            crossOrigin="anonymous"
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="px-2 pb-2">
                        <p className="font-bold text-zinc-900 text-lg truncate mb-1">
                          {product.name}
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="font-black text-emerald-600 text-xl">
                            ₦
                            {Number(
                              isSale ? product.discount_price : product.price,
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer Ribbon */}
          <div className="bg-zinc-950 p-6 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-emerald-400 font-bold text-sm tracking-widest uppercase mb-1">
                Shop Directly At:
              </span>
              <span className="text-white font-black text-3xl">
                {store?.slug
                  ? `${store.slug}.eazystore.com.ng`
                  : "eazystore.com.ng"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
