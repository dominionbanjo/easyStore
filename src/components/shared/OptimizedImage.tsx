import { memo, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  buildCloudinaryUrl,
  DEFAULT_FALLBACK_IMAGE,
  getQualityTier,
  isCloudinaryUrl,
  isCloudinaryVideoUrl,
  shouldDropHiDpi,
} from "@/utils/imageDelivery";
import { IMAGE_RECIPES, type ImageRecipeName } from "@/utils/imageRecipes";

interface OptimizedImageProps {
  src: string;
  alt: string;
  recipe?: ImageRecipeName;
  widths?: number[];
  sizes?: string;
  priority?: boolean;
  aspectRatio?: string;
  objectFit?: "cover" | "contain";
  className?: string;
  wrapperClassName?: string;
  fallback?: string;
}

export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  recipe,
  widths: widthOverride,
  sizes: sizesOverride,
  priority = false,
  aspectRatio = "1 / 1",
  objectFit = "cover",
  className,
  wrapperClassName,
  fallback = DEFAULT_FALLBACK_IMAGE,
}: OptimizedImageProps) {
  const [isError, setIsError] = useState(false);
  const [useRawFallback, setUseRawFallback] = useState(false);
  const isCloudinary =
    isCloudinaryUrl(src) && !isCloudinaryVideoUrl(src);

  const effectiveWidths = useMemo(() => {
    const base =
      widthOverride ?? (recipe ? IMAGE_RECIPES[recipe].widths : [400]);
    return shouldDropHiDpi() && base.length > 1 ? [base[0]] : base;
  }, [widthOverride, recipe]);

  const sizes = sizesOverride ?? (recipe ? IMAGE_RECIPES[recipe].sizes : "100vw");
  const quality = getQualityTier();

  const srcset = useMemo(() => {
    if (!isCloudinary || useRawFallback) return undefined;
    return effectiveWidths
      .map((width) => {
        const transformedUrl = buildCloudinaryUrl(src, { width, quality });
        return `${transformedUrl} ${width}w`;
      })
      .join(", ");
  }, [isCloudinary, effectiveWidths, src, quality, useRawFallback]);

  const resolvedSrc = !isCloudinary
    ? src
    : useRawFallback
      ? src
      : buildCloudinaryUrl(src, { width: effectiveWidths[0], quality });

  const handleError = () => {
    if (isCloudinary && !useRawFallback) {
      setUseRawFallback(true);
      return;
    }
    setIsError(true);
  };

  if (isError) {
    return (
      <img
        src={fallback}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn("w-full h-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted/40",
        wrapperClassName,
      )}
      style={{ aspectRatio }}
    >
      <img
        src={resolvedSrc}
        srcSet={srcset}
        sizes={srcset ? sizes : undefined}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        onError={handleError}
        className={cn(
          "w-full h-full select-none",
          objectFit === "cover" ? "object-cover" : "object-contain",
          className,
        )}
      />
    </div>
  );
});
