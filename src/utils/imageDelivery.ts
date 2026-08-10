const CLOUDINARY_URL_PATTERN = /(https?:\/\/res\.cloudinary\.com\/[^/]+\/(image|video)\/upload\/)(.*)$/;

const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=1200&q=60";

type QualityTier = "auto" | "eco";

export const isCloudinaryUrl = (url: string): boolean =>
  CLOUDINARY_URL_PATTERN.test(url);

export const isCloudinaryVideoUrl = (url: string): boolean => {
  const match = CLOUDINARY_URL_PATTERN.exec(url);
  return match?.[2] === "video";
};

const isReducedData = (): boolean => {
  try {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-data: reduce)").matches
    );
  } catch {
    return false;
  }
};

const getEffectiveType = (): string => {
  try {
    return (
      (navigator as { connection?: { effectiveType?: string } }).connection
        ?.effectiveType ?? ""
    );
  } catch {
    return "";
  }
};

export const isSlowConnection = (): boolean => {
  if (isReducedData()) return true;
  return ["slow-2g", "2g", "3g"].includes(getEffectiveType());
};

export const getQualityTier = (): QualityTier =>
  isSlowConnection() ? "eco" : "auto";

export const shouldDropHiDpi = (): boolean => isSlowConnection();

const qualityParam = (quality: QualityTier): string =>
  quality === "eco" ? "q_auto:eco" : "q_auto";

const buildTransform = (width: number, quality: QualityTier): string =>
  `f_auto,${qualityParam(quality)},w_${width}`;

export const buildCloudinaryUrl = (
  url: string,
  options: { width?: number; quality?: QualityTier } = {},
): string => {
  const match = CLOUDINARY_URL_PATTERN.exec(url);
  if (!match) return url;

  const prefix = match[1];
  const remainder = match[3];

  const quality = options.quality ?? getQualityTier();
  const transform = options.width
    ? buildTransform(options.width, quality)
    : `f_auto,${qualityParam(quality)}`;

  const versionMatch = remainder.match(/^v\d+\//);
  if (versionMatch) {
    return `${prefix}${transform}/${remainder}`;
  }

  const hasTransform = /^[^/]+,[^/]+,w_\d+(\/|$)/.test(remainder);
  if (hasTransform) {
    const segments = remainder.split("/");
    segments[0] = transform;
    return `${prefix}${segments.join("/")}`;
  }

  return `${prefix}${transform}/${remainder}`;
};

export const getSrcSet = (
  url: string,
  widths: number[],
  quality?: QualityTier,
): string =>
  widths
    .map((width) => `${buildCloudinaryUrl(url, { width, quality })} ${width}w`)
    .join(", ");

export { DEFAULT_FALLBACK_IMAGE };
